"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { EditEventDialog } from "./edit-event-dialog";

export function EventActions({ event }: { event: any }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this event? This may break point history if transactions are linked.");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteEvent(event.id);
        toast.success("Event deleted");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <EditEventDialog event={event} />
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
