"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { removeLeader } from "@/actions/group";

import { Button } from "@/components/ui/button";

interface RemoveLeaderButtonProps {
  groupId: string;
}

export default function RemoveLeaderButton({
  groupId,
}: RemoveLeaderButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  function handleRemoveLeader() {
    startTransition(async () => {
      const result = await removeLeader(groupId);

      if (result.success) {
        toast.success(result.message);

        router.refresh();

        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={handleRemoveLeader}
    >
      {isPending
        ? "Removing..."
        : "Remove Leader"}
    </Button>
  );
}