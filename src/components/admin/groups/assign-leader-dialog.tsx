"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Crown } from "lucide-react";

import { assignLeader } from "@/actions/group";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type Member = {
  membershipId: string;
  userId: string;
  name: string | null;
  email: string;
  status: string;
};

interface AssignLeaderDialogProps {
  groupId: string;
  members: Member[];
  currentLeaderId?: string | null;
}

export default function AssignLeaderDialog({
  groupId,
  members,
  currentLeaderId,
}: AssignLeaderDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedLeader, setSelectedLeader] =
    useState(currentLeaderId ?? "");

  const [isPending, startTransition] =
    useTransition();

  const filteredMembers = useMemo(() => {
    const keyword = search.toLowerCase();

    return members.filter(
      (member) =>
        member.name
          ?.toLowerCase()
          .includes(keyword) ||
        member.email
          .toLowerCase()
          .includes(keyword)
    );
  }, [members, search]);

  function handleSubmit() {
    startTransition(async () => {
      const result = await assignLeader(
        groupId,
        selectedLeader
      );

      if (result.success) {
        toast.success(result.message);

        setOpen(false);

        router.refresh();

        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="w-full">
          <Crown className="mr-2 h-4 w-4" />

          {currentLeaderId
            ? "Change Leader"
            : "Assign Leader"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            Assign Group Leader
          </DialogTitle>

          <DialogDescription>
            Select one member to become the
            leader of this group.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4">

          <div className="relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search member..."
              className="pl-9"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <ScrollArea className="h-72 rounded-md border">

            <RadioGroup
              value={selectedLeader}
              onValueChange={
                setSelectedLeader
              }
            >
              {filteredMembers.length ===
              0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No members found.
                </div>
              ) : (
                filteredMembers.map(
                  (member) => (
                    <Label
                      key={member.userId}
                      htmlFor={member.userId}
                      className="flex cursor-pointer items-center gap-4 border-b p-4 hover:bg-muted/50"
                    >
                      <RadioGroupItem
                        id={member.userId}
                        value={member.userId}
                      />

                      <div className="flex flex-col">

                        <span className="font-medium">
                          {member.name ??
                            "Unknown User"}
                        </span>

                        <span className="text-sm text-muted-foreground">
                          {member.email}
                        </span>

                      </div>

                    </Label>
                  )
                )
              )}
            </RadioGroup>

          </ScrollArea>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              isPending ||
              selectedLeader.length === 0
            }
            onClick={handleSubmit}
          >
            {isPending
              ? "Saving..."
              : "Save Leader"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}