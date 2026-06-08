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

  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    displayAt: timestamp("display_at"),
});