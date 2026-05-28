"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Loader2,
  NotebookPen,
} from "lucide-react";

import { toast } from "sonner";

import { saveReflection } from "@/actions/devotional";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DevotionalReflectionFormProps {
  devotionalId: string;
}

export function DevotionalReflectionForm({
  devotionalId,
}: DevotionalReflectionFormProps) {
  const router = useRouter();

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async () => {
      if (!content.trim()) {
        toast.error(
          "Reflection cannot be empty"
        );

        return;
      }

      try {
        setLoading(true);

        await saveReflection(
          devotionalId,
          content
        );

        toast.success(
          "Reflection saved successfully"
        );

        setContent("");

        router.refresh();
      } catch {
        toast.error(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-primary" />

          <h3 className="font-semibold">
            Your Reflection
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Write what God spoke to you today.
        </p>
      </div>

      <Textarea
        placeholder="Write your reflection here..."
        className="min-h-[180px] resize-none leading-7"
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full sm:w-fit"
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        Save Reflection
      </Button>
    </div>
  );
}