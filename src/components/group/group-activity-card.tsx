"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Share2, Lock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface GroupActivityCardProps {
  completed: number;
  rate: number;
  shared: number;
  privateCount: number;
}

export function GroupActivityCard({
  completed = 0,
  rate = 0,
  shared = 0,
  privateCount = 0,
}: GroupActivityCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <Activity className="w-5 h-5 text-primary" />
          {t("groups.todaysActivity")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" />
              {t("common.completed")}
            </span>
            <p className="text-2xl font-semibold">{completed}</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              {t("groups.rate")}
            </span>
            <p className="text-2xl font-semibold">{rate}%</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" />
              {t("groups.shared")}
            </span>
            <p className="text-2xl font-semibold">{shared}</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              {t("groups.private")}
            </span>
            <p className="text-2xl font-semibold">{privateCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
