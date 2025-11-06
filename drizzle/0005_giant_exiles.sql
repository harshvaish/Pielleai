DROP INDEX "idx_events_status_artist_created_desc";--> statement-breakpoint
DROP INDEX "idx_events_status_venue_created_desc";--> statement-breakpoint
ALTER TABLE "artists" ADD COLUMN "bio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "hotel_cost" numeric;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "restaurant_cost" numeric;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "bio" text NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_events_has_conflict" ON "events" USING btree ("availability_id" bool_ops,"has_conflict" int4_ops) WHERE (has_conflict = true);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_profiles_user_id" ON "profiles" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_artist_created_desc" ON "events" USING btree ("status" int4_ops,"artist_id" timestamptz_ops,"created_at" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_venue_created_desc" ON "events" USING btree ("status" enum_ops,"venue_id" int4_ops,"created_at" int4_ops);--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "administration_email";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "expense_reimbursement";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "supplier_cost";