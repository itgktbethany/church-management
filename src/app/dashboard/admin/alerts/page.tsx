import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { AlertTable } from "@/components/admin/alerts/alert-table";
import { CreateAlertDialog } from "@/components/admin/alerts/create-alert-dialog";

export default function AdminAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Alert Management
          </h1>

          <p className="text-muted-foreground">
            Manage church announcements and notifications.
          </p>
        </div>

        <CreateAlertDialog />
      </div>

      <AlertTable />
    </div>
  );
}