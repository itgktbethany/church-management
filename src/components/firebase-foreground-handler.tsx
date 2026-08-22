"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messagingPromise } from "@/lib/firebase/messaging";
import { toast } from "sonner";

export function FirebaseForegroundHandler() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupForegroundListener() {
      const messaging = await messagingPromise;
      if (!messaging) return;

      unsubscribe = onMessage(messaging, async (payload) => {
        console.log("Foreground message received:", payload);
        const notification = payload.notification;
        if (!notification) return;

        // Show a real OS notification via the service worker even when the app
        // is foregrounded. Without this, Android only shows an in-app toast and
        // iOS shows nothing at all when the page is active.
        if ("serviceWorker" in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(notification.title ?? "", {
              body: notification.body,
              icon: "/gkt-logo.png",
              badge: "/gkt-logo.png",
            });
          } catch (err) {
            // Fallback: SW showNotification failed (e.g. permission not granted yet),
            // the toast below will still surface the message in-app.
            console.warn("SW showNotification failed, falling back to toast:", err);
          }
        }

        // Keep the in-app toast as a secondary indicator while the user is active.
        toast(notification.title, {
          description: notification.body,
          icon: "🔔",
          duration: 5000,
        });
      });
    }

    setupForegroundListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return null;
}
