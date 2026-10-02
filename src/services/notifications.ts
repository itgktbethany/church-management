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

export async function processPendingAlerts() {
  let processed = 0;
  
  console.log(`[processPendingAlerts] Checking pending alerts`);

  // 1. Fetch pending alerts
  const pendingAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.isActive, true),
        eq(alerts.sendPush, true),
        or(
          // Condition 1: Alerts ready to be sent (displayAt has arrived)
          and(
            isNotNull(alerts.displayAt),
            lte(alerts.displayAt, new Date()),
            or(
              isNull(alerts.publishedAt), // One-time, not yet published
              eq(alerts.scheduleType, "recurring") // Recurring
            )
          ),
          // Condition 2: Recurring alerts that need initialization
          and(
            eq(alerts.scheduleType, "recurring"),
            isNull(alerts.displayAt),
            isNotNull(alerts.cronExpression)
          )
        )
      )
    );

  if (pendingAlerts.length === 0) {
    return {
      processed: 0,
      success: true,
    };
  }

  console.log(`[processPendingAlerts] Found ${pendingAlerts.length} pending alerts`);

  for (const alert of pendingAlerts) {
    console.log(`[processPendingAlerts] Processing alert ID: ${alert.id}`);

    let nextDisplayAt = alert.displayAt;
    const isInitializing = alert.displayAt === null;

    if (isInitializing) {
      console.log(`[processPendingAlerts] displayAt is NULL, initializing...`);
    } else {
      console.log(`[processPendingAlerts] displayAt: ${alert.displayAt}`);
    }

    // 2. If recurring, calculate the next display time based on cronExpression
    if (alert.scheduleType === "recurring" && alert.cronExpression) {
      console.log(`[processPendingAlerts] cronExpression: ${alert.cronExpression}`);
      try {
        // Parse with Asia/Jakarta timezone so '34 21 * * *' becomes 21:34 WIB
        const interval = CronExpressionParser.parse(alert.cronExpression, { tz: "Asia/Jakarta" });
        nextDisplayAt = interval.next().toDate();
      } catch (err) {
        console.error(`[processPendingAlerts] Invalid cron expression for alert ${alert.id}`, err);
        continue; // Skip processing if cron is invalid
      }
    }

    // 3. Update the alert in the database
    const [updated] = await db
      .update(alerts)
      .set({ 
        // Only mark as published if we are actually sending it right now
        ...(isInitializing ? {} : { publishedAt: new Date() }),
        // Update displayAt to the next schedule for recurring, otherwise keep current
        displayAt: alert.scheduleType === "recurring" ? nextDisplayAt : alert.displayAt
      })
      .where(
        and(
          eq(alerts.id, alert.id),
          // Concurrency control: Ensure nobody else processed it at the same exact time
          isInitializing ? isNull(alerts.displayAt) : eq(alerts.displayAt, alert.displayAt!)
        )
      )
      .returning();

    if (!updated) {
      console.log(`[processPendingAlerts] Alert ${alert.id} already processed by another worker.`);
      continue; // Another process already claimed this alert
    }

    // If we were just initializing a new recurring alert, we don't send the push yet.
    // The alert is now primed with a valid displayAt in the future.
    if (isInitializing) {
      console.log(`[processPendingAlerts] Initialized recurring alert ID: ${alert.id} with next displayAt: ${nextDisplayAt}`);
      continue;
    }

    // 4. Send the push notification
    console.log(`[processPendingAlerts] Sending notification for alert ID: ${alert.id}`);
    await sendAlertNotification({
      title: alert.title,
      message: alert.message,
      targetType: alert.targetType,
    });
    console.log(`[processPendingAlerts] FCM success for alert ID: ${alert.id}. Next displayAt: ${nextDisplayAt}`);

    processed++;
  }

  console.log(`[processPendingAlerts] Completed. Processed ${processed} alerts.`);

  return {
    processed,
    success: true,
  };
}