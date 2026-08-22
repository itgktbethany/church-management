"use server";

import { adminMessaging } from "@/lib/firebase/admin";

/**
 * Sends a "Welcome to FaithFlow" notification to a single FCM token.
 * Called immediately after a user grants notification permission, so only
 * they receive it (not a broadcast to all users).
 */
export async function sendWelcomeNotification(token: string) {
  try {
    await adminMessaging.send({
      token,
      // Top-level notification: required for iOS Web Push
      notification: {
        title: "Welcome to FaithFlow 🎉",
        body: "You're all set! You'll now receive updates about devotionals and your groups.",
      },
      webpush: {
        notification: {
          title: "Welcome to FaithFlow 🎉",
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
