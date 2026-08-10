import * as XLSX from "xlsx";

type TemplateType = "devotionals" | "groups" | "alerts" | "ministries";

const TEMPLATE_CONFIG: Record<
  TemplateType,
  { headers: string[]; example: Record<string, string>; filename: string }
> = {
  devotionals: {
    headers: ["title", "verse", "bible_reading", "content", "publishDate"],
    example: {
      title: "God's Unfailing Love",
      verse: "John 3:16",
      bible_reading: "John 3:1-21",
      content: "Today we reflect on God's incredible love for us...",
      publishDate: "2025-01-01",
    },
    filename: "devotionals_import_template.xlsx",
  },
  groups: {
    headers: ["name", "description"],
    example: {
      name: "Youth Group",
      description: "For members aged 13-25",
    },
    filename: "groups_import_template.xlsx",
  },
  alerts: {
    headers: ["title", "message", "send_push", "target_type", "display_at"],
    example: {
      title: "Sunday Service Reminder",
      message: "Service starts at 9 AM this Sunday",
      send_push: "false",
      target_type: "all",
      display_at: "2025-01-01",
    },
    filename: "alerts_import_template.xlsx",
  },
  ministries: {
    headers: ["name", "description"],
    example: {
      name: "Worship Team",
      description: "Leads worship during Sunday services",
    },
    filename: "ministries_import_template.xlsx",
  },
};

export function downloadTemplate(type: TemplateType) {
  const config = TEMPLATE_CONFIG[type];

  // Create worksheet data: headers row + one example row
  const wsData = [config.headers, config.headers.map((h) => config.example[h] || "")];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for readability
  ws["!cols"] = config.headers.map((header) => ({
    wch: Math.max(header.length, (config.example[header] || "").length, 20),
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  XLSX.writeFile(wb, config.filename);
}
