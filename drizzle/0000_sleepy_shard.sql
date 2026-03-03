-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."availability_status" AS ENUM('available', 'booked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('proposed', 'pre-confirmed', 'confirmed', 'rejected', 'ended');--> statement-breakpoint
CREATE TYPE "public"."profile_genders" AS ENUM('male', 'female', 'non-binary');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('user', 'artist-manager', 'venue-manager', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'waiting-for-approval', 'disabled', 'banned');--> statement-breakpoint
CREATE TYPE "public"."venue_types" AS ENUM('small', 'medium', 'big');--> statement-breakpoint
CREATE SEQUENCE "public"."artist_availabilities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."artist_notes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."artists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."event_notes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."languages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."mo_coordinators_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."profile_notes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."subdivisions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."venues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."zones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "artist_availabilities" (
	"id" integer PRIMARY KEY DEFAULT nextval('artist_availabilities_id_seq'::regclass) NOT NULL,
	"artist_id" integer NOT NULL,
	"start_date" timestamp(6) with time zone NOT NULL,
	"end_date" timestamp(6) with time zone NOT NULL,
	"status" "availability_status" DEFAULT 'available' NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"time_range" "tstzrange" GENERATED ALWAYS AS (tstzrange(start_date, end_date, '[)'::text)) STORED,
	CONSTRAINT "chk_time_range" CHECK (start_date < end_date)
);
--> statement-breakpoint
ALTER TABLE "artist_availabilities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp(6),
	"refresh_token_expires_at" timestamp(6),
	"scope" text,
	"password" text,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "languages" (
	"id" integer PRIMARY KEY DEFAULT nextval('languages_id_seq'::regclass) NOT NULL,
	"code" varchar(2) NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "languages_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "languages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subdivisions" (
	"id" integer PRIMARY KEY DEFAULT nextval('subdivisions_id_seq'::regclass) NOT NULL,
	"country_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subdivisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY DEFAULT nextval('events_id_seq'::regclass) NOT NULL,
	"artist_id" integer NOT NULL,
	"artist_manager_profile_id" integer,
	"availability_id" integer NOT NULL,
	"venue_id" integer NOT NULL,
	"payroll_consultant_email" text,
	"mo_cost" numeric,
	"venue_manager_cost" numeric,
	"deposit_cost" numeric,
	"deposit_invoice_number" varchar(100),
	"booking_percentage" numeric,
	"mo_artist_advanced_expenses" numeric,
	"artist_net_cost" numeric,
	"artist_upfront_cost" numeric,
	"total_cost" numeric,
	"transportations_cost" numeric,
	"cash_balance_cost" numeric,
	"enpas" varchar(32),
	"hotel" text,
	"restaurant" text,
	"evening_contact" text,
	"mo_coordinator_id" integer,
	"sound_check_start" time(6),
	"sound_check_end" time(6),
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
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"tour_manager_email" text,
	"has_conflict" boolean DEFAULT false NOT NULL,
	"status" "event_status" DEFAULT 'proposed' NOT NULL,
	"hotel_cost" numeric,
	"restaurant_cost" numeric,
	CONSTRAINT "unique_artist_availability_venue" UNIQUE("artist_id","availability_id","venue_id")
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" integer PRIMARY KEY DEFAULT nextval('profiles_id_seq'::regclass) NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"phone" text NOT NULL,
	"avatar_url" text,
	"birth_date" date NOT NULL,
	"birth_place" text NOT NULL,
	"address" text NOT NULL,
	"country_id" integer NOT NULL,
	"subdivision_id" integer NOT NULL,
	"city" text NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"gender" "profile_genders" NOT NULL,
	"company" text,
	"tax_code" text,
	"ipi_code" text,
	"bic_code" text,
	"aba_routing_number" varchar(20),
	"iban" text,
	"sdi_recipient_code" text,
	"billing_address" text,
	"billing_country_id" integer,
	"billing_subdivision_id" integer,
	"billing_city" text,
	"billing_zip_code" varchar(10),
	"billing_email" text,
	"billing_pec" text,
	"billing_phone" text,
	"taxable_invoice" boolean DEFAULT false,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "zones" (
	"id" integer PRIMARY KEY DEFAULT nextval('zones_id_seq'::regclass) NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "zones_name_key" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "zones" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artists" (
	"id" integer PRIMARY KEY DEFAULT nextval('artists_id_seq'::regclass) NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"stage_name" text NOT NULL,
	"phone" text NOT NULL,
	"avatar_url" text NOT NULL,
	"status" "user_status" NOT NULL,
	"birth_date" date NOT NULL,
	"birth_place" text NOT NULL,
	"address" text,
	"country_id" integer,
	"subdivision_id" integer,
	"city" text,
	"zip_code" varchar(10),
	"gender" "profile_genders" NOT NULL,
	"tour_manager_name" text NOT NULL,
	"tour_manager_surname" text NOT NULL,
	"tour_manager_email" text NOT NULL,
	"tour_manager_phone" text NOT NULL,
	"company" text,
	"tax_code" text,
	"ipi_code" text,
	"bic_code" text,
	"aba_routing_number" varchar(20),
	"iban" text,
	"sdi_recipient_code" text,
	"billing_address" text,
	"billing_country_id" integer,
	"billing_subdivision_id" integer,
	"billing_city" text,
	"billing_zip_code" varchar(10),
	"billing_email" text,
	"billing_pec" text,
	"billing_phone" text,
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
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"slug" uuid DEFAULT gen_random_uuid() NOT NULL,
	"bio" text NOT NULL,
	CONSTRAINT "artists_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "artists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY DEFAULT nextval('countries_id_seq'::regclass) NOT NULL,
	"code" varchar(2) NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"is_eu" boolean DEFAULT false NOT NULL,
	CONSTRAINT "countries_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "countries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_notes" (
	"id" integer PRIMARY KEY DEFAULT nextval('event_notes_id_seq'::regclass) NOT NULL,
	"writer_id" text NOT NULL,
	"event_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "mo_coordinators" (
	"id" integer PRIMARY KEY DEFAULT nextval('mo_coordinators_id_seq'::regclass) NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "mo_coordinators" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp(6),
	"status" "user_status" DEFAULT 'waiting-for-approval' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile_notes" (
	"id" integer PRIMARY KEY DEFAULT nextval('profile_notes_id_seq'::regclass) NOT NULL,
	"writer_id" text NOT NULL,
	"receiver_profile_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "venues" (
	"id" integer PRIMARY KEY DEFAULT nextval('venues_id_seq'::regclass) NOT NULL,
	"name" text NOT NULL,
	"slug" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "user_status" NOT NULL,
	"avatar_url" text,
	"type" "venue_types" NOT NULL,
	"capacity" integer NOT NULL,
	"address" text NOT NULL,
	"country_id" integer NOT NULL,
	"subdivision_id" integer NOT NULL,
	"city" text NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"manager_profile_id" integer,
	"company" text NOT NULL,
	"tax_code" text NOT NULL,
	"vat_code" text NOT NULL,
	"bic_code" text,
	"aba_routing_number" varchar(20),
	"sdi_recipient_code" text,
	"billing_address" text NOT NULL,
	"billing_country_id" integer NOT NULL,
	"billing_subdivision_id" integer NOT NULL,
	"billing_city" text NOT NULL,
	"billing_zip_code" varchar(10) NOT NULL,
	"billing_email" text,
	"billing_pec" text NOT NULL,
	"billing_phone" text,
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
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"bio" text,
	CONSTRAINT "venues_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "venues" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artist_notes" (
	"id" integer PRIMARY KEY DEFAULT nextval('artist_notes_id_seq'::regclass) NOT NULL,
	"writer_id" text NOT NULL,
	"artist_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artist_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp(6) NOT NULL,
	"created_at" timestamp(6),
	"updated_at" timestamp(6)
);
--> statement-breakpoint
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp(6) NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artist_zones" (
	"artist_id" integer NOT NULL,
	"zone_id" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artist_zones_pkey" PRIMARY KEY("artist_id","zone_id")
);
--> statement-breakpoint
ALTER TABLE "artist_zones" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manager_artists" (
	"manager_profile_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "manager_artists_pkey" PRIMARY KEY("manager_profile_id","artist_id")
);
--> statement-breakpoint
ALTER TABLE "manager_artists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile_languages" (
	"profile_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profile_languages_pkey" PRIMARY KEY("profile_id","language_id")
);
--> statement-breakpoint
ALTER TABLE "profile_languages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artist_languages" (
	"artist_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artist_languages_pkey" PRIMARY KEY("artist_id","language_id")
);
--> statement-breakpoint
ALTER TABLE "artist_languages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artist_availabilities" ADD CONSTRAINT "artist_availabilities_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subdivisions" ADD CONSTRAINT "subdivisions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_artist" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_availability" FOREIGN KEY ("availability_id") REFERENCES "public"."artist_availabilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_manager_profile" FOREIGN KEY ("artist_manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_mo_coordinator" FOREIGN KEY ("mo_coordinator_id") REFERENCES "public"."mo_coordinators"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "fk_events_venue" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "event_notes" ADD CONSTRAINT "event_notes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_notes" ADD CONSTRAINT "event_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_notes" ADD CONSTRAINT "profile_notes_receiver_profile_id_fkey" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_notes" ADD CONSTRAINT "profile_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "venues" ADD CONSTRAINT "venues_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_notes" ADD CONSTRAINT "artist_notes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_notes" ADD CONSTRAINT "artist_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_zones" ADD CONSTRAINT "artist_zones_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_zones" ADD CONSTRAINT "artist_zones_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."zones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_artists" ADD CONSTRAINT "manager_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_artists" ADD CONSTRAINT "manager_artists_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_languages" ADD CONSTRAINT "artist_languages_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_languages" ADD CONSTRAINT "artist_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artist_availabilities_time_range_gist" ON "artist_availabilities" USING gist ("time_range" range_ops);--> statement-breakpoint
CREATE INDEX "idx_avail_artist_id" ON "artist_availabilities" USING btree ("artist_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_avail_status" ON "artist_availabilities" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_events_artist_id" ON "events" USING btree ("artist_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_availability_id" ON "events" USING btree ("availability_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_has_conflict" ON "events" USING btree ("availability_id" bool_ops,"has_conflict" bool_ops) WHERE (has_conflict = true);--> statement-breakpoint
CREATE INDEX "idx_events_manager_pid" ON "events" USING btree ("artist_manager_profile_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_artist_created_desc" ON "events" USING btree ("status" timestamptz_ops,"artist_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_created_desc" ON "events" USING btree ("status" enum_ops,"created_at" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status_venue_created_desc" ON "events" USING btree ("status" timestamptz_ops,"venue_id" timestamptz_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_venue_id" ON "events" USING btree ("venue_id" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ux_events_one_confirmed_per_availability" ON "events" USING btree ("availability_id" int4_ops) WHERE (status = 'confirmed'::event_status);--> statement-breakpoint
CREATE INDEX "idx_profiles_company_trgm" ON "profiles" USING gin ("company" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_created_at_desc" ON "profiles" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_name_trgm" ON "profiles" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_phone_trgm" ON "profiles" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_surname_trgm" ON "profiles" USING gin ("surname" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_profiles_user_id" ON "profiles" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "uq_profiles_user_id" ON "profiles" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_created_at_desc" ON "artists" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_email_trgm" ON "artists" USING gin ("email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_name_trgm" ON "artists" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_phone_trgm" ON "artists" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_stage_name_trgm" ON "artists" USING gin ("stage_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_artists_surname_trgm" ON "artists" USING gin ("surname" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_users_email_trgm" ON "users" USING gin ("email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_users_role_status" ON "users" USING btree ("role" enum_ops,"status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_address_trgm" ON "venues" USING gin ("address" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_capacity" ON "venues" USING btree ("capacity" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_company_trgm" ON "venues" USING gin ("company" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_created_at_desc" ON "venues" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_manager_profile_id" ON "venues" USING btree ("manager_profile_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_name_trgm" ON "venues" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_tax_code_trgm" ON "venues" USING gin ("tax_code" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_venues_type" ON "venues" USING btree ("type" enum_ops);
*/