"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageSquare, Lock, Activity } from "lucide-react";
import { LocalTime } from "@/components/ui/local-time";
import { useLanguage } from "@/components/language-provider";

interface FeedItem {
  id: string;
  comment: string;
  visibility: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface GroupFeedProps {
  feedItems: FeedItem[];
}

export function GroupFeed({ feedItems }: GroupFeedProps) {
  const { t } = useLanguage();

  if (feedItems.length === 0) {
    return (
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {t("groups.groupFeed")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{t("groups.noFeedActivities")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {t("groups.groupFeed")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feedItems.map((item) => {
            const isPrivate = item.visibility === "private";

            return (
              <div key={item.id} className="flex gap-4">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarImage src={item.user.image || undefined} alt={item.user.name || "Member"} />
                  <AvatarFallback>{item.user.name?.[0]?.toUpperCase() || "M"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.user.name}</p>
                      <span className="text-xs text-muted-foreground">
                        <LocalTime 
                          date={new Date(new Date(item.createdAt).getTime() - 8 * 60 * 60 * 1000)} 
                        />
                      </span>
                    </div>
                    {!isPrivate && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-2 py-0.5">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {t("devotionals.sharedReflection")}
                      </Badge>
                    )}
                  </div>

                  {isPrivate ? (
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-muted/50">
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <CheckCircle className="w-4 h-4" />
                        {t("groups.completedDevotional")}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Lock className="w-3 h-3" />
                        {t("devotionals.privateReflection")}
                      </div>
                      <p className="text-sm text-muted-foreground/60 italic tracking-[0.2em] mt-1 select-none">
                        **********
                      </p>
                    </div>
                  ) : (
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {item.comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
