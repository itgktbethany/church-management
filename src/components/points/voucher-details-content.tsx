"use client";

import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClaimVoucherButton } from "@/components/points/claim-voucher-button";
import { useLanguage } from "@/components/language-provider";

interface VoucherDetailsContentProps {
  transaction: any;
}

export function VoucherDetailsContent({ transaction }: VoucherDetailsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-xl mx-auto pt-8">
      <div>
        <Link href="/dashboard/points/redeem" className="inline-block mb-4">
          <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            {t("points.backToRedeem")}
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t("points.voucherDetails")}</h1>
        <p className="text-muted-foreground">{t("points.showAdminSub")}</p>
      </div>

      <Card className="border-primary bg-primary/5 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto bg-primary/20 p-4 rounded-full mb-4 w-fit">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{transaction.event?.name}</CardTitle>
          <CardDescription className="text-lg">
            {t("points.redeemedOn")} {new Date(transaction.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="border-2 border-dashed border-primary/50 rounded-lg p-6 w-full bg-background">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-2">
              {t("points.voucherCode")}
            </p>
            <p className="text-2xl font-mono font-bold tracking-wider">
              {transaction.id.split('-')[0].toUpperCase()}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">{t("points.status")}</span>
              <span className={`font-semibold uppercase ${transaction.redemptionStatus === 'used' ? 'text-muted-foreground' : 'text-green-600'}`}>
                {transaction.redemptionStatus === 'used' ? t("points.statusUsed") : t("points.statusUnused")}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">{t("points.pointsCost")}</span>
              <span className="font-semibold">{transaction.amount} pts</span>
            </div>
          </div>

          {transaction.redemptionStatus === "unused" ? (
            <ClaimVoucherButton transactionId={transaction.id} />
          ) : (
            <Button size="lg" disabled className="w-full mt-4">
              {t("points.rewardClaimed")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
