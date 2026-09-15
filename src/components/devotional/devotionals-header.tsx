"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Gift } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface DevotionalsHeaderProps {
  totalPoints: number;
}

export function DevotionalsHeader({ totalPoints }: DevotionalsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("devotionals.title")}
        </h1>

        <p className="text-muted-foreground mt-1">
          {t("devotionals.subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/dashboard/points">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span className="font-semibold">{totalPoints}</span>
            <span className="text-muted-foreground">pts</span>
          </Button>
        </Link>
        <Link href="/dashboard/points/redeem">
          <Button size="sm" className="gap-1.5 rounded-full">
            <Gift className="w-3.5 h-3.5" />
            {t("points.redeemButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
