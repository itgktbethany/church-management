import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { pushTokens } from "@/lib/db/schema";

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