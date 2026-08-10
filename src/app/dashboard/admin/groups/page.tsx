import { GroupTable } from "@/components/admin/groups/group-table";
import { CreateGroupDialog } from "@/components/admin/groups/create-group-dialog";
import { BulkUploadDialog } from "@/components/admin/groups/bulk-upload-dialog";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";

export default function AdminGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Group Management
          </h1>

          <p className="text-muted-foreground">
            Manage church groups and their members.
          </p>
        </div>

        <div className="flex gap-2">
          <DownloadTemplateButton type="groups" />

          <BulkUploadDialog />

          <CreateGroupDialog />
        </div>
      </div>

      <GroupTable />
    </div>
  );
}