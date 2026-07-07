"use server";

import { db } from "@/lib/db";
import { userGroups } from "@/lib/db/group-schema";
import { user, devotionalComments } from "@/lib/db/schema";
import { eq, inArray, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function getGroupFeed(groupId: string) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    // Verify user is in this group
    const membership = await db
      .select({ groupId: userGroups.groupId })
      .from(userGroups)
      .where(and(eq(userGroups.userId, session.user.id), eq(userGroups.groupId, groupId), eq(userGroups.status, "active")))
      .limit(1);

    if (!membership || membership.length === 0) {
      return { success: false, message: "User not in group", data: [] };
    }

    // Get all members in the group
    const members = await db
      .select({ userId: userGroups.userId })
      .from(userGroups)
      .where(and(eq(userGroups.groupId, groupId), eq(userGroups.status, "active")));

    const memberIds = members.map(m => m.userId);

    if (memberIds.length === 0) {
      return { success: true, message: "No members", data: [] };
    }

    // Today's start Date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get comments (reflections) created by these members
    const feed = await db
      .select({
        id: devotionalComments.id,
        comment: devotionalComments.comment,
        visibility: devotionalComments.visibility,
        createdAt: devotionalComments.createdAt,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        }
      })
      .from(devotionalComments)
      .innerJoin(user, eq(devotionalComments.userId, user.id))
      .where(
        inArray(devotionalComments.userId, memberIds)
      )
      .orderBy(desc(devotionalComments.createdAt));

    // Filter for today
    const todaysFeed = feed.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= today;
    });

    return {
      success: true,
      message: "Feed retrieved",
      data: todaysFeed
    };
  } catch (error) {
    console.error("getGroupFeed error:", error);
    return { success: false, message: "Failed to retrieve feed", data: [] };
  }
}
