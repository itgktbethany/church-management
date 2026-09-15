"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

type DevotionalHistoryCardProps = {
  devotional: {
    id: string;
    title: string;
    verse: string;
    content: string;
    publishDate: string | null;
  };
};

export function DevotionalHistoryCard({
  devotional,
}: DevotionalHistoryCardProps) {
  const { t } = useLanguage();

  return (
    <Link href={`/dashboard/devotionals/${devotional.id}`}>
      <Card className="transition hover:shadow-md cursor-pointer">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{devotional.title}</h3>
              <p className="text-sm text-muted-foreground">{devotional.verse}</p>
            </div>

            <Badge variant="secondary">
              {t("common.completed")}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {devotional.content}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                {devotional.publishDate
                  ? new Date(devotional.publishDate).toLocaleDateString()
                  : "No publish date"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t("devotionals.read")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}