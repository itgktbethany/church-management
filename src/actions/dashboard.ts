"use server";

import { headers } from "next/headers";
import { eq, desc, count, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  user, 
  devotionals, 
  devotionalCompletions, 
  devotionalComments, 
  pointTransactions 
} from "@/lib/db/schema";

export async function getDashboardData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Get User Details
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!currentUser) return null;

  // Get Today's Devotional
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDevotional = await db.query.devotionals.findFirst({
    where: (devotionals, { lte }) => lte(devotionals.publishDate, todayStr),
    orderBy: [desc(devotionals.publishDate)],
  });

  // Get Stats
  const [completionsCount] = await db
    .select({ count: count() })
    .from(devotionalCompletions)
    .where(eq(devotionalCompletions.userId, userId));

  const [reflectionsCount] = await db
    .select({ count: count() })
    .from(devotionalComments)
    .where(eq(devotionalComments.userId, userId));

  // Get Recent Activities (Points Transactions)
  const recentTransactions = await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.userId, userId),
    with: {
      event: true,
    },
    orderBy: [desc(pointTransactions.createdAt)],
    limit: 3,
  });

  // Check today's progress
  let isDevotionalCompleted = false;
  let isReflectionWritten = false;

  if (todayDevotional) {
    const completion = await db.query.devotionalCompletions.findFirst({
      where: and(
        eq(devotionalCompletions.userId, userId),
        eq(devotionalCompletions.devotionalId, todayDevotional.id)
      ),
    });
    isDevotionalCompleted = !!completion;

    const reflection = await db.query.devotionalComments.findFirst({
      where: and(
        eq(devotionalComments.userId, userId),
        eq(devotionalComments.devotionalId, todayDevotional.id)
      ),
    });
    isReflectionWritten = !!reflection;
  }

  // Format activities for the UI
  const recentActivities = recentTransactions.map(tx => ({
    id: tx.id,
    title: tx.event?.name || "Manual Adjustment",
    points: `${tx.type === 'add' ? '+' : '-'}${tx.amount} Points`,
    type: tx.type
  }));

  return {
    user: currentUser,
    todayDevotional,
    stats: {
      streak: 0, // Streak calculation is complex, keeping 0 for now
      totalPoints: currentUser.points || 0,
      devotionals: completionsCount.count,
      reflections: reflectionsCount.count,
    },
    recentActivities,
    progress: {
      devotional: isDevotionalCompleted,
      reflection: isReflectionWritten,
    }
  };
}
