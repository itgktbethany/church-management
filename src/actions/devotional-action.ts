"use server";

import { db } from "@/lib/db";
import { devotionals } from "@/lib/db/schema";

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
    await db.insert(devotionals).values({
      title: data.title,
      verse: data.verse,
      bibleReading: data.bibleReading,
      publishDate: data.publishDate,
      content: data.content,
    });

    return {
      success: true,
    };

  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed creating devotional",
    };
  }
}