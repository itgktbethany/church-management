"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { markRedemptionUsed } from "@/actions/points";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UnusedRedemptionsList({ redemptions }: { redemptions: any[] }) {
  const [isPending, startTransition] = useTransition();

  function handleMarkUsed(transactionId: string) {
    const confirmed = window.confirm("Admin only: Mark this reward as used?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await markRedemptionUsed(transactionId);
        toast.success("Reward marked as used");
      } catch (error) {
        toast.error("Failed to update status");
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
              Redeemed on {new Date(tx.createdAt).toLocaleDateString()}
            </p>
            <Button 
              size="lg" 
              onClick={() => handleMarkUsed(tx.id)}
              disabled={isPending}
              className="w-full mt-4"
            >
              {isPending ? "Updating..." : "Mark as Used (Admin)"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
