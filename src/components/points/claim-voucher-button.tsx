"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markRedemptionUsed } from "@/actions/points";
import { Button } from "@/components/ui/button";

export function ClaimVoucherButton({ transactionId }: { transactionId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClaim() {
    const confirmed = window.confirm("Admin only: Mark this reward as claimed?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await markRedemptionUsed(transactionId);
        toast.success("Reward claimed successfully");
      } catch (error) {
        toast.error("Failed to claim reward");
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
      {isPending ? "Claiming..." : "Claim Reward (Admin)"}
    </Button>
  );
}
