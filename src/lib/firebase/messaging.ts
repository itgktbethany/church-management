import { getMessaging, isSupported } from "firebase/messaging";
import { firebaseApp } from "./client";

// isSupported() must be awaited — iOS Safari in PWA mode requires this check
// before initializing messaging to prevent crashes on unsupported browsers.
export const messagingPromise: Promise<ReturnType<typeof getMessaging> | null> =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getMessaging(firebaseApp) : null))
    : Promise.resolve(null);