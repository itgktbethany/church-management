import {
  pgTable,
  text,
  timestamp,
  boolean,date,uuid,
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

export * from "./auth-schema";