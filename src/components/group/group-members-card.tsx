import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from "lucide-react";

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface GroupMembersCardProps {
  members: Member[];
  leaderId: string | null;
}

export function GroupMembersCard({ members, leaderId }: GroupMembersCardProps) {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Group Members
          </CardTitle>
          <CardDescription>
            {members.length} {members.length === 1 ? "member" : "members"} in this group
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {members.map((member) => {
            const isLeader = member.id === leaderId;
            return (
              <div key={member.id} className="flex items-center gap-4 p-2 hover:bg-muted/30 rounded-lg transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || undefined} alt={member.name || "Member"} />
                  <AvatarFallback>{member.name?.[0]?.toUpperCase() || "M"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    {isLeader && (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20 px-1.5 py-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Leader
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
