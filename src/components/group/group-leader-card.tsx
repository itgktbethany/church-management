import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, BarChart3 } from "lucide-react";
import Link from "next/link";

interface GroupLeaderCardProps {
  leader: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  currentUserId?: string;
  groupId: string;
}

export function GroupLeaderCard({ leader, currentUserId, groupId }: GroupLeaderCardProps) {
  if (!leader) return null;
  const isLeader = leader.id === currentUserId;

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Group Leader
        </CardTitle>
        {isLeader && (
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link href={`/dashboard/group/reporting?groupId=${groupId}`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Member Assessment
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={leader.image || undefined} alt={leader.name || "Leader"} />
            <AvatarFallback>{leader.name?.[0]?.toUpperCase() || "L"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-base">{leader.name}</p>
              <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">Leader</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{leader.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
