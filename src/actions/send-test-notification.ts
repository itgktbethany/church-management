"use server";

import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { pushTokens } from "@/lib/db/schema";

export async function sendTestNotification() {
  const token = await db.query.pushTokens.findFirst();

  if (!token) {
    throw new Error("No push token found");
  }

const response = await adminMessaging.send({
  token: token.token,
  notification: {
    title: "CHMS",
    body: "Push notification pertama berhasil! 🎉",
  },
});

console.log("FCM Response:", response);

  return response;
}