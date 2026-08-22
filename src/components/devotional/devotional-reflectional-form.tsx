"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Loader2,
  NotebookPen,
} from "lucide-react";

import { toast } from "sonner";

import { saveReflection } from "@/actions/devotional";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Users } from "lucide-react";

interface DevotionalReflectionFormProps {
  devotionalId: string;
  existingReflection?: {
    comment: string;
    visibility: string;
  } | null;
}

export function DevotionalReflectionForm({
  devotionalId,
  existingReflection,
}: DevotionalReflectionFormProps) {
  const router = useRouter();

  const [content, setContent] =
    useState(existingReflection?.comment || "");

  const [visibility, setVisibility] =
    useState<"private" | "group">((existingReflection?.visibility as "private" | "group") || "private");

  useEffect(() => {
    if (existingReflection) {
      setContent(existingReflection.comment);
      setVisibility(existingReflection.visibility as "private" | "group");
    }
  }, [existingReflection]);

  const [loading, setLoading] =
    useState(false);

  const isSubmitting = useRef(false);

  const handleSubmit =
    async () => {
      if (isSubmitting.current) return;
      
      if (!content.trim()) {
        toast.error(
          "Reflection cannot be empty"
        );

        return;
      }

      try {
        isSubmitting.current = true;
        setLoading(true);

        await saveReflection(
          devotionalId,
          content,
          visibility
        );

        toast.success(
          "Reflection saved successfully"
        );

        router.refresh();
      } catch {
        toast.error(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
        isSubmitting.current = false;
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

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-2">
        <div className="w-full sm:w-[220px]">
          <Select 
            value={visibility} 
            onValueChange={(val: "private" | "group") => setVisibility(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Private (Only you)
                </div>
              </SelectItem>
              <SelectItem value="group">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Share with Group
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
    </div>
  );
}