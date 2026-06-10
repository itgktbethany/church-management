"use server";

import { adminMessaging } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { pushTokens } from "@/lib/db/schema";
import { sendPushToAll } from "@/services/notifications";


export async function sendTestNotification() {
  return sendPushToAll(
    "CHMS",
    "SAAT TEDUH WOY"
  );
}


// export async function sendTestNotification() {
//   const token = await db.query.pushTokens.findFirst({
//     orderBy:(pushTokens,{desc}) => [
//       desc(pushTokens.createdAt),
//     ],
//   });

//   if (!token) {
//     throw new Error("No push token found");
//   }

// const response = await adminMessaging.send({
//   token: token.token,
//   notification: {
//     title: "CHMS",
//     body: "Push notification pertama berhasil! 🎉",
//   },
// });

// console.log("FCM Response:", response);

//   return response;
// }