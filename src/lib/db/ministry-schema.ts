import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const ministries = pgTable("ministries", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userMinistries = pgTable(
  "user_ministries",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),
    userId: text("user_id").notNull(),
    ministryId: uuid("ministry_id").notNull(),
    status: text("status").default("active").notNull(), // active, inactive
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserMinistry: unique().on(table.userId, table.ministryId),
  })
);
