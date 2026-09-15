import { formatDistanceToNow } from "date-fns";

import { NotebookPen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type DevotionalNoteCardProps = {
  reflection: {
    id: string;
    comment: string;
    createdAt: Date;
    devotionalTitle:string|null;
  };
};

export function DevotionalNoteCard({
  reflection,
}: DevotionalNoteCardProps) {
  return (
    <Card className="border-border/50 transition hover:shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <NotebookPen className="h-4 w-4 text-primary" />
          </div>

          <div className="space-y-1">
            <h3 className="font-medium leading-none">
              {reflection.devotionalTitle}
            </h3>

            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(
                new Date(reflection.createdAt),
                {
                  addSuffix: true,
                }
              )}
            </p>
          </div>
        </div>

        <p className="leading-7 text-muted-foreground whitespace-pre-wrap">
          {reflection.comment}
        </p>
      </CardContent>
    </Card>
  );
}