"use server";

import { revalidatePath } from "next/cache";
import { eq, desc,and,inArray,not } from "drizzle-orm";

import { db } from "@/lib/db";
import { groups,userGroups } from "@/lib/db/group-schema";
import {user} from "@/lib/db/schema";

export async function getGroups() {
  try {
    const data = await db
      .select()
      .from(groups)
      .orderBy(desc(groups.createdAt));

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Get groups error:", error);

    return {
      success: false,
      message: "Failed to fetch groups",
    };
  }
}

type CreateGroupInput = {
  name: string;
  description?: string;
};

export async function createGroup(data: CreateGroupInput) {
  try {
    const [group] = await db
      .insert(groups)
      .values({
        name: data.name,
        description: data.description || null,
      })
      .returning();

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      data: group,
      message: "Group created successfully",
    };
  } catch (error) {
    console.error("Create group error:", error);

    return {
      success: false,
      message: "Failed to create group",
    };
  }
}

type UpdateGroupInput = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export async function updateGroup(data: UpdateGroupInput) {
  try {
    const [group] = await db
      .update(groups)
      .set({
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, data.id))
      .returning();

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      data: group,
      message: "Group updated successfully",
    };
  } catch (error) {
    console.error("Update group error:", error);

    return {
      success: false,
      message: "Failed to update group",
    };
  }
}

export async function deleteGroup(
  id: string
) {
  try {
    await db
      .delete(groups)
      .where(eq(groups.id, id));

    revalidatePath(
      "/dashboard/admin/groups"
    );

    return {
      success: true,
      message:
        "Group deleted successfully",
    };
  } catch (error) {
    console.error(
      "Delete group error:",
      error
    );

    return {
      success: false,
      message:
        "Failed to delete group",
    };
  }
}

export async function activateGroup(id: string) {
  try {
    await db
      .update(groups)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, id));

    revalidatePath("/dashboard/admin/groups");

    return {
      success: true,
      message: "Group activated successfully",
    };
  } catch (error) {
    console.error("Activate group error:", error);

    return {
      success: false,
      message: "Failed to activate group",
    };
  }
}

export async function getGroup(id: string) {
  try {
    const [group] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, id));

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error("Get group error:", error);

    return {
      success: false,
      message: "Failed to fetch group",
    };
  }
}

export async function deactivateGroup(
  id: string
) {
  try {
    await db
      .update(groups)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, id));

    revalidatePath(
      "/dashboard/admin/groups"
    );

    return {
      success: true,
      message:
        "Group deactivated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Failed to deactivate group",
    };
  }
}

export async function getAvailableMembers(groupId: string) {
  try {
    const existingMembers = await db
      .select({
        userId: userGroups.userId,
      })
      .from(userGroups)
      .where(eq(userGroups.groupId, groupId));

    const existingIds = new Set(
      existingMembers.map((m) => m.userId)
    );

    const users = await db.select().from(user);

    return {
      success: true,
      data: users.filter(
        (u) => !existingIds.has(u.id)
      ),
      message: "Available members retrieved successfully.",
    };
  } catch (error) {
    console.error("Error getting available members:", error);

    return {
      success: false,
      data: [],
      message: "Failed to retrieve available members.",
    };
  }
}

export async function addMembersToGroup(
  groupId: string,
  userIds: string[]
) {
  if (userIds.length === 0) return;

  const existingMembers = await db
    .select({
      userId: userGroups.userId,
    })
    .from(userGroups)
    .where(eq(userGroups.groupId, groupId));

  const existingIds = new Set(
    existingMembers.map((m) => m.userId)
  );

  const newMembers = userIds
    .filter((id) => !existingIds.has(id))
    .map((userId) => ({
      groupId,
      userId,
      status: "active",
    }));

  if (newMembers.length > 0) {
    await db.insert(userGroups).values(newMembers);
  }

  revalidatePath(`/dashboard/admin/groups/${groupId}`);
}

export async function removeMemberFromGroup(
  membershipId: string,
  groupId: string
) {
  await db
    .delete(userGroups)
    .where(eq(userGroups.id, membershipId));

  revalidatePath(`/dashboard/admin/groups/${groupId}`);
}

export async function assignLeader(
  groupId: string,
  leaderId: string
) {
  try {
    const member = await db
      .select()
      .from(userGroups)
      .where(
        and(
          eq(userGroups.groupId, groupId),
          eq(userGroups.userId, leaderId)
        )
      );

    if (member.length === 0) {
      return {
        success: false,
        message: "Selected user is not a member of this group.",
      };
    }

    await db
      .update(groups)
      .set({
        leaderId,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));

    revalidatePath(`/dashboard/admin/groups/${groupId}`);

    return {
      success: true,
      message: "Leader assigned successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to assign leader.",
    };
  }
}

export async function removeLeader(groupId: string) {
  try {
    const group = await db
      .select({
        leaderId: groups.leaderId,
      })
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);

    if (group.length === 0) {
      return {
        success: false,
        message: "Group not found.",
      };
    }

    if (!group[0].leaderId) {
      return {
        success: false,
        message: "This group does not have a leader.",
      };
    }

    await db
      .update(groups)
      .set({
        leaderId: null,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));

    revalidatePath("/dashboard/admin/groups");
    revalidatePath(`/dashboard/admin/groups/${groupId}`);

    return {
      success: true,
      message: "Leader removed successfully.",
    };
  } catch (error) {
    console.error("Remove leader error:", error);

    return {
      success: false,
      message: "Failed to remove leader.",
    };
  }
}

export async function getGroupMembers(groupId: string) {
  try {
    const members = await db
      .select({
        membershipId: userGroups.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        status: userGroups.status,
        joinedAt: userGroups.joinedAt,
      })
      .from(userGroups)
      .innerJoin(user, eq(user.id, userGroups.userId))
      .where(eq(userGroups.groupId, groupId));

    return {
      success: true,
      data: members,
      message: "Group members retrieved successfully.",
    };
  } catch (error) {
    console.error("Error getting group members:", error);

    return {
      success: false,
      data: [],
      message: "Failed to retrieve group members.",
    };
  }
}