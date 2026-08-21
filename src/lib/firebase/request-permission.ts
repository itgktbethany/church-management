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

    // Wait for the service worker to be fully active before getting token.
    // navigator.serviceWorker.ready resolves only when the SW is installed & active,
    // preventing a race condition where the SW was registered but not yet controlling
    // the page when getToken() is called (especially relevant on iOS first-load).
    const swRegistration = await navigator.serviceWorker.ready;

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