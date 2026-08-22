"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type UpdateStatus = "idle" | "checking" | "up-to-date" | "update-found";

/**
 * A settings row that lets the user manually check for a PWA update.
 * Avoids the bad UX of auto-showing a toast on every page load.
 *
 * On click:
 * 1. Calls registration.update() to force the browser to fetch the latest SW.
 * 2. If a new SW is found it installs, then controllerchange fires → prompt reload.
 * 3. If already on the latest version, shows "Up to date" feedback inline.
 */
export function PwaUpdatePrompt() {
  const [status, setStatus] = useState<UpdateStatus>("idle");

  const handleCheck = async () => {
    if (!("serviceWorker" in navigator)) {
      toast.error("Service workers are not supported on this browser.");
      return;
    }

    setStatus("checking");

    try {
      const registration = await navigator.serviceWorker.ready;

      // Listen for a new SW installing — this means an update was found.
      let updateFound = false;

      const onUpdateFound = () => {
        updateFound = true;
        const newWorker = registration.installing;
        if (!newWorker) return;

        // Wait for the new SW to finish installing, then prompt reload.
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            setStatus("update-found");
            toast("Update ready 🎉", {
              description: "Tap Reload to apply the latest version.",
              duration: Infinity,
              action: {
                label: "Reload",
                onClick: () => window.location.reload(),
              },
            });
          }
        });
      };

      registration.addEventListener("updatefound", onUpdateFound);

      // Ask the browser to fetch the latest SW file right now.
      await registration.update();

      // Give the browser a moment to detect and start installing the new SW.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      registration.removeEventListener("updatefound", onUpdateFound);

      if (!updateFound) {
        setStatus("up-to-date");
        // Reset back to idle after a few seconds
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("idle");
      toast.error("Could not check for updates. Are you online?");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">App Version</p>
        <p className="text-sm text-muted-foreground">
          Check if a newer version of the app is available.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleCheck}
        disabled={status === "checking"}
        className="w-full sm:w-auto shrink-0"
      >
        {status === "checking" ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Checking…
          </>
        ) : status === "up-to-date" ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Up to date
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check for update
          </>
        )}
      </Button>
    </div>
  );
}

