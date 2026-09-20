"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { RedeemEventList } from "@/components/points/redeem-event-list";
import { UnusedRedemptionsList } from "@/components/points/unused-redemptions-list";

interface RedeemPointsContentProps {
  deductEvents: any[];
  totalPoints: number;
  unusedRedemptions: any[];
}

export function RedeemPointsContent({
  deductEvents,
  totalPoints,
  unusedRedemptions,
}: RedeemPointsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/points" className="inline-block mb-4">
          <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            {t("points.backToPoints")}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t("points.redeemTitle")}</h1>
        <p className="text-muted-foreground">{t("points.redeemSubtitle")}</p>
        <p className="font-semibold mt-2 text-lg">
          {t("points.yourBalance", { points: totalPoints })}
        </p>
      </div>

      {unusedRedemptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">{t("points.unusedRewards")}</h2>
          <p className="text-muted-foreground">{t("points.unusedRewardsSub")}</p>
          <UnusedRedemptionsList redemptions={unusedRedemptions} />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t("points.availableRewards")}</h2>
        <RedeemEventList events={deductEvents} userPoints={totalPoints} />
      </div>
    </div>
  );
}
