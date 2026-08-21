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

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        const notification = payload.notification;
        if (notification) {
          toast(notification.title, {
            description: notification.body,
            icon: "🔔",
            duration: 5000,
          });
        }
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
