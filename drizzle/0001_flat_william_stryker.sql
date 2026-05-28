CREATE TABLE "devotionals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"verse" text NOT NULL,
	"content" text NOT NULL,
	"bible_reading" text,
	"publish_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
