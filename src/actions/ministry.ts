"use server";

import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ministries, userMinistries, user } from "@/lib/db/schema";

type UserWithRole = {
  id: string;
  role?: string;
};

export async function getMinistries() {
  try {
    const data = await db.select().from(ministries).orderBy(ministries.name);
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Failed to load ministries", data: [] };
  }
}

export async function getAllUsers() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (dbUser?.role !== "admin") throw new Error("Unauthorized");

    const data = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .orderBy(user.name);
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function createMinistry(name: string, description: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (dbUser?.role !== "admin") throw new Error("Unauthorized");

    await db.insert(ministries).values({
      name,
      description,
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to create ministry" };
  }
}

export async function deleteMinistry(ministryId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (dbUser?.role !== "admin") throw new Error("Unauthorized");

    await db.delete(ministries).where(eq(ministries.id, ministryId));
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete ministry" };
  }
}

export async function getUserMinistries(userId: string) {
  try {
    const data = await db
      .select({
        id: userMinistries.id,
        ministryId: ministries.id,
        ministryName: ministries.name,
        status: userMinistries.status,
      })
      .from(userMinistries)
      .innerJoin(ministries, eq(userMinistries.ministryId, ministries.id))
      .where(eq(userMinistries.userId, userId));
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function assignUserToMinistry(userId: string, ministryId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (dbUser?.role !== "admin") throw new Error("Unauthorized");

    await db.insert(userMinistries).values({
      userId,
      ministryId,
      status: "active",
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to assign ministry" };
  }
}

export async function unassignUserFromMinistry(userId: string, ministryId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");
    const [dbUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id));
    if (dbUser?.role !== "admin") throw new Error("Unauthorized");

    await db.delete(userMinistries).where(
      and(eq(userMinistries.userId, userId), eq(userMinistries.ministryId, ministryId))
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to remove assignment" };
  }
}
