import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { alerts ,pushTokens } from "@/lib/db/schema";
import { and, eq, isNotNull, isNull, lte } from "drizzle-orm";

export async function sendPushToAll(
  title: string,
  body: string
) {
  const tokens = await db.select().from(pushTokens);

  if (tokens.length === 0) {
    return {
      success: 0,
      failed: 0,
    };
  }

  let success = 0;
  let failed = 0;

  for (const token of tokens) {
    try {
      await adminMessaging.send({
        token: token.token,
        webpush: {
          notification: {
            title,
            body,
          },
        },
      });

      success++;
    } catch (error) {
      console.error(
        `Failed to send notification to token ${token.id}`,
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
}) {
  return sendPushToAll(
    alert.title,
    alert.message
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
    const result = await sendAlertNotification({
      title: alert.title,
      message: alert.message,
    });

    if (result.success > 0){
    await db
      .update(alerts)
      .set({
        publishedAt: new Date(),
      })
      .where(eq(alerts.id, alert.id));
    }
    processed++;
  }

  return {
    processed,
    success: true,
  };
}