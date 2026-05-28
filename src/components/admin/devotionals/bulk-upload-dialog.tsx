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

type DevotionalRow = {
  title: string;
  verse: string;
  bible_reading: string;
  content: string;
  publish_date: string;
  valid?: boolean;
};


export function BulkUploadDialog() {

    const router = useRouter();

async function handleSubmit() {
  const validRows =
    data.filter(
      (item) =>
        item.valid
    );

  if (
    validRows.length === 0
  ) {
    toast.error(
      "No valid rows"
    );

    return;
  }

  const result =
    await bulkCreateDevotionals(
      validRows
    );

  if (!result.success) {
    toast.error(
      result.message
    );

    return;
  }

  toast.success(
    `${validRows.length} devotionals uploaded`
  );

  router.refresh();
}


function validateRows(
  rows: DevotionalRow[]
) {
  return rows.map((row) => ({
    ...row,

    valid:
      !!row.title &&
      !!row.verse &&
      !!row.content &&
      !!row.publish_date,
  }));
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

      const validatedData = validateRows(json as DevotionalRow[]);

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

      <DialogContent className="max-w-4xl">

        <DialogHeader>

          <DialogTitle>
            Bulk Upload Devotionals
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={
              handleFileUpload
            }
          />

          <div className="rounded-lg border p-4">

            <p className="font-medium">

              Rows found:

              {" "}

              {data.length}

            </p>

          </div>

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
            <Button className="w-full" onClick={handleSubmit} >
                Upload Devotionals
            </Button>
        </div>


      </DialogContent>
    </Dialog>
  );
}