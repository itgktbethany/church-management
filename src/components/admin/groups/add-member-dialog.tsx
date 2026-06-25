"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { addMembersToGroup } from "@/actions/group";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserPlus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email: string;
};

interface AddMemberDialogProps {
  groupId: string;
  users: User[];
}

type AvailableUser = {
    id: string;
    name: string | null;
    email: string;
}

export default function AddMemberDialog({
  groupId,
  users,
}: AddMemberDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [search, setSearch] = useState("");

  const [selectedUsers, setSelectedUsers] = useState<AvailableUser[]>([]);

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    );
  });

function toggleUser(user: User) {
  setSelectedUsers((prev) => {
    const exists = prev.some(
      (selected) => selected.id === user.id
    );

    if (exists) {
      return prev.filter(
        (selected) => selected.id !== user.id
      );
    }

    return [...prev, user];
  });
}

  function handleSubmit() {
    startTransition(async () => {
      try {
        await addMembersToGroup(
          groupId,selectedUsers.map((user)=>user.id)
        );

        toast.success("Members assigned successfully.");

        setSelectedUsers([]);
        setOpen(false);

        router.refresh();
      } catch {
        toast.error("Failed to assign members.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Members
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">

        <DialogHeader>

          <DialogTitle>
            Add Members
          </DialogTitle>

          <DialogDescription>
            Select one or more users to assign into this group.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4">

          <div className="relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Search member..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <Badge>
            {selectedUsers.length} Selected
          </Badge>

          <ScrollArea className="h-80 rounded-md border">

            <div className="space-y-1 p-2">

              {filteredUsers.map((user) => (

                <label
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedUsers.some(
                      (selected) => selected.id ===user.id
                    )}
                    onCheckedChange={() =>
                      toggleUser(user)
                    }
                  />

                  <div>

                    <p className="font-medium">
                      {user.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>

                  </div>

                </label>

              ))}

            </div>

          </ScrollArea>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={
              pending ||
              selectedUsers.length === 0
            }
            onClick={handleSubmit}
          >
            Assign Members
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}