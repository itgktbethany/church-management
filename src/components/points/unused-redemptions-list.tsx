"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markRedemptionUsed } from "@/actions/points";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function UnusedRedemptionsList({ redemptions }: { redemptions: any[] }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  function handleMarkUsed(transactionId: string) {
    const confirmed = window.confirm(t("points.confirmMarkUsed"));
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await markRedemptionUsed(transactionId);
        toast.success(t("points.markedUsedSuccess"));
      } catch (error) {
        toast.error(t("points.updateStatusFailed"));
      }
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {redemptions.map((tx) => (
        <Card key={tx.id} className="border-primary bg-primary/5">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <h3 className="font-bold text-xl">{tx.event?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t("points.redeemedOn")} {new Date(tx.createdAt).toLocaleDateString()}
            </p>
            <Button 
              size="lg" 
              onClick={() => handleMarkUsed(tx.id)}
              disabled={isPending}
              className="w-full mt-4"
            >
              {isPending ? t("points.updating") : t("points.markAsUsed")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
