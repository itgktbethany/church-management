import { Clock, Flame } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DailyDevotionalCardProps = {
  devotional: {
    id: string;
    title: string;
    verse: string;
    content: string;
  };
};

export function DailyDevotionalCard({
  devotional,
}: DailyDevotionalCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-white/20 text-white hover:bg-white/20">
            Today's Devotional
          </Badge>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {devotional.title}
          </h2>

          <p className="text-white/80">
            {devotional.verse}
          </p>

          <p className="text-sm text-white/90 leading-relaxed line-clamp-3">
            {devotional.content}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4" />
            <span>7 Day Streak</span>
          </div>
        </div>

        <Link
          href={`/dashboard/devotionals/${devotional.id}`}
        >
          <Button
            variant="secondary"
            className="w-full"
          >
            Continue Reading
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}