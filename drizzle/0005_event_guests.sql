CREATE TYPE IF NOT EXISTS "public"."event_guest_status" AS ENUM('to-invite', 'invited', 'attending', 'not-attending');--> statement-breakpoint
CREATE SEQUENCE IF NOT EXISTS "public"."event_guests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "event_guests" (
	"id" integer PRIMARY KEY DEFAULT nextval('event_guests_id_seq'::regclass) NOT NULL,
	"event_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"status" "event_guest_status" DEFAULT 'to-invite' NOT NULL,
	"invited_at" timestamp(6) with time zone,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_event_guests_event_id" ON "event_guests" USING btree ("event_id");
--> statement-breakpoint
CREATE INDEX "idx_event_guests_status" ON "event_guests" USING btree ("status");
--> statement-breakpoint
ALTER TABLE "event_guests" ADD CONSTRAINT "event_guests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
