CREATE TYPE "public"."availability_status" AS ENUM('available', 'booked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('proposed', 'pre-confirmed', 'confirmed', 'rejected', 'ended');--> statement-breakpoint
CREATE TYPE "public"."profile_genders" AS ENUM('male', 'female', 'non-binary');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('user', 'artist-manager', 'venue-manager', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'waiting-for-approval', 'disabled', 'banned');--> statement-breakpoint
CREATE TYPE "public"."venue_types" AS ENUM('small', 'medium', 'big');--> statement-breakpoint
CREATE TABLE "artist_availabilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_id" integer NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"status" "availability_status" DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"time_range" "tstzrange" GENERATED ALWAYS AS (tstzrange("start_date", "end_date", '[)')) STORED NOT NULL,
	CONSTRAINT "chk_time_range" CHECK (start_date < end_date)
);
--> statement-breakpoint
CREATE TABLE "artist_languages" (
	"artist_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artist_languages_pkey" PRIMARY KEY("artist_id","language_id")
);
--> statement-breakpoint
CREATE TABLE "artist_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"writer_id" text NOT NULL,
	"artist_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artist_zones" (
	"artist_id" integer NOT NULL,
	"zone_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artist_zones_pkey" PRIMARY KEY("artist_id","zone_id")
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"stage_name" text NOT NULL,
	"phone" text NOT NULL,
	"avatar_url" text NOT NULL,
	"status" "user_status" NOT NULL,
	"birth_date" date NOT NULL,
	"birth_place" text NOT NULL,
	"address" text NOT NULL,
	"country_id" integer NOT NULL,
	"subdivision_id" integer NOT NULL,
	"city" text NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"gender" "profile_genders" NOT NULL,
	"tour_manager_name" text NOT NULL,
	"tour_manager_surname" text NOT NULL,
	"tour_manager_email" text NOT NULL,
	"tour_manager_phone" text NOT NULL,
	"company" text NOT NULL,
	"tax_code" text NOT NULL,
	"ipi_code" text NOT NULL,
	"bic_code" text,
	"aba_routing_number" varchar(20),
	"iban" text NOT NULL,
	"sdi_recipient_code" text,
	"billing_address" text NOT NULL,
	"billing_country_id" integer NOT NULL,
	"billing_subdivision_id" integer NOT NULL,
	"billing_city" text NOT NULL,
	"billing_zip_code" varchar(10) NOT NULL,
	"billing_email" text NOT NULL,
	"billing_pec" text NOT NULL,
	"billing_phone" text NOT NULL,
	"taxable_invoice" boolean DEFAULT false NOT NULL,
	"tiktok_url" text,
	"tiktok_username" text,
	"tiktok_followers" integer,
	"tiktok_created_at" date,
	"facebook_url" text,
	"facebook_username" text,
	"facebook_followers" integer,
	"facebook_created_at" date,
	"instagram_url" text,
	"instagram_username" text,
	"instagram_followers" integer,
	"instagram_created_at" date,
	"x_url" text,
	"x_username" text,
	"x_followers" integer,
	"x_created_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "artists_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"writer_id" text NOT NULL,
	"event_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_id" integer NOT NULL,
	"status" "event_status" DEFAULT 'proposed' NOT NULL,
	"has_conflict" boolean DEFAULT false NOT NULL,
	"artist_manager_profile_id" integer,
	"availability_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	"administration_email" text,
	"payroll_consultant_email" text,
	"mo_cost" numeric,
	"venue_manager_cost" numeric,
	"deposit_cost" numeric,
	"deposit_invoice_number" varchar(100),
	"expense_reimbursement" numeric,
	"booking_percentage" numeric,
	"supplier_cost" numeric,
	"mo_artist_advanced_expenses" numeric,
	"artist_net_cost" numeric,
	"artist_upfront_cost" numeric,
	"total_cost" numeric,
	"transportations_cost" numeric,
	"cash_balance_cost" numeric,
	"hotel" text,
	"restaurant" text,
	"evening_contact" text,
	"mo_coordinator_id" integer,
	"sound_check_start" time,
	"sound_check_end" time,
	"tecnical_rider_url" text,
	"tecnical_rider_name" text,
	"contract_signing" boolean DEFAULT false NOT NULL,
	"deposit_invoice_issuing" boolean DEFAULT false NOT NULL,
	"deposit_receipt_verification" boolean DEFAULT false NOT NULL,
	"tech_sheet_submission" boolean DEFAULT false NOT NULL,
	"artist_engagement" boolean DEFAULT false NOT NULL,
	"professionals_engagement" boolean DEFAULT false NOT NULL,
	"accompanying_persons_engagement" boolean DEFAULT false NOT NULL,
	"performance" boolean DEFAULT false NOT NULL,
	"post_date_feedback" boolean DEFAULT false NOT NULL,
	"bordereau" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tour_manager_email" text,
	CONSTRAINT "unique_artist_availability_venue" UNIQUE("artist_id","availability_id","venue_id")
);
--> statement-breakpoint
CREATE TABLE "manager_artists" (
	"manager_profile_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "manager_artists_pkey" PRIMARY KEY("manager_profile_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "mo_coordinators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"writer_id" text NOT NULL,
	"receiver_profile_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "user_status" NOT NULL,
	"avatar_url" text NOT NULL,
	"type" "venue_types" NOT NULL,
	"capacity" integer NOT NULL,
	"address" text NOT NULL,
	"country_id" integer NOT NULL,
	"subdivision_id" integer NOT NULL,
	"city" text NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"manager_profile_id" integer NOT NULL,
	"company" text NOT NULL,
	"tax_code" text NOT NULL,
	"ipi_code" text NOT NULL,
	"bic_code" text,
	"aba_routing_number" varchar(20),
	"iban" text NOT NULL,
	"sdi_recipient_code" text,
	"billing_address" text NOT NULL,
	"billing_country_id" integer NOT NULL,
	"billing_subdivision_id" integer NOT NULL,
	"billing_city" text NOT NULL,
	"billing_zip_code" varchar(10) NOT NULL,
	"billing_email" text NOT NULL,
	"billing_pec" text NOT NULL,
	"billing_phone" text NOT NULL,
	"taxable_invoice" boolean DEFAULT false NOT NULL,
	"tiktok_url" text,
	"tiktok_username" text,
	"tiktok_followers" integer,
	"tiktok_created_at" date,
	"facebook_url" text,
	"facebook_username" text,
	"facebook_followers" integer,
	"facebook_created_at" date,
	"instagram_url" text,
	"instagram_username" text,
	"instagram_followers" integer,
	"instagram_created_at" date,
	"x_url" text,
	"x_username" text,
	"x_followers" integer,
	"x_created_at" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "venues_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "zones_name_key" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "profile_languages" DROP CONSTRAINT "profile_languages_language_id_fkey";
--> statement-breakpoint
ALTER TABLE "subdivisions" DROP CONSTRAINT "subdivisions_country_id_fkey";
--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_languages" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profile_languages" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "gender" SET DATA TYPE "public"."profile_genders" USING "gender"::text::"public"."profile_genders";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "company" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "tax_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "ipi_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "bic_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "aba_routing_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "iban" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "sdi_recipient_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_country_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_subdivision_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_zip_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_pec" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "billing_phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "taxable_invoice" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subdivisions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "subdivisions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "subdivisions" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_roles" USING "role"::"public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "is_eu" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'waiting-for-approval' NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_availabilities" ADD CONSTRAINT "artist_availabilities_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_languages" ADD CONSTRAINT "artist_languages_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_languages" ADD CONSTRAINT "artist_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_notes" ADD CONSTRAINT "artist_notes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_notes" ADD CONSTRAINT "artist_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_zones" ADD CONSTRAINT "artist_zones_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_zones" ADD CONSTRAINT "artist_zones_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "event_notes" ADD CONSTRAINT "event_notes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_notes" ADD CONSTRAINT "event_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_artist" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_availability" FOREIGN KEY ("availability_id") REFERENCES "public"."artist_availabilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_manager_profile" FOREIGN KEY ("artist_manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_mo_coordinator" FOREIGN KEY ("mo_coordinator_id") REFERENCES "public"."mo_coordinators"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_venue" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_artists" ADD CONSTRAINT "manager_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_artists" ADD CONSTRAINT "manager_artists_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_notes" ADD CONSTRAINT "profile_notes_receiver_profile_id_fkey" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_notes" ADD CONSTRAINT "profile_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artist_availabilities_time_range_gist" ON "artist_availabilities" USING gist ("time_range" range_ops);--> statement-breakpoint
CREATE INDEX "idx_avail_artist_id" ON "artist_availabilities" USING btree ("artist_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_avail_status" ON "artist_availabilities" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_created_at_desc" ON "artists" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_email_trgm" ON "artists" USING gin ("email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_name_trgm" ON "artists" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_phone_trgm" ON "artists" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_stage_name_trgm" ON "artists" USING gin ("stage_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_surname_trgm" ON "artists" USING gin ("surname" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_events_artist_id" ON "events" USING btree ("artist_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_availability_id" ON "events" USING btree ("availability_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_manager_pid" ON "events" USING btree ("artist_manager_profile_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_artist_created_desc" ON "events" USING btree ("status" int4_ops,"artist_id" enum_ops,"created_at" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_created_desc" ON "events" USING btree ("status" enum_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_venue_created_desc" ON "events" USING btree ("status" enum_ops,"venue_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_venue_id" ON "events" USING btree ("venue_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ux_events_one_confirmed_per_availability" ON "events" USING btree ("availability_id" int4_ops) WHERE (status = 'confirmed'::event_status);--> statement-breakpoint
CREATE INDEX "idx_venues_address_trgm" ON "venues" USING gin ("address" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_capacity" ON "venues" USING btree ("capacity" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_company_trgm" ON "venues" USING gin ("company" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_created_at_desc" ON "venues" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_manager_profile_id" ON "venues" USING btree ("manager_profile_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_name_trgm" ON "venues" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_tax_code_trgm" ON "venues" USING gin ("tax_code" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_type" ON "venues" USING btree ("type" enum_ops);--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subdivisions" ADD CONSTRAINT "subdivisions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_profiles_company_trgm" ON "profiles" USING gin ("company" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_created_at_desc" ON "profiles" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_name_trgm" ON "profiles" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_phone_trgm" ON "profiles" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_surname_trgm" ON "profiles" USING gin ("surname" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_user_id" ON "profiles" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_users_email_trgm" ON "users" USING gin ("email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_users_role_status" ON "users" USING btree ("role" enum_ops,"status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status" enum_ops);--> statement-breakpoint
DROP TYPE "public"."gender_enum";