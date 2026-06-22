import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  name: text("name")
    .notNull(),

  description: text("description"),

  leaderId: text("leader_id"),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const userGroups = pgTable(
  "user_groups",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: text("user_id")
      .notNull(),

    groupId: uuid("group_id")
      .notNull(),

    status: text("status")
      .default("active")
      .notNull(),

    joinedAt: timestamp("joined_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueMembership: unique().on(
      table.userId,
      table.groupId
    ),
  })
);