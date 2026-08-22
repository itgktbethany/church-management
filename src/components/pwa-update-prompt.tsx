"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Detects when the PWA's service worker has been updated and a new version
 * is ready, then prompts the user to reload.
 *
 * How it works:
 * 1. On mount, it calls registration.update() to ask the browser to check for
 *    a new SW immediately (instead of waiting up to 24 h for the browser's
 *    own check interval).
 * 2. It listens for the "controllerchange" event on navigator.serviceWorker,
 *    which fires after the new SW has called skipWaiting() and taken control
 *    of all open clients. At that point a reload is safe and will load the
 *    latest assets from the new SW's cache.
 * 3. A Sonner toast is shown with a "Reload" action so the user can update
 *    at a convenient moment without being force-reloaded mid-task.
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

    // Track if a reload prompt is already showing to avoid duplicate toasts
    let updatePromptShown = false;

    const handleControllerChange = () => {
      // controllerchange fires every time a new SW takes control, including
      // on initial install. Guard with a flag so we only prompt on real updates
      // (i.e. when there was already a controller before this one).
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
