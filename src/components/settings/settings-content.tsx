"use client";

import { Card, CardContent } from "@/components/ui/card";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { FontSizeToggle } from "@/components/settings/font-size-toggle";
import { LanguageToggle } from "@/components/settings/language-toggle";
import { PwaUpdatePrompt } from "@/components/pwa-update-prompt";
import { useLanguage } from "@/components/language-provider";
import { User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SettingsContent() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {t("settings.account")}
          </h2>
          <Card className="rounded-3xl border-0 bg-muted/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Button 
                asChild
                variant="ghost" 
                className="w-full justify-between rounded-none h-auto p-4 hover:bg-muted/80"
              >
                <Link href="/dashboard/profile">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{t("settings.personalInfo")}</p>
                      <p className="text-sm text-muted-foreground font-normal">{t("settings.personalInfoSub")}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {t("settings.preferences")}
          </h2>
          <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6 border-b">
              <LanguageToggle />
            </CardContent>
            <CardContent className="p-4 sm:p-6 border-b bg-muted/30">
              <NotificationSettings />
            </CardContent>
            <CardContent className="p-4 sm:p-6 border-b bg-muted/30">
              <ThemeToggle />
            </CardContent>
            <CardContent className="p-4 sm:p-6 border-b bg-muted/30">
              <FontSizeToggle />
            </CardContent>
            <CardContent className="p-4 sm:p-6 bg-muted/30">
              <PwaUpdatePrompt />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
