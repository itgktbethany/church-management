"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "./messaging";
import { savePushToken } from "@/actions/push-token";

export async function requestNotificationPermission() {
  try {
    console.log("Requesting Permission")
    const permission = await Notification.requestPermission();

    console.log("Permission:", permission)

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    if (!messaging) {
      console.log("Messaging not initialized");
      return null;
    }

    console.log("Getting FCM token...");
    console.log(
  "VAPID:",
  process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    console.log("FCM Token:", token);

    if (token){
        await savePushToken(token);
    }

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}