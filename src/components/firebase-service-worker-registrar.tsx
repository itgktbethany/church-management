"use client";

import { useEffect } from "react";

/**
 * Explicitly registers the Firebase service worker on every page load.
 * This is required for iOS Safari PWAs — the browser does NOT auto-register
 * the SW like Android/Chrome does. Without this, no push subscription is ever
 * created on iOS and notifications silently fail.
 *
 * updateViaCache: "none" prevents iOS from serving a stale cached SW after
 * code updates, which would silently break push delivery.
 */
export function FirebaseServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/firebase-messaging-sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .then((registration) => {
        console.log(
          "[SW] Registered with scope:",
          registration.scope
        );
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
