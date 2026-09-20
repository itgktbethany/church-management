"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { redeemPoints } from "@/actions/points";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function RedeemEventList({ events, userPoints }: { events: any[]; userPoints: number }) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  function handleRedeem(eventId: string) {
    const confirmed = window.confirm(t("points.confirmRedeem"));
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await redeemPoints(eventId);
        toast.success(t("points.redeemSuccess"));
      } catch (error: any) {
        toast.error(error.message || t("points.redeemFailed"));
      }
    });
  }

  if (events.length === 0) {
    return <p className="text-muted-foreground">{t("points.noRewards")}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const canAfford = userPoints >= event.defaultPoints;
        return (
          <Card key={event.id} className={!canAfford ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
              <p className="font-bold text-lg">{event.defaultPoints} pts</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleRedeem(event.id)} 
                disabled={!canAfford || isPending}
                className="w-full"
              >
                {canAfford ? t("points.redeem") : t("points.notEnoughPoints")}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
