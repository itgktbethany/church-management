CREATE TABLE "devotional_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"devotional_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devotional_comments" ADD CONSTRAINT "devotional_comments_devotional_id_devotionals_id_fk" FOREIGN KEY ("devotional_id") REFERENCES "public"."devotionals"("id") ON DELETE cascade ON UPDATE no action;