import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name is required"),

  description: z.string().optional(),
});

export type GroupFormValues = z.infer<
  typeof groupSchema
>;