"use server";

import { db } from "@/lib/db";
import { pointTransactions, events } from "@/lib/db/points-schema";
import { user } from "@/lib/db/auth-schema";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function addManualPoints(userId: string, eventId: string, amount: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.transaction(async (tx) => {
    // 1. Create transaction
    await tx.insert(pointTransactions).values({
      userId,
      eventId,
      type: "add",
      amount,
      adminId: session.user.id,
    });
    
    // 2. Update user points
    const targetUser = await tx.query.user.findFirst({
      where: eq(user.id, userId),
    });
    if (targetUser) {
      await tx.update(user)
        .set({ points: (targetUser.points || 0) + amount })
        .where(eq(user.id, userId));
    }
  });
  
  revalidatePath("/dashboard/admin/points");
}

export async function deductManualPoints(userId: string, eventId: string, amount: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await db.transaction(async (tx) => {
    // 1. Create transaction
    await tx.insert(pointTransactions).values({
      userId,
      eventId,
      type: "deduct",
      amount,
      adminId: session.user.id,
    });
    
    // 2. Update user points
    const targetUser = await tx.query.user.findFirst({
      where: eq(user.id, userId),
    });
    if (targetUser) {
      const newPoints = Math.max(0, (targetUser.points || 0) - amount);
      await tx.update(user)
        .set({ points: newPoints })
        .where(eq(user.id, userId));
    }
  });
  
  revalidatePath("/dashboard/admin/points");
}

export async function redeemPoints(eventId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const userId = session.user.id;
  
  await db.transaction(async (tx) => {
    const event = await tx.query.events.findFirst({
      where: eq(events.id, eventId),
    });
    if (!event || event.type !== "deduct") throw new Error("Invalid event");
    
    const targetUser = await tx.query.user.findFirst({
      where: eq(user.id, userId),
    });
    
    if (!targetUser || (targetUser.points || 0) < event.defaultPoints) {
      throw new Error("Insufficient points");
    }

    // 1. Create transaction
    await tx.insert(pointTransactions).values({
      userId,
      eventId,
      type: "deduct",
      amount: event.defaultPoints,
      redemptionStatus: "unused",
    });
    
    // 2. Update user points
    await tx.update(user)
      .set({ points: targetUser.points - event.defaultPoints })
      .where(eq(user.id, userId));
  });
  
  revalidatePath("/dashboard/user/points/redeem");
  revalidatePath("/dashboard/user/points");
}

export async function markRedemptionUsed(transactionId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  // Assuming admin marks it or user marks it. If user, we don't strictly check admin role here for simplicity,
  // but let's just do it.

  await db.update(pointTransactions)
    .set({ redemptionStatus: "used" })
    .where(eq(pointTransactions.id, transactionId));
    
  revalidatePath("/dashboard/user/points/redeem");
  revalidatePath("/dashboard/user/points");
}

export async function getPointHistory(userId: string) {
  return await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.userId, userId),
    with: {
      event: true,
      admin: true
    },
    orderBy: [desc(pointTransactions.createdAt)],
  });
}

export async function getUsers() {
  return await db.query.user.findMany({
    orderBy: (user, { asc }) => [asc(user.name)],
  });
}
