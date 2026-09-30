"use server";

import { adminMessaging } from "@/lib/firebase/admin";

/**
 * Sends a "Welcome to myMSK" notification to a single FCM token.
 * Called immediately after a user grants notification permission, so only
 * they receive it (not a broadcast to all users).
 */
export async function sendWelcomeNotification(token: string) {
  try {
    await adminMessaging.send({
      token,
      // NOTE: No top-level `notification` key.
      // Omitting it prevents FCM from auto-displaying a notification on
      // Chrome/Android, which would duplicate what the SW's push handler shows.
      // The SW (firebase-messaging-sw.js) handles display for all platforms.
      webpush: {
        notification: {
          title: "Welcome to myMSK 🎉",
          body: "You're all set! You'll now receive updates about devotionals and your groups.",
          // Use the same icon as sendPushToAll — iOS silently drops pushes
          // when the icon path is invalid or the image is too small.
          icon: "/gkt-logo.png",
          badge: "/icons/icon-192x192.png",
        },
      },
    });
  } catch (error) {
    // Non-fatal: welcome notification failure shouldn't break the enable flow
    console.error("Failed to send welcome notification:", error);
  }
}
