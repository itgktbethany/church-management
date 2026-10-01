import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { alerts, pushTokens, user } from "@/lib/db/schema";
import { and, eq, isNotNull, isNull, lte } from "drizzle-orm";

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
    let processed = 0
  const pendingAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.isActive, true),
        eq(alerts.sendPush, true),
        isNull(alerts.publishedAt),
        lte(alerts.displayAt, new Date()),
        isNotNull(alerts.displayAt)
      )
    );

  if (pendingAlerts.length === 0) {
    return {
      processed: 0,
      success: true,
    };
  }

  for (const alert of pendingAlerts) {
    const [updated] = await db
      .update(alerts)
      .set({ publishedAt: new Date() })
      .where(
        and(
          eq(alerts.id, alert.id),
          isNull(alerts.publishedAt)
        )
      )
      .returning();

    if (!updated) {
      continue; // Another process already claimed this alert
    }

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