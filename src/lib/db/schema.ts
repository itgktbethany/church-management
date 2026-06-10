import {
  pgTable,
  text,
  timestamp,
  boolean,date,uuid,unique,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name"),

  email: text("email")
    .notNull()
    .unique(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  image: text("image"),

  role: text("role")
    .default("member"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const devotionals = pgTable(
  "devotionals",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    title: text("title")
      .notNull(),

    verse: text("verse")
      .notNull(),

    content: text("content")
      .notNull(),

    bibleReading: text(
      "bible_reading"
    ),

    publishDate: date(
      "publish_date"
    ),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);


export const devotionalComments =
  pgTable(
    "devotional_comments",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      devotionalId: uuid(
        "devotional_id"
      )
        .references(
          () => devotionals.id,
          {
            onDelete:
              "cascade",
          }
        )
        .notNull(),

      userId: text(
        "user_id"
      ).notNull(),

      comment: text(
        "comment"
      ).notNull(),

      createdAt: timestamp(
        "created_at"
      )
        .defaultNow()
        .notNull(),
    }
  );

  export const devotionalCompletions = pgTable(
  "devotional_completions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    devotionalId: uuid("devotional_id")
      .notNull()
      .references(() => devotionals.id, {
        onDelete: "cascade",
      }),

    completedAt: timestamp("completed_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDevotionalUnique: unique().on(
      table.userId,
      table.devotionalId
    ),
  })
);

export const pushTokens = pgTable(
  "push_tokens",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(()=>user.id,{
        onDelete: "cascade",
      }),

    token: text("token")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tokenUnique: unique().on(table.token),
  })
);

export * from "./auth-schema";
export * from "./alert-schema"