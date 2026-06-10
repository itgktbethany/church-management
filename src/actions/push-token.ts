"use server";

import { db } from "@/lib/db";
import { pushTokens } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function savePushToken(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existing = await db.query.pushTokens.findFirst({
    where: eq(pushTokens.token, token),
  });

  if (existing) {
    return;
  }

  await db.insert(pushTokens).values({
    userId: session.user.id,
    token,
  });
}