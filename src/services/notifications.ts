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
  
  // 1. Fetch pending alerts
  const pendingAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.isActive, true),
        eq(alerts.sendPush, true),
        lte(alerts.displayAt, new Date()), // Time to display has arrived
        isNotNull(alerts.displayAt),
        // Process if it's never been published OR if it's recurring
        or(
          isNull(alerts.publishedAt),
          eq(alerts.scheduleType, "recurring")
        )
      )
    );

  if (pendingAlerts.length === 0) {
    return {
      processed: 0,
      success: true,
    };
  }

  for (const alert of pendingAlerts) {
    let nextDisplayAt = alert.displayAt;

    // 2. If recurring, calculate the next display time based on cronExpression
    if (alert.scheduleType === "recurring" && alert.cronExpression) {
      try {
        const interval = CronExpressionParser.parse(alert.cronExpression);
        nextDisplayAt = interval.next().toDate();
      } catch (err) {
        console.error(`Invalid cron expression for alert ${alert.id}`, err);
        continue; // Skip processing if cron is invalid
      }
    }

    // 3. Update the alert in the database
    const [updated] = await db
      .update(alerts)
      .set({ 
        publishedAt: new Date(),
        // Update displayAt to the next schedule for recurring, otherwise keep current
        displayAt: alert.scheduleType === "recurring" ? nextDisplayAt : alert.displayAt
      })
      .where(
        and(
          eq(alerts.id, alert.id),
          // Concurrency control: Ensure nobody else processed it at the same exact time
          eq(alerts.displayAt, alert.displayAt!) 
        )
      )
      .returning();

    if (!updated) {
      continue; // Another process already claimed this alert
    }

    // 4. Send the push notification
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