import { pgTable, text, timestamp, integer, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'add' or 'deduct'
  defaultPoints: integer("default_points").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "restrict" }),
  type: text("type").notNull(), // 'add' or 'deduct'
  amount: integer("amount").notNull(),
  adminId: text("admin_id").references(() => user.id, { onDelete: "set null" }), // if manual
  redemptionStatus: text("redemption_status"), // 'unused', 'used' - null if type is 'add'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

import { relations } from "drizzle-orm";

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  user: one(user, {
    fields: [pointTransactions.userId],
    references: [user.id],
  }),
  event: one(events, {
    fields: [pointTransactions.eventId],
    references: [events.id],
  }),
  admin: one(user, {
    fields: [pointTransactions.adminId],
    references: [user.id],
  })
}));
