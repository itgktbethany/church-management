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

    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission denied");
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