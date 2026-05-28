import { z } from "zod";

export const devotionalSchema = z.object({
  title: z
    .string()
    .min(3, "Title minimum 3 characters"),

  verse: z
    .string()
    .min(3, "Verse is required"),

  bibleReading: z
    .string()
    .min(3, "Bible reading is required"),

  publishDate: z
    .string()
    .min(1, "Publish date required"),

  content: z
    .string()
    .min(20, "Content too short"),
});

export type DevotionalFormValues =
  z.infer<typeof devotionalSchema>;