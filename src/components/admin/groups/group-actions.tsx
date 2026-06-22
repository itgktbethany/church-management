"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteGroup,activateGroup } from "@/actions/group";

import { EditGroupDialog } from "./edit-group-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { groups } from "@/lib/db/group-schema";

type Props = {
  group: typeof groups.$inferSelect;
};


export function GroupActions({
  group,
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
          await deleteGroup(
            group.id
          );

        if (!result.success) {
          toast.error(
            result.message
          );

          return;
        }

        toast.success(
          "Group deactivated"
        );

        router.refresh();
      }
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <EditGroupDialog
        group={group}
      />

    <ConfirmDialog
      title="Delete Group"
      description={`Are you sure you want to delete "${group.name}"? This action cannot be undone.`}
      confirmText="Delete"
      onConfirm={handleDelete}
      trigger={
        <Button
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      }
    />
    </div>
  );
}