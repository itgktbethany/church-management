import { getMessaging } from "firebase/messaging";
import { firebaseApp } from "./client";

export const messaging =
  typeof window !== "undefined"
    ? getMessaging(firebaseApp)
    : null;