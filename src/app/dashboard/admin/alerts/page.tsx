import { AlertTable } from "@/components/admin/alerts/alert-table";
import { CreateAlertDialog } from "@/components/admin/alerts/create-alert-dialog";
import { BulkUploadDialog } from "@/components/admin/alerts/bulk-upload-dialog";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";

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

        <div className="flex gap-2">
          <DownloadTemplateButton type="alerts" />

          <BulkUploadDialog />

          <CreateAlertDialog />
        </div>
      </div>

      <AlertTable />
    </div>
  );
}