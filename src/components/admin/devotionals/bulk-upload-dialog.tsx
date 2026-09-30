"use client";

import { bulkCreateDevotionals }
from "@/actions/devotional";

import { toast }
from "sonner";

import { useRouter }
from "next/navigation";

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

type DevotionalRow = {
  title: string;
  verse: string;
  bible_reading: string;
  content: string;
  publishDate: string;
  valid?: boolean;
};


export function BulkUploadDialog() {

  const [isUploading, setIsUploading] = useState(false);

    const router = useRouter();

async function handleSubmit() {
  if (isUploading) return;

  setIsUploading(true);

  try {
    const validRows = data.filter(
      (item) => item.valid
    );

    if (validRows.length === 0) {
      toast.error("No valid rows");
      return;
    }

    const result =
      await bulkCreateDevotionals(validRows);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      `${validRows.length} devotionals uploaded`
    );

    router.refresh();
  } finally {
    setIsUploading(false);
  }
}


function formatExcelDate(publishDate: any): string {
  if (!publishDate) return "";
  
  if (typeof publishDate === "number") {
    // Excel date serial number
    const utc_days = Math.floor(publishDate - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const year = date_info.getFullYear();
    const month = String(date_info.getMonth() + 1).padStart(2, '0');
    const day = String(date_info.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  if (publishDate instanceof Date) {
    const year = publishDate.getFullYear();
    const month = String(publishDate.getMonth() + 1).padStart(2, '0');
    const day = String(publishDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return String(publishDate);
}

function validateRows(
  rows: any[]
): DevotionalRow[] {
  return rows.map((row) => {
    const formattedDate = formatExcelDate(row.publishDate);
    return {
      title: row.title || "",
      verse: row.verse || "",
      bible_reading: row.bible_reading || "",
      content: row.content || "",
      publishDate: formattedDate,
      valid:
        !!row.title &&
        !!row.verse &&
        !!row.content &&
        !!formattedDate,
    };
  });
}

  const [data, setData] = useState<
    DevotionalRow[]
  >([]);

  function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (
      e
    ) => {
      const workbook =
        XLSX.read(
          e.target?.result,
          {
            type: "binary",
          }
        );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const json =
        XLSX.utils.sheet_to_json(
          sheet
        );

      const validatedData = validateRows(json);

      setData(validatedData);
    };

    reader.readAsArrayBuffer(
      file
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />

          Upload Excel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl max-w-[90vw]">

        <DialogHeader>

          <DialogTitle>
            Bulk Upload Devotionals
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: <strong>title</strong>,{" "}
              <strong>verse</strong>, <strong>bible_reading</strong>,{" "}
              <strong>content</strong>, <strong>publishDate</strong>
            </p>
            <DownloadTemplateButton type="devotionals" variant="ghost" />
          </div>

          <input
  type="file"
  accept=".xlsx,.xls"
  onChange={handleFileUpload}
  className="
    w-full
    rounded-lg
    border
    bg-background
    text-sm
    text-muted-foreground

    file:mr-4
    file:border-0
    file:bg-primary
    file:px-4
    file:py-2
    file:text-sm
    file:font-medium
    file:text-primary-foreground
    file:cursor-pointer

    hover:file:opacity-90
  "
/>

          <div className="rounded-lg border p-4">

            <p className="font-medium">

              Rows found:

              {" "}

              {data.length}

            </p>

          </div>

          <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2">
            {data.map(
              (
                item,
                index
              ) => (
                <div key={index} className={`rounded-lg border p-3 ${item.valid ? "" : "border-red-500"}`}>
                  <div>
                      <p>{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.verse}</p>
                  </div>
                  <Badge variant ={item.valid? "default":"destructive"}>{item.valid ? "Valid" : "Invalid"}</Badge>
                </div>
              )
            )}
          </div>
            <Button className="w-full mt-4" onClick={handleSubmit}
              disabled={
                        isUploading ||
                        data.length === 0 ||
                        data.every((item) => !item.valid)
                      }
            >
              {isUploading ? "Uploading..." : "Upload Devotionals" }
                
            </Button>
        </div>


      </DialogContent>
    </Dialog>
  );
}