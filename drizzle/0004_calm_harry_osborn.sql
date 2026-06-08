CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"send_push" boolean DEFAULT false NOT NULL,
	"target_type" text DEFAULT 'all' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
