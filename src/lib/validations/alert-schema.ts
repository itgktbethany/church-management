import { z } from "zod";

export const alertSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  message: z
    .string()
    .min(1, "Message is required"),
    displayAt:z.string(),
  sendPush: z.boolean(),
  targetType: z.string()
});

export type AlertFormValues =
  z.infer<typeof alertSchema>;