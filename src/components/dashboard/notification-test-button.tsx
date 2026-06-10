"use client";

import { Button } from "@/components/ui/button";
import { requestNotificationPermission } from "@/lib/firebase/request-permission";
import { savePushToken } from "@/actions/push-token";

export function NotificationTestButton() {
  return (
    <Button
      onClick={async () => {
        const token = await requestNotificationPermission();

        console.log("Generated token:", token);

        if (token) {
          await savePushToken(token);

          console.log("Token saved to database");
        }
      }}
    >
      Enable Notifications
    </Button>
  );
}