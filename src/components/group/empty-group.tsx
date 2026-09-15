"use client";

import { Users } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function EmptyGroup() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="bg-muted p-4 rounded-full mb-4">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{t("groups.noGroup")}</h2>
      <p className="text-muted-foreground">{t("groups.noGroup")}</p>
    </div>
  );
}
