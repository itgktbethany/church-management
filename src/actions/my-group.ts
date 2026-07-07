"use server";

import { db } from "@/lib/db";
import { groups, userGroups } from "@/lib/db/group-schema";
import { user } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function getMyGroup(selectedGroupId?: string) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, message: "Unauthorized", data: null };
    }

    // Find all active groups for the user
    const memberships = await db
      .select({ groupId: userGroups.groupId, groupName: groups.name })
      .from(userGroups)
      .innerJoin(groups, eq(userGroups.groupId, groups.id))
      .where(and(eq(userGroups.userId, session.user.id), eq(userGroups.status, "active")));

    if (!memberships || memberships.length === 0) {
      return { success: true, message: "No active group", data: null };
    }

    const allUserGroups = memberships.map(m => ({ id: m.groupId, name: m.groupName }));

    // Determine which group to show
    let groupId = memberships[0].groupId;
    if (selectedGroupId && memberships.some(m => m.groupId === selectedGroupId)) {
      groupId = selectedGroupId;
    }

    // Get group info
    const [groupInfo] = await db.select().from(groups).where(eq(groups.id, groupId));

    if (!groupInfo) {
      return { success: true, message: "Group not found", data: null };
    }

    // Get leader info
    let leaderInfo = null;
    if (groupInfo.leaderId) {
      const [leader] = await db.select().from(user).where(eq(user.id, groupInfo.leaderId));
      leaderInfo = leader || null;
    }

    // Get members
    const members = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        joinedAt: userGroups.joinedAt,
      })
      .from(userGroups)
      .innerJoin(user, eq(userGroups.userId, user.id))
      .where(and(eq(userGroups.groupId, groupId), eq(userGroups.status, "active")));

    return {
      success: true,
      message: "Group retrieved successfully",
      data: {
        group: groupInfo,
        leader: leaderInfo,
        members: members,
        allUserGroups: allUserGroups,
        currentUserId: session.user.id,
      },
    };
  } catch (error) {
    console.error("getMyGroup error:", error);
    return {
      success: false,
      message: "Failed to retrieve group",
      data: null,
    };
  }
}
