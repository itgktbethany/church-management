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
  }[];
};

export function DevotionalTabs({
  devotionals,
  reflections,
}: DevotionalTabsProps) {
  return (
    <Tabs
      defaultValue="history"
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
              <DevotionalNoteCard
                key={reflection.id}
                reflection={reflection}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}