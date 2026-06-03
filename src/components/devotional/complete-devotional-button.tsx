"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

// import { createClient } from "@/lib/supabase/client";

interface CompleteDevotionalButtonProps {
  devotionalId: string;
}

export default function CompleteDevotionalButton({
  devotionalId,
}: CompleteDevotionalButtonProps) {
  const [reflection, setReflection] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  // const handleComplete =
  //   async () => {
  //     try {
  //       setLoading(true);

  //       const supabase =
  //         createClient();

  //       const {
  //         data: { user },
  //       } = await supabase.auth.getUser();

  //       if (!user) return;

  //       const { error } =
  //         await supabase
  //           .from(
  //             "devotional_comments"
  //           )
  //           .insert({
  //             devotional_id:
  //               devotionalId,

  //             user_id: user.id,

  //             comment: reflection,

  //             is_completed: true,
  //           });

  //       if (error) {
  //         console.error(error);
  //         return;
  //       }

  //       setCompleted(true);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  if (completed) {
    return (
      <div className="rounded-2xl border bg-muted/50 p-4 text-sm">
        Devotional completed 🙏
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border p-4">
      <div className="space-y-1">
        <h3 className="font-semibold">
          Reflection
        </h3>

        <p className="text-sm text-muted-foreground">
          What did God speak to you
          today?
        </p>
      </div>

      <Textarea
        placeholder="Write your reflection..."
        value={reflection}
        onChange={(e) =>
          setReflection(
            e.target.value
          )
        }
        rows={5}
      />

      <Button
        // onClick={handleComplete}
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Saving..."
          : "Complete Devotional"}
      </Button>
    </div>
  );
}