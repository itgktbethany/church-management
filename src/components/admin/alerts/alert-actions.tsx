"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteAlert } from "@/actions/alert";

import { EditAlertDialog } from "./edit-alert-dialog";

type Props = {
  alert: {
    id: string;
    title: string;
    message: string;
    sendPush: boolean;
    targetType: string;
    displayAt: Date | null;
    scheduleType: string | null;
    cronExpression: string | null;
  };
};

export function AlertActions({
  alert,
}: Props) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
      const confirmed =
    window.confirm(
      "Delete this alert?"
    );

  if (!confirmed) return;
  
    startTransition(
      async () => {
        const result =
          await deleteAlert(
            alert.id
          );

        if (!result.success) {
          toast.error(
            result.message
          );

          return;
        }

        toast.success(
          "Alert deleted"
        );

        router.refresh();
      }
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <EditAlertDialog
        alert={alert}
      />

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