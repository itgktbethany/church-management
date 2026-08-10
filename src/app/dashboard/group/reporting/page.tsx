import { getMemberAnalytics } from "@/actions/analytics";
import { getMyGroup } from "@/actions/my-group";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Group Reporting - Church Management System",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GroupReportingPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const groupId = typeof searchParams.groupId === "string" ? searchParams.groupId : undefined;

  // Validate that the user belongs to this group and is a leader
  const groupResponse = await getMyGroup(groupId);
  if (!groupResponse.success || !groupResponse.data?.group) {
    redirect("/dashboard/group");
  }

  const { group, leader, currentUserId } = groupResponse.data;
  
  // Extra security: ensure the current user is the leader of this group
  if (leader?.id !== currentUserId) {
    redirect("/dashboard/group");
  }

  const analyticsResponse = await getMemberAnalytics(group.id);
  const analytics = analyticsResponse.data || [];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <Link href={`/dashboard/group?groupId=${group.id}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Group
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Member Assessment</h1>
        <p className="text-muted-foreground">Review activity and involvement of members in {group.name}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Report</CardTitle>
          <CardDescription>Members are sorted by total points.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Devotionals</TableHead>
                <TableHead>Ministries</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.totalDevotionals}</TableCell>
                  <TableCell>
                    {member.ministries.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {member.ministries.map((min, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{min}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>{member.points}</TableCell>
                </TableRow>
              ))}
              {analytics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No members found in this group.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
