CREATE TABLE "devotional_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"devotional_id" uuid NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "devotional_completions_user_id_devotional_id_unique" UNIQUE("user_id","devotional_id")
);
--> statement-breakpoint
ALTER TABLE "devotional_completions" ADD CONSTRAINT "devotional_completions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devotional_completions" ADD CONSTRAINT "devotional_completions_devotional_id_devotionals_id_fk" FOREIGN KEY ("devotional_id") REFERENCES "public"."devotionals"("id") ON DELETE cascade ON UPDATE no action;