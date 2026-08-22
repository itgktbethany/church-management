"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Detects when the PWA's service worker has been updated and a new version
 * is ready, then prompts the user to reload.
 *
 * How it works:
 * 1. On mount, we snapshot navigator.serviceWorker.controller.
 *    - If it is null, there is no existing SW yet → the next controllerchange
 *      will be the initial install, NOT an update, so we ignore it.
 *    - If it is non-null, a real SW is already in control → the next
 *      controllerchange means a new version has replaced the old one.
 * 2. registration.update() is called so the browser checks for a new SW file
 *    immediately on every page load (default browser interval is up to 24 h).
 * 3. When a real update is detected, a persistent Sonner toast appears so the
 *    user can reload at a convenient moment instead of being force-reloaded.
 *
 * Works on both Android Chrome and iOS Safari (16.4+) PWAs.
 */
export function PwaUpdatePrompt() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    // Snapshot BEFORE attaching the listener.
    // null  → no SW active yet (first-ever visit / fresh install) → ignore first controllerchange.
    // non-null → an existing SW is already running → next controllerchange is a real update.
    const hadControllerOnMount = navigator.serviceWorker.controller !== null;
    let isFirstChange = true;
    let updatePromptShown = false;

    const handleControllerChange = () => {
      // Skip the very first controllerchange if there was no prior controller —
      // that event is just the initial SW install, not a version update.
      if (isFirstChange && !hadControllerOnMount) {
        isFirstChange = false;
        return;
      }
      isFirstChange = false;

      if (updatePromptShown) return;
      updatePromptShown = true;

      toast("A new version is available 🎉", {
        description: "Reload to get the latest updates.",
        duration: Infinity, // keep visible until the user acts
        action: {
          label: "Reload",
          onClick: () => window.location.reload(),
        },
      });
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );

    // Proactively check for a new SW version each time the page loads.
    // Without this, browsers only check every 24 h (or on navigation).
    navigator.serviceWorker.ready.then((registration) => {
      registration.update().catch(() => {
        // update() can fail when offline — silently ignore
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
    };
  }, []);

  return null;
}
