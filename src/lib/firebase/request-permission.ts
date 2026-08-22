"use client";

import { getToken } from "firebase/messaging";
import { messagingPromise } from "./messaging";
import { savePushToken } from "@/actions/push-token";

export async function requestNotificationPermission() {
  try {
    const messaging = await messagingPromise;

    if (!messaging) {
      console.log("Firebase Messaging is not supported on this browser.");
      return null;
    }

    // Notification.requestPermission() is intentionally NOT called here.
    // On iOS Safari, it MUST be the first await in the direct user gesture
    // handler (NotificationSettings.handleEnable). Calling it here — after
    // `await messagingPromise` — would break the iOS gesture chain and cause
    // the permission prompt to be silently blocked.
    // The caller is responsible for requesting permission before invoking this.
    if (Notification.permission !== "granted") {
      console.log("Notification permission not granted.");
      return null;
    }

    // Explicitly fetch the Firebase SW registration instead of using
    // navigator.serviceWorker.ready, which resolves to whichever SW is
    // currently active (could be the PWA's sw.js). Binding getToken() to the
    // wrong SW produces a valid-looking token that never delivers messages.
    const swRegistration =
      (await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js")) ??
      (await navigator.serviceWorker.ready);

    console.log("Getting FCM token...");
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: swRegistration,
    });

    console.log("FCM Token:", token);

    if (token) {
      await savePushToken(token);
    }

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}