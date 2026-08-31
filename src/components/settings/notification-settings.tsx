"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/firebase/request-permission";
import { sendWelcomeNotification } from "@/actions/send-welcome-notification";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export function NotificationSettings() {
  const [loadingEnable, setLoadingEnable] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const handleEnable = async () => {
    setLoadingEnable(true);
    try {
      if (!("Notification" in window)) {
        toast.error("Notifications are not supported on this browser.");
        return;
      }

      // iOS Safari CRITICAL: Notification.requestPermission() MUST be called
      // as the very first await in a direct user gesture handler. Any prior
      // async operation (including await messagingPromise) breaks iOS's gesture
      // chain — the permission prompt will never appear or will be silently
      // denied. This is the #1 reason push notifications fail on iOS PWAs.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permission denied. Please allow notifications in Safari settings.");
        return;
      }

      // Permission is already granted — requestNotificationPermission will skip
      // the requestPermission call and proceed directly to getToken.
      const token = await requestNotificationPermission();
      if (token) {
        await sendWelcomeNotification(token);
        toast.success("Notifications enabled successfully");
        setEnabled(true);
      } else {
        toast.error("Failed to get notification token. Please try again.");
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setLoadingEnable(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Push Notifications</p>
          <p className="text-sm text-muted-foreground">
            Receive updates about daily devotionals and your groups.
          </p>
        </div>

        <Button
          onClick={handleEnable}
          disabled={loadingEnable || enabled}
          className="w-full sm:w-auto"
        >
          <BellRing className="w-4 h-4 mr-2" />
          {loadingEnable ? "Enabling..." : enabled ? "Enabled" : "Enable"}
        </Button>
      </div>
    </div>
  );
}
