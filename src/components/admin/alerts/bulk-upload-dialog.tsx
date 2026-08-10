"use client";

import { bulkCreateAlerts } from "@/actions/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DownloadTemplateButton } from "@/components/admin/download-template-button";

type AlertRow = {
  title: string;
  message: string;
  send_push: string;
  target_type: string;
  display_at: string;
  valid?: boolean;
};

export function BulkUploadDialog() {
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<AlertRow[]>([]);

  async function handleSubmit() {
    if (isUploading) return;

    setIsUploading(true);

    try {
      const validRows = data.filter((item) => item.valid);

      if (validRows.length === 0) {
        toast.error("No valid rows");
        return;
      }

      const result = await bulkCreateAlerts(validRows);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(`${validRows.length} alerts uploaded`);
      setData([]);
      setOpen(false);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  function validateRows(rows: AlertRow[]) {
    return rows.map((row) => ({
      ...row,
      valid: !!row.title && !!row.message,
    }));
  }

  function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result, {
        type: "binary",
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const validatedData = validateRows(json as AlertRow[]);
      setData(validatedData);
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Excel
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Alerts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: <strong>title</strong>,{" "}
              <strong>message</strong>, <strong>send_push</strong>,{" "}
              <strong>target_type</strong>, <strong>display_at</strong>
            </p>
            <DownloadTemplateButton type="alerts" variant="ghost" />
          </div>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="
              w-full rounded-lg border bg-background text-sm text-muted-foreground
              file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2
              file:text-sm file:font-medium file:text-primary-foreground
              file:cursor-pointer hover:file:opacity-90
            "
          />

          <div className="rounded-lg border p-4">
            <p className="font-medium">
              Rows found: {data.length}
            </p>
          </div>

          {data.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 flex items-center justify-between ${
                item.valid ? "" : "border-red-500"
              }`}
            >
              <div>
                <p className="font-medium">{item.title || "(missing title)"}</p>
                <p className="text-sm text-muted-foreground">
                  {item.message || "(missing message)"}
                </p>
              </div>
              <Badge variant={item.valid ? "default" : "destructive"}>
                {item.valid ? "Valid" : "Invalid"}
              </Badge>
            </div>
          ))}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              isUploading ||
              data.length === 0 ||
              data.every((item) => !item.valid)
            }
          >
            {isUploading ? "Uploading..." : "Upload Alerts"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}