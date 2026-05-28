"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteDevotional } from "@/actions/devotional";

import { EditDevotionalDialog } from "./edit-devotional-dialog";

type Props = {
  devotional: {
    id: string;
    title: string;
    verse: string;
    bibleReading: string | null;
    publishDate: string | null;
    content: string;
  };
};

export function DevotionalActions({
  devotional,
}: Props) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
    startTransition(
      async () => {
        const result =
          await deleteDevotional(
            devotional.id
          );

        if (!result.success) {
          toast.error(
            result.message
          );

          return;
        }

        toast.success(
          "Devotional deleted"
        );

        router.refresh();
      }
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <EditDevotionalDialog
        devotional={devotional}
      />

      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        Delete
      </Button>
    </div>
  );
}