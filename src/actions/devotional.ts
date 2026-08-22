"use server";

import { headers } from "next/headers";
import { desc, eq, and, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  devotionals,
  devotionalComments,
  devotionalCompletions,
  events,
  pointTransactions,
  user,
} from "@/lib/db/schema";


// ====================
// GET DEVOTIONALS
// ====================

export async function getDevotionals() {
  return await db
    .select()
    .from(devotionals)
    .orderBy(
      desc(
        devotionals.publishDate
      )
    );
}


// ====================
// CREATE DEVOTIONAL
// ====================

type CreateDevotionalInput = {
  title: string;
  verse: string;
  bibleReading: string;
  publishDate: string;
  content: string;
};

export async function createDevotional(
  data: CreateDevotionalInput
) {
  try {
    await db
      .insert(devotionals)
      .values({
        title: data.title,
        verse: data.verse,
        bibleReading:
          data.bibleReading,
        publishDate:
          data.publishDate,
        content: data.content,
      });

    return {
      success: true,
    };

  } catch {
    return {
      success: false,
      message:
        "Failed creating devotional",
    };
  }
}


// ====================
// SAVE REFLECTION
// ====================

export async function saveReflection(
  devotionalId: string,
  comment: string,
  visibility: "private" | "group" = "private"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not found");
  }

  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(devotionalComments)
      .where(
        and(
          eq(devotionalComments.devotionalId, devotionalId),
          eq(devotionalComments.userId, session.user.id)
        )
      );

    if (existing) {
      await tx
        .update(devotionalComments)
        .set({ comment, visibility })
        .where(eq(devotionalComments.id, existing.id));
    } else {
      await tx
        .insert(devotionalComments)
        .values({
          devotionalId,
          userId: session.user.id,
          comment,
          visibility,
        });

      await tx.insert(devotionalCompletions).values({
        userId: session.user.id,
        devotionalId,
      });

      let event = await tx.query.events.findFirst({
        where: eq(events.name, "Devotional Completion"),
      });

      if (!event) {
        const [newEvent] = await tx
          .insert(events)
          .values({
            name: "Devotional Completion",
            type: "add",
            defaultPoints: 10,
          })
          .returning();
        event = newEvent;
      }

      await tx.insert(pointTransactions).values({
        userId: session.user.id,
        eventId: event.id,
        type: "add",
        amount: 10,
      });

      await tx
        .update(user)
        .set({ points: sql`${user.points} + 10` })
        .where(eq(user.id, session.user.id));
    }
  });

  return {
    success: true,
  };
}

// delete devotionals 
export async function deleteDevotional(
  id: string
) {
  try {
    await db
      .delete(devotionals)
      .where(
        eq(
          devotionals.id,
          id
        )
      );

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Delete failed",
    };
  }
}

type UpdateDevotionalInput = {
  id: string;
  title: string;
  verse: string;
  bibleReading: string;
  publishDate: string;
  content: string;
};

export async function updateDevotional(
  data: UpdateDevotionalInput
) {
  try {

    await db
      .update(devotionals)
      .set({
        title: data.title,
        verse: data.verse,
        bibleReading:
          data.bibleReading,
        publishDate:
          data.publishDate,
        content: data.content,
      })
      .where(
        eq(
          devotionals.id,
          data.id
        )
      );

    return {
      success: true,
    };

  } catch {

    return {
      success: false,
      message:
        "Update failed",
    };
  }
}

type BulkDevotionalInput = {
  title: string;
  verse: string;
  bible_reading: string;
  content: string;
  publishDate: string;
};

export async function bulkCreateDevotionals(
  data: BulkDevotionalInput[]
) {
  try {

    await db
      .insert(devotionals)
      .values(

        data.map(
          (item) => ({
            title:
              item.title,

            verse:
              item.verse,

            bibleReading:
              item.bible_reading,

            content:
              item.content,

            publishDate:
              item.publishDate,
          })
        )

      );

    return {
      success: true,
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      message:
        "Bulk upload failed",
    };
  }
}