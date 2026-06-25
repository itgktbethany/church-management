import { removeMemberFromGroup } from "@/actions/group";
import AddMemberDialog from "./add-member-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Users,
  Trash2,
  Mail,
  Calendar,
} from "lucide-react";

type Group = {
  id: string;
  name: string;
};

type Member = {
  membershipId: string;
  userId: string;
  name: string | null;
  email: string;
  status: string;
  joinedAt?: Date;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

interface GroupMembersCardProps {
  group: Group;
  members: Member[];
  availableMembers: User[];
}

export default function GroupMembersCard({
  group,
  members,
  availableMembers,
}: GroupMembersCardProps) {
  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <div>

          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members
          </CardTitle>

          <CardDescription>
            {members.length} member(s) assigned to this group
          </CardDescription>

        </div>

        <AddMemberDialog
          groupId={group.id}
          users={availableMembers}
        />

      </CardHeader>

      <CardContent>

        {members.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center">

            <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="font-medium">
              No Members
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Start by assigning members to this group.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {members.map((member) => (
              <div key={member.membershipId}>

                <div className="flex items-center justify-between">

                  <div className="space-y-2">

                    <h4 className="font-medium">
                      {member.name || "Unknown User"}
                    </h4>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                      <Mail className="h-4 w-4" />

                      {member.email}

                    </div>

                    {member.joinedAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Calendar className="h-4 w-4" />

                        Joined{" "}
                        {member.joinedAt.toLocaleDateString()}

                      </div>
                    )}

                  </div>

                  <div className="flex items-center gap-3">

                    <Badge
                      variant={
                        member.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>

                    <form
                      action={async () => {
                        "use server";

                        await removeMemberFromGroup(
                          member.membershipId,group.id
                        );
                      }}
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>

                  </div>

                </div>

                <Separator className="mt-4" />

              </div>
            ))}

          </div>
        )}

      </CardContent>

    </Card>
  );
}