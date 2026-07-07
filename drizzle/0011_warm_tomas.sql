CREATE TABLE "ministries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ministries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"ministry_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_ministries_user_id_ministry_id_unique" UNIQUE("user_id","ministry_id")
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;