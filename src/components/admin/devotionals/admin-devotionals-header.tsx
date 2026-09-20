"use client";

import { CreateDevotionalDialog } from "@/components/admin/devotionals/create-devotional-dialog";
import { BulkUploadDialog } from "@/components/admin/devotionals/bulk-upload-dialog";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";
import { useLanguage } from "@/components/language-provider";

export function AdminDevotionalsHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          {t("admin.devotionalsTitle")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("devotionals.subtitle")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <DownloadTemplateButton type="devotionals" />
        <BulkUploadDialog />
        <CreateDevotionalDialog />
      </div>
    </div>
  );
}
