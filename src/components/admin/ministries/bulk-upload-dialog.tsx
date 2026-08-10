"use client";

import { bulkCreateMinistries } from "@/actions/ministry";
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

type MinistryRow = {
  name: string;
  description: string;
  valid?: boolean;
};

export function BulkUploadMinistryDialog() {
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<MinistryRow[]>([]);

  async function handleSubmit() {
    if (isUploading) return;

    setIsUploading(true);

    try {
      const validRows = data.filter((item) => item.valid);

      if (validRows.length === 0) {
        toast.error("No valid rows");
        return;
      }

      const result = await bulkCreateMinistries(validRows);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(`${validRows.length} ministries uploaded`);
      setData([]);
      setOpen(false);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  function validateRows(rows: MinistryRow[]) {
    return rows.map((row) => ({
      ...row,
      valid: !!row.name,
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
      const validatedData = validateRows(json as MinistryRow[]);
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
          <DialogTitle>Bulk Upload Ministries</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: <strong>name</strong>,{" "}
              <strong>description</strong>
            </p>
            <DownloadTemplateButton type="ministries" variant="ghost" />
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
                <p className="font-medium">{item.name || "(missing name)"}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description || "No description"}
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
            {isUploading ? "Uploading..." : "Upload Ministries"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
