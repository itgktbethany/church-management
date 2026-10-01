import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const alerts = pgTable("alerts", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  title: text("title")
    .notNull(),

  message: text("message")
    .notNull(),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  sendPush: boolean("send_push")
    .default(false)
    .notNull(),

  targetType: text("target_type")
    .default("all")
    .notNull(),

  /** "one_time" fires once at displayAt; "recurring" fires on a cron schedule */
  scheduleType: text("schedule_type")
    .default("one_time")
    .notNull(),

  /** Cron expression used when scheduleType = "recurring" (e.g. "0 9 * * 0") */
  cronExpression: text("cron_expression"),

  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  displayAt: timestamp("display_at"),
});