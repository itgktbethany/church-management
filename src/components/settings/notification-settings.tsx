"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/firebase/request-permission";
import { savePushToken } from "@/actions/push-token";
import { sendTestNotification } from "@/actions/send-test-notification";
import { toast } from "sonner";
import { BellRing, Send } from "lucide-react";

export function NotificationSettings() {
  const [loadingEnable, setLoadingEnable] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);

  const handleEnable = async () => {
    setLoadingEnable(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await savePushToken(token);
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

  const handleTest = async () => {
    setLoadingTest(true);
    try {
      await sendTestNotification();
      toast.success("Test notification sent");
    } catch (error) {
      toast.error("Failed to send test notification");
    } finally {
      setLoadingTest(false);
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
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleTest} 
            disabled={loadingTest}
            className="flex-1 sm:flex-none"
          >
            <Send className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button 
            onClick={handleEnable} 
            disabled={loadingEnable}
            className="flex-1 sm:flex-none"
          >
            <BellRing className="w-4 h-4 mr-2" />
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}
