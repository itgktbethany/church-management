"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markRedemptionUsed } from "@/actions/points";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function ClaimVoucherButton({ transactionId }: { transactionId: string }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  function handleClaim() {
    const confirmed = window.confirm(t("points.confirmClaim"));
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await markRedemptionUsed(transactionId);
        toast.success(t("points.claimSuccess"));
      } catch (error) {
        toast.error(t("points.claimFailed"));
      }
    });
  }

  return (
    <Button 
      size="lg" 
      onClick={handleClaim}
      disabled={isPending}
      className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
    >
      {isPending ? t("points.claiming") : t("points.claimRewardAdmin")}
    </Button>
  );
}
