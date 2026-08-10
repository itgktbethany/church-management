"use server";

import { db } from "@/lib/db";
import { events } from "@/lib/db/points-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createEvent(data: { name: string; description: string; type: "add" | "deduct"; defaultPoints: number }) {
  await db.insert(events).values(data);
  revalidatePath("/dashboard/admin/events");
}

export async function updateEvent(id: string, data: { name: string; description: string; type: "add" | "deduct"; defaultPoints: number; isActive: boolean }) {
  await db.update(events).set(data).where(eq(events.id, id));
  revalidatePath("/dashboard/admin/events");
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/dashboard/admin/events");
}

export async function getEvents() {
  return await db.query.events.findMany({
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  });
}
