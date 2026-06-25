import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Users,
  Crown,
  MessageSquare,
  Lock,
} from "lucide-react";

interface GroupStatisticsCardProps {
  members: {
    membershipId: string;
  }[];
  leaderAssigned?: boolean;
  sharedReflections?: number;
  privateReflections?: number;
}

export default function GroupStatisticsCard({
  members,
  leaderAssigned = false,
  sharedReflections = 0,
  privateReflections = 0,
}: GroupStatisticsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          Group Statistics
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                Members
              </span>
            </div>

            <p className="mt-2 text-3xl font-bold">
              {members.length}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Crown className="h-4 w-4" />
              <span className="text-sm">
                Leader
              </span>
            </div>

            <div className="mt-3">
              <Badge
                variant={
                  leaderAssigned
                    ? "default"
                    : "secondary"
                }
              >
                {leaderAssigned
                  ? "Assigned"
                  : "Not Assigned"}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">
                Shared Reflections
              </span>
            </div>

            <p className="mt-2 text-3xl font-bold">
              {sharedReflections}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">
                Private Reflections
              </span>
            </div>

            <p className="mt-2 text-3xl font-bold">
              {privateReflections}
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}