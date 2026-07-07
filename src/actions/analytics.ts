"use server";

import { headers } from "next/headers";
import { eq, and, gte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, userGroups, devotionalComments, userMinistries, ministries } from "@/lib/db/schema";
import { subDays } from "date-fns";

export async function getMemberAnalytics(groupId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");

    // Get all members of the specified group
    const groupMembers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
      })
      .from(userGroups)
      .innerJoin(user, eq(userGroups.userId, user.id))
      .where(and(eq(userGroups.groupId, groupId), eq(userGroups.status, "active")));

    const sevenDaysAgo = subDays(new Date(), 7);

    // Prepare analytics for each member
    const analytics = await Promise.all(
      groupMembers.map(async (member) => {
        // 1. Total devotionals completed
        const [devCountResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(devotionalComments)
          .where(eq(devotionalComments.userId, member.id));
        const totalDevotionals = Number(devCountResult?.count || 0);

        // 2. Devotionals in last 7 days
        const [recentDevCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(devotionalComments)
          .where(
            and(
              eq(devotionalComments.userId, member.id),
              gte(devotionalComments.createdAt, sevenDaysAgo)
            )
          );
        const hasRecentDevotional = Number(recentDevCount?.count || 0) > 0;

        // 3. Ministries
        const userMins = await db
          .select({ name: ministries.name })
          .from(userMinistries)
          .innerJoin(ministries, eq(userMinistries.ministryId, ministries.id))
          .where(and(eq(userMinistries.userId, member.id), eq(userMinistries.status, "active")));
        
        const ministryList = userMins.map(m => m.name);

        // 4. Active Status
        const isActive = hasRecentDevotional || ministryList.length > 0;

        return {
          id: member.id,
          name: member.name || member.email,
          points: member.points,
          totalDevotionals,
          ministries: ministryList,
          isActive,
        };
      })
    );

    // Sort active first, then by points
    analytics.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return b.points - a.points;
    });

    return { success: true, data: analytics };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to load analytics", data: [] };
  }
}
