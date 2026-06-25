import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, UserRound } from "lucide-react";

import { removeLeader } from "@/actions/group";
import AssignLeaderDialog from "./assign-leader-dialog";
import RemoveLeaderButton from "./remove-leader-button";

type Member = {
  membershipId: string;
  userId: string;
  name: string | null;
  email: string;
  status: string;
};

type Group = {
  id: string;
  leaderId: string | null;
};

interface GroupLeaderCardProps {
  group: Group;
  members: Member[];
}

export default function GroupLeaderCard({
  group,
  members,
}: GroupLeaderCardProps) {
  const leader = members.find(
    (member) => member.userId === group.leaderId
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Group Leader
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {leader ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserRound className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {leader.name ?? "Unknown User"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {leader.email}
                </p>
              </div>
            </div>

            <Badge>
              Active Leader
            </Badge>

            <div className="flex flex-col gap-2">
                <RemoveLeaderButton
                groupId={group.id}
                />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <UserRound className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

              <p className="font-medium">
                No Leader Assigned
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Assign a leader from existing group members.
              </p>
            </div>

<AssignLeaderDialog
  groupId={group.id}
  members={members}
  currentLeaderId={group.leaderId}
/>
          </>
        )}
      </CardContent>
    </Card>
  );
}