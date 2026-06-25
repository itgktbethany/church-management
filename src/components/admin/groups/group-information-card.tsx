import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Users } from "lucide-react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  leaderId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface GroupInformationCardProps {
  group: Group;
}

export default function GroupInformationCard({
  group,
}: GroupInformationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-2xl">
            {group.name}
          </CardTitle>

          <p className="mt-2 text-sm text-muted-foreground">
            {group.description || "No description provided."}
          </p>
        </div>

        <Badge
          variant={group.isActive ? "default" : "secondary"}
        >
          {group.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Users className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Leader Status
              </p>

              <p className="font-medium">
                {group.leaderId
                  ? "Leader Assigned"
                  : "No Leader Assigned"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="font-medium">
                {group.createdAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}