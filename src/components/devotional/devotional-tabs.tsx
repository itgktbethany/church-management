import Link from "next/link";
import { BookOpen } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { DevotionalHistoryCard } from "./devotional-history-card";
import { DevotionalNoteCard } from "./devotional-note-card";

type DevotionalTabsProps = {
  devotionals: {
    id: string;
    title: string;
    verse: string;
    content: string;
    publishDate: string | null;
  }[];

  reflections: {
    id: string;
    comment: string;
    createdAt: Date;
    devotionalTitle: string | null;
    devotionalId: string | null;
  }[];
};

export function DevotionalTabs({
  devotionals,
  reflections,
  defaultTab = "history",
}: DevotionalTabsProps & { defaultTab?: string }) {
  return (
    <Tabs
      defaultValue={defaultTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="history">
          History
        </TabsTrigger>

        <TabsTrigger value="notes">
          Reflection
        </TabsTrigger>
      </TabsList>



      <TabsContent value="history">
        <div className="grid gap-4 md:grid-cols-2">
          {devotionals.map((devotional) => (
            <DevotionalHistoryCard
              key={devotional.id}
              devotional={devotional}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="notes">
        <div className="grid gap-4">
          {reflections.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  No reflections yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            reflections.map((reflection) => (
              <Link
                key={reflection.id}
                href={reflection.devotionalId ? `/dashboard/devotionals/${reflection.devotionalId}?tab=notes` : "#"}
                className="block transition-transform hover:-translate-y-1"
              >
                <DevotionalNoteCard
                  reflection={reflection}
                />
              </Link>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}