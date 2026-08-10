"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Name is required");
    }

    await db
      .update(user)
      .set({ name: name.trim() })
      .where(eq(user.id, session.user.id));

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    return { success: false, message: (error as Error).message || "Failed to update profile" };
  }
}
