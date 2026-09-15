"use client";

import { useLanguage } from "@/components/language-provider";

export function GroupTitleHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{t("groups.title")}</h1>
      <p className="text-muted-foreground">{t("groups.subtitle")}</p>
    </div>
  );
}
