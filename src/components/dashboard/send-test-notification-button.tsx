"use client";

import { Button } from "@/components/ui/button";
import { sendTestNotification } from "@/actions/send-test-notification";

export function SendTestNotificationButton() {
  return (
    <Button onClick={async () => {
      await sendTestNotification();
    }}>
      send Test Notification
    </Button>
  );
}
