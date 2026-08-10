import { DevotionalTable } from "@/components/admin/devotionals/devotional-table";
import { CreateDevotionalDialog } from "@/components/admin/devotionals/create-devotional-dialog";
import { BulkUploadDialog } from "@/components/admin/devotionals/bulk-upload-dialog";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";

export default function AdminDevotionalsPage() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Devotional Management
          </h1>

          <p className="text-muted-foreground">
            Manage devotionals and upload content
          </p>
        </div>

        <div className="flex gap-2">
          <DownloadTemplateButton type="devotionals" />

          <BulkUploadDialog />

          <CreateDevotionalDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Total Devotionals
          </p>

          <h2 className="text-2xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Published Today
          </p>

          <h2 className="text-2xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Scheduled
          </p>

          <h2 className="text-2xl font-bold">
            0
          </h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">
            Draft
          </p>

          <h2 className="text-2xl font-bold">
            0
          </h2>
        </div>
      </div>

      <DevotionalTable />

    </div>
  );
}