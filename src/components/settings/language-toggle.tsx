"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="space-y-1">
        <p className="font-medium">{t("settings.language")}</p>
        <p className="text-sm text-muted-foreground">
          {t("settings.languageSub")}
        </p>
      </div>

      <div className="flex bg-muted rounded-full p-1 w-full sm:w-auto">
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Languages className="h-4 w-4 mr-2" />
          English
        </Button>
        <Button
          variant={language === "id" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("id")}
          className="flex-1 sm:flex-none rounded-full h-8"
        >
          <Languages className="h-4 w-4 mr-2" />
          Bahasa Indonesia
        </Button>
      </div>
    </div>
  );
}
