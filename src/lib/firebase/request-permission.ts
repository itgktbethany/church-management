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

    // Explicitly pass the service worker registration.
    // This is required on iOS to ensure FCM uses the correct SW scope.
    const swRegistration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js"
    );

    console.log("Getting FCM token...");
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      ...(swRegistration ? { serviceWorkerRegistration: swRegistration } : {}),
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