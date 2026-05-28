"use server";

import { headers } from "next/headers";
import { desc,eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  devotionals,
  devotionalComments,
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
  comment: string
) {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session?.user) {
    throw new Error(
      "User not found"
    );
  }

  await db
    .insert(
      devotionalComments
    )
    .values({
      devotionalId,
      userId:
        session.user.id,
      comment,
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
  publish_date: string;
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
              item.publish_date,
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