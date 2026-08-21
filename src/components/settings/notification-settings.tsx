"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/firebase/request-permission";
import { sendWelcomeNotification } from "@/actions/send-welcome-notification";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export function NotificationSettings() {
  const [loadingEnable, setLoadingEnable] = useState(false);

  const handleEnable = async () => {
    setLoadingEnable(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        // Send a welcome notification to this user only
        await sendWelcomeNotification(token);
        toast.success("Notifications enabled successfully");
      } else {
        toast.error("Permission denied or failed to get token");
      }
    } catch (error) {
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
          disabled={loadingEnable}
          className="w-full sm:w-auto"
        >
          <BellRing className="w-4 h-4 mr-2" />
          {loadingEnable ? "Enabling..." : "Enable"}
        </Button>
      </div>
    </div>
  );
}
