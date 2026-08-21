import { z } from "zod";

export const alertSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  message: z
    .string()
    .min(1, "Message is required"),

  displayAt: z.string(),

  sendPush: z.boolean(),

  targetType: z.string(),

  /** "one_time" | "recurring" */
  scheduleType: z.enum(["one_time", "recurring"]),

  /** Standard 5-field cron expression, required when scheduleType = "recurring" */
  cronExpression: z.string().optional(),
});

export type AlertFormValues =
  z.infer<typeof alertSchema>;