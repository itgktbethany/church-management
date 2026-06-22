import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { GroupTable } from "@/components/admin/groups/group-table";
import { CreateGroupDialog } from "@/components/admin/groups/create-group-dialog";

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

        <CreateGroupDialog />
      </div>

      <GroupTable />
    </div>
  );
}