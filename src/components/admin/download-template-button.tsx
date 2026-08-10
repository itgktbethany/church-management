"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadTemplate } from "@/lib/download-template";

type TemplateType = "devotionals" | "groups" | "alerts" | "ministries";

interface DownloadTemplateButtonProps {
  type: TemplateType;
  variant?: "outline" | "ghost" | "default" | "secondary" | "destructive" | "link";
}

export function DownloadTemplateButton({
  type,
  variant = "outline",
}: DownloadTemplateButtonProps) {
  return (
    <Button variant={variant} onClick={() => downloadTemplate(type)}>
      <Download className="mr-2 h-4 w-4" />
      Download Template
    </Button>
  );
}
