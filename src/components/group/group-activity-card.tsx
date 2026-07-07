import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Share2, Lock } from "lucide-react";

export function GroupActivityCard() {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-semibold">
          <Activity className="w-5 h-5 text-primary" />
          Today's Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" />
              Completed
            </span>
            <p className="text-2xl font-semibold">-</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Rate
            </span>
            <p className="text-2xl font-semibold">-</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" />
              Shared
            </span>
            <p className="text-2xl font-semibold">-</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Private
            </span>
            <p className="text-2xl font-semibold">-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
