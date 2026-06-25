import { notFound } from "next/navigation";

import {
  getAvailableMembers,
  getGroup,
  getGroupMembers,
} from "@/actions/group";

import GroupInformationCard from "@/components/admin/groups/group-information-card";
import GroupLeaderCard from "@/components/admin/groups/group-leader-card";
import GroupMembersCard from "@/components/admin/groups/group-members-card";
import GroupStatisticsCard from "@/components/admin/groups/group-statistics-card";

interface GroupDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { id } = await params;

  const groupResult = await getGroup(id);

  if (!groupResult.success || !groupResult.data) {
    notFound();
  }

  const membersResult = await getGroupMembers(id);
  const availableMembersResult = await getAvailableMembers(id);

  const group = groupResult.data;
  const members = membersResult.success ? membersResult.data : [];
  const availableMembers = availableMembersResult.success
    ? availableMembersResult.data
    : [];


    console.log(groupResult);
console.log(membersResult);
console.log(availableMembersResult);

  return (
    <div className="space-y-6">
      <GroupInformationCard group={group} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GroupLeaderCard
            group={group}
            members={members}
          />
        </div>

        <div className="lg:col-span-2">
          <GroupStatisticsCard
            members={members}
            leaderAssigned={group.leaderId !== null}
          />
        </div>
      </div>

      <GroupMembersCard
        group={group}
        members={members}
        availableMembers={availableMembers}
      />
    </div>
  );
}