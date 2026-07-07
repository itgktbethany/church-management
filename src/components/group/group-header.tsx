import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

interface GroupHeaderProps {
  group: {
    name: string;
    description: string | null;
  };
  leader: {
    name: string | null;
  } | null;
  totalMembers: number;
}

export function GroupHeader({ group, leader, totalMembers }: GroupHeaderProps) {
  return (
    <Card className="mb-6 border-none shadow-sm bg-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-1">{group.name}</CardTitle>
            <CardDescription className="text-base text-foreground/80">{group.description || "No description provided."}</CardDescription>
          </div>
          <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
          <div>
            <span className="text-muted-foreground block mb-1">Leader</span>
            <span className="font-medium">{leader?.name || "No Leader Assigned"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">Members</span>
            <span className="font-medium">{totalMembers}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
