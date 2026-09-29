"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DevotionalReflectionForm } from "@/components/devotional/devotional-reflectional-form";
import { useLanguage } from "@/components/language-provider";

interface DevotionalDetailContentProps {
  id: string;
  devotionalData: {
    id: string;
    title: string;
    bibleReading: string | null;
    verse: string;
    content: string | null;
  };
  existingReflection: any;
}

export function DevotionalDetailContent({
  id,
  devotionalData,
  existingReflection,
}: DevotionalDetailContentProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/devotionals">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {existingReflection && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              {t("devotionals.completedBadge")}
            </Badge>
          )}
          <Badge variant="secondary">
            {t("devotionals.dailyDevotional")}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          <span>{t("devotionals.fiveMinRead")}</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          {devotionalData.title}
        </h1>
      </div>

      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 h-5 w-5 text-muted-foreground" />

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("devotionals.bibleReading")}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {devotionalData.bibleReading}
                </h2>
              </div>

              <p className="leading-8 text-muted-foreground">
                {devotionalData.verse}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <article className="space-y-8">
        {devotionalData.content
          ?.split("\n")
          .filter((paragraph) => paragraph.trim() !== "")
          .map((paragraph, index) => (
            <p
              key={index}
              className="text-xl leading-10 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
      </article>

      <DevotionalReflectionForm
        devotionalId={id}
        existingReflection={existingReflection}
      />
    </div>
  );
}
