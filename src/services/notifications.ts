import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { alerts, pushTokens, user } from "@/lib/db/schema";
import { and, eq, isNotNull, isNull, lte, or } from "drizzle-orm";
import { CronExpressionParser } from "cron-parser";

export async function sendPushToAll(
  title: string,
  body: string,
  targetType: string = "all"
) {
  // Build the query: join pushTokens → user so we can filter by role
  const rows = await db
    .select({ token: pushTokens.token, id: pushTokens.id })
    .from(pushTokens)
    .innerJoin(user, eq(pushTokens.userId, user.id))
    // When targetType is "all" we include everyone; otherwise filter by role
    .where(
      targetType === "all"
        ? undefined
        : eq(user.role, targetType)
    );

  if (rows.length === 0) {
    return {
      success: 0,
      failed: 0,
    };
  }

  let success = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await adminMessaging.send({
        token: row.token,
        // NOTE: No top-level `notification` key here.
        // Passing it would cause FCM to auto-display a notification on
        // Chrome/Android, which then collides with the SW's own showNotification()
        // call and produces duplicate notifications.
        // The SW's onBackgroundMessage / push handlers are solely responsible
        // for rendering the notification.
        webpush: {
          notification: {
            title,
            body,
            // icon is required — iOS silently drops notifications without one
            icon: "/gkt-logo.png",
            badge: "/gkt-logo.png",
          },
        },
      });

      success++;
    } catch (error) {
      console.error(
        `Failed to send notification to token ${row.id}`,
        error
      );

      failed++;
    }
  }

  return {
    success,
    failed,
  };
}

export async function sendAlertNotification(alert: {
  title: string;
  message: string;
  targetType?: string;
}) {
  return sendPushToAll(
    alert.title,
    alert.message,
    alert.targetType ?? "all"
  );
}

/**
 * Compute the next UTC Date that a cron expression will fire after `after`.
 * Returns null if the expression is invalid.
 */
function getNextCronDate(cronExpression: string, after: Date): Date | null {
  try {
    const interval = CronExpressionParser.parse(cronExpression, {
      currentDate: after,
      tz: 'Asia/Jakarta',
    });
    return interval.next().toDate();
  } catch (err) {
    console.error("Invalid cron expression:", cronExpression, err);
    return null;
  }
}

export async function processPendingAlerts() {
  const now = new Date();
  let processed = 0;

  // ─── 1. ONE-TIME alerts ────────────────────────────────────────────────────
  // Fire once when displayAt has passed and publishedAt has not been set yet.
  const oneTimeAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.isActive, true),
        eq(alerts.sendPush, true),
        eq(alerts.scheduleType, "one_time"),
        isNull(alerts.publishedAt),
        isNotNull(alerts.displayAt),
        lte(alerts.displayAt, now)
      )
    );

  for (const alert of oneTimeAlerts) {
    // Optimistic lock: only proceed if we are the first to claim it
    const [claimed] = await db
      .update(alerts)
      .set({ publishedAt: now })
      .where(
        and(
          eq(alerts.id, alert.id),
          isNull(alerts.publishedAt)
        )
      )
      .returning();

    if (!claimed) continue; // Another process already claimed this alert

    await sendAlertNotification({
      title: alert.title,
      message: alert.message,
      targetType: alert.targetType,
    });

    processed++;
  }

  // ─── 2. RECURRING alerts ───────────────────────────────────────────────────
  // Fire when:
  //   a) nextFireAt is set and has passed, OR
  //   b) nextFireAt is NULL but displayAt has passed (first ever fire)
  const recurringAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.isActive, true),
        eq(alerts.sendPush, true),
        eq(alerts.scheduleType, "recurring"),
        isNotNull(alerts.cronExpression),
        or(
          // First fire: nextFireAt not yet initialised, use displayAt as the trigger
          and(
            isNull(alerts.nextFireAt),
            isNotNull(alerts.displayAt),
            lte(alerts.displayAt, now)
          ),
          // Subsequent fires
          and(
            isNotNull(alerts.nextFireAt),
            lte(alerts.nextFireAt, now)
          )
        )
      )
    );

  for (const alert of recurringAlerts) {
    if (!alert.cronExpression) continue;

    const nextFire = getNextCronDate(alert.cronExpression, now);
    if (!nextFire) continue; // Bad cron expression — skip silently

    // Optimistic lock: advance nextFireAt atomically so only one worker fires it
    const expectedNextFireAt = alert.nextFireAt; // may be null on first fire

    const [claimed] = await db
      .update(alerts)
      .set({ nextFireAt: nextFire, updatedAt: now })
      .where(
        and(
          eq(alerts.id, alert.id),
          // Match the exact current nextFireAt value (null or a specific timestamp)
          expectedNextFireAt === null
            ? isNull(alerts.nextFireAt)
            : eq(alerts.nextFireAt, expectedNextFireAt)
        )
      )
      .returning();

    if (!claimed) continue; // Another process already claimed this slot

    await sendAlertNotification({
      title: alert.title,
      message: alert.message,
      targetType: alert.targetType,
    });

    processed++;
  }

  return {
    processed,
    success: true,
  };
}