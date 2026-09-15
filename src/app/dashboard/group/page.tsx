import { getMyGroup } from "@/actions/my-group";
import { getGroupFeed } from "@/actions/group-feed";
import { EmptyGroup } from "@/components/group/empty-group";
import { GroupTitleHeader } from "@/components/group/group-title-header";
import { GroupHeader } from "@/components/group/group-header";
import { GroupActivityCard } from "@/components/group/group-activity-card";
import { GroupLeaderCard } from "@/components/group/group-leader-card";
import { GroupMembersCard } from "@/components/group/group-members-card";
import { GroupFeed } from "@/components/group/group-feed";
import { GroupSelector } from "@/components/group/group-selector";

export const metadata = {
  title: "My Group - Church Management System",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GroupPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const groupId = typeof searchParams.groupId === "string" ? searchParams.groupId : undefined;

  const groupResponse = await getMyGroup(groupId);

  if (!groupResponse.success || !groupResponse.data?.group) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <EmptyGroup />
      </div>
    );
  }

  const { group, leader, members, allUserGroups, currentUserId } = groupResponse.data;
  const feedResponse = await getGroupFeed(group.id);
  const feedItems = feedResponse.data || [];

  const uniqueUsersCompleted = new Set(feedItems.map(item => item.user.id)).size;
  const sharedCount = feedItems.filter(item => item.visibility !== "private").length;
  const privateCount = feedItems.filter(item => item.visibility === "private").length;
  const rate = members.length > 0 ? Math.round((uniqueUsersCompleted / members.length) * 100) : 0;

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <GroupTitleHeader />

      {allUserGroups && allUserGroups.length > 1 && (
        <GroupSelector groups={allUserGroups} selectedGroupId={group.id} />
      )}

      <div className="flex flex-col space-y-6">
        <GroupHeader 
          group={group}
          leader={leader}
          totalMembers={members.length}
        />

        <GroupActivityCard 
          completed={uniqueUsersCompleted}
          rate={rate}
          shared={sharedCount}
          privateCount={privateCount}
        />

        <GroupFeed feedItems={feedItems} />

        {leader && (
          <GroupLeaderCard 
            leader={leader} 
            currentUserId={currentUserId} 
            groupId={group.id} 
          />
        )}

        <GroupMembersCard 
          members={members}
          leaderId={group.leaderId}
        />
      </div>
    </div>
  );
}
