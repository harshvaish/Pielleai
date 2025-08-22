/*
 Navicat Premium Dump SQL

 Source Server         : milano-ovest
 Source Server Type    : PostgreSQL
 Source Server Version : 150008 (150008)
 Source Host           : aws-0-eu-central-1.pooler.supabase.com:6543
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150008 (150008)
 File Encoding         : 65001

 Date: 22/08/2025 10:48:46
*/


-- ----------------------------
-- Type structure for availability_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."availability_status";
CREATE TYPE "public"."availability_status" AS ENUM (
  'available',
  'booked',
  'expired'
);
ALTER TYPE "public"."availability_status" OWNER TO "postgres";

-- ----------------------------
-- Type structure for event_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."event_status";
CREATE TYPE "public"."event_status" AS ENUM (
  'proposed',
  'pre-confirmed',
  'confirmed',
  'conflict',
  'rejected'
);
ALTER TYPE "public"."event_status" OWNER TO "postgres";

-- ----------------------------
-- Type structure for gbtreekey16
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey16";
CREATE TYPE "public"."gbtreekey16" (
  INPUT = "public"."gbtreekey16_in",
  OUTPUT = "public"."gbtreekey16_out",
  INTERNALLENGTH = 16,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey16" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for gbtreekey2
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey2";
CREATE TYPE "public"."gbtreekey2" (
  INPUT = "public"."gbtreekey2_in",
  OUTPUT = "public"."gbtreekey2_out",
  INTERNALLENGTH = 2,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey2" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for gbtreekey32
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey32";
CREATE TYPE "public"."gbtreekey32" (
  INPUT = "public"."gbtreekey32_in",
  OUTPUT = "public"."gbtreekey32_out",
  INTERNALLENGTH = 32,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey32" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for gbtreekey4
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey4";
CREATE TYPE "public"."gbtreekey4" (
  INPUT = "public"."gbtreekey4_in",
  OUTPUT = "public"."gbtreekey4_out",
  INTERNALLENGTH = 4,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey4" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for gbtreekey8
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey8";
CREATE TYPE "public"."gbtreekey8" (
  INPUT = "public"."gbtreekey8_in",
  OUTPUT = "public"."gbtreekey8_out",
  INTERNALLENGTH = 8,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey8" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for gbtreekey_var
-- ----------------------------
DROP TYPE IF EXISTS "public"."gbtreekey_var";
CREATE TYPE "public"."gbtreekey_var" (
  INPUT = "public"."gbtreekey_var_in",
  OUTPUT = "public"."gbtreekey_var_out",
  INTERNALLENGTH = VARIABLE,
  STORAGE = extended,
  CATEGORY = U,
  DELIMITER = ','
);
ALTER TYPE "public"."gbtreekey_var" OWNER TO "supabase_admin";

-- ----------------------------
-- Type structure for profile_genders
-- ----------------------------
DROP TYPE IF EXISTS "public"."profile_genders";
CREATE TYPE "public"."profile_genders" AS ENUM (
  'maschile',
  'femminile',
  'non-binary'
);
ALTER TYPE "public"."profile_genders" OWNER TO "postgres";

-- ----------------------------
-- Type structure for user_roles
-- ----------------------------
DROP TYPE IF EXISTS "public"."user_roles";
CREATE TYPE "public"."user_roles" AS ENUM (
  'user',
  'artist-manager',
  'venue-manager',
  'admin'
);
ALTER TYPE "public"."user_roles" OWNER TO "postgres";

-- ----------------------------
-- Type structure for user_status
-- ----------------------------
DROP TYPE IF EXISTS "public"."user_status";
CREATE TYPE "public"."user_status" AS ENUM (
  'active',
  'waiting-for-approval',
  'disabled',
  'banned'
);
ALTER TYPE "public"."user_status" OWNER TO "postgres";

-- ----------------------------
-- Type structure for venue_types
-- ----------------------------
DROP TYPE IF EXISTS "public"."venue_types";
CREATE TYPE "public"."venue_types" AS ENUM (
  'small',
  'medium',
  'big'
);
ALTER TYPE "public"."venue_types" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for artist_availabilities_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."artist_availabilities_id_seq";
CREATE SEQUENCE "public"."artist_availabilities_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."artist_availabilities_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for artist_notes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."artist_notes_id_seq";
CREATE SEQUENCE "public"."artist_notes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."artist_notes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for artists_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."artists_id_seq";
CREATE SEQUENCE "public"."artists_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."artists_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for countries_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."countries_id_seq";
CREATE SEQUENCE "public"."countries_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."countries_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for event_notes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."event_notes_id_seq";
CREATE SEQUENCE "public"."event_notes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."event_notes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for events_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."events_id_seq";
CREATE SEQUENCE "public"."events_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."events_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for languages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."languages_id_seq";
CREATE SEQUENCE "public"."languages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."languages_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for mo_coordinators_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."mo_coordinators_id_seq";
CREATE SEQUENCE "public"."mo_coordinators_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."mo_coordinators_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for profile_notes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."profile_notes_id_seq";
CREATE SEQUENCE "public"."profile_notes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."profile_notes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for profiles_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."profiles_id_seq";
CREATE SEQUENCE "public"."profiles_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."profiles_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for subdivisions_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."subdivisions_id_seq";
CREATE SEQUENCE "public"."subdivisions_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."subdivisions_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for venues_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."venues_id_seq";
CREATE SEQUENCE "public"."venues_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."venues_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for zones_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."zones_id_seq";
CREATE SEQUENCE "public"."zones_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."zones_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS "public"."accounts";
CREATE TABLE "public"."accounts" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "account_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "provider_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "access_token" text COLLATE "pg_catalog"."default",
  "refresh_token" text COLLATE "pg_catalog"."default",
  "id_token" text COLLATE "pg_catalog"."default",
  "access_token_expires_at" timestamp(6),
  "refresh_token_expires_at" timestamp(6),
  "scope" text COLLATE "pg_catalog"."default",
  "password" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL
)
;
ALTER TABLE "public"."accounts" OWNER TO "postgres";

-- ----------------------------
-- Table structure for artist_availabilities
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_availabilities";
CREATE TABLE "public"."artist_availabilities" (
  "id" int4 NOT NULL DEFAULT nextval('artist_availabilities_id_seq'::regclass),
  "artist_id" int4 NOT NULL,
  "start_date" timestamp(6) NOT NULL,
  "end_date" timestamp(6) NOT NULL,
  "status" "public"."availability_status" NOT NULL DEFAULT 'available'::availability_status,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "time_range" tsrange GENERATED ALWAYS AS (
tsrange(start_date, end_date, '[)'::text)
) STORED
)
;
ALTER TABLE "public"."artist_availabilities" OWNER TO "postgres";

-- ----------------------------
-- Table structure for artist_languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_languages";
CREATE TABLE "public"."artist_languages" (
  "artist_id" int4 NOT NULL,
  "language_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_languages" OWNER TO "postgres";

-- ----------------------------
-- Table structure for artist_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_notes";
CREATE TABLE "public"."artist_notes" (
  "id" int4 NOT NULL DEFAULT nextval('artist_notes_id_seq'::regclass),
  "writer_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "artist_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_notes" OWNER TO "postgres";

-- ----------------------------
-- Table structure for artist_zones
-- ----------------------------
DROP TABLE IF EXISTS "public"."artist_zones";
CREATE TABLE "public"."artist_zones" (
  "artist_id" int4 NOT NULL,
  "zone_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."artist_zones" OWNER TO "postgres";

-- ----------------------------
-- Table structure for artists
-- ----------------------------
DROP TABLE IF EXISTS "public"."artists";
CREATE TABLE "public"."artists" (
  "id" int4 NOT NULL DEFAULT nextval('artists_id_seq'::regclass),
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "stage_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."user_status" NOT NULL,
  "birth_date" date NOT NULL,
  "birth_place" text COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "gender" "public"."profile_genders" NOT NULL,
  "tour_manager_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "tour_manager_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "company" text COLLATE "pg_catalog"."default" NOT NULL,
  "tax_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "ipi_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default" NOT NULL,
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_country_id" int4 NOT NULL,
  "billing_subdivision_id" int4 NOT NULL,
  "billing_city" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "billing_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_pec" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "taxable_invoice" bool NOT NULL DEFAULT false,
  "tiktok_url" text COLLATE "pg_catalog"."default",
  "tiktok_username" text COLLATE "pg_catalog"."default",
  "tiktok_followers" int4,
  "tiktok_created_at" date,
  "facebook_url" text COLLATE "pg_catalog"."default",
  "facebook_username" text COLLATE "pg_catalog"."default",
  "facebook_followers" int4,
  "facebook_created_at" date,
  "instagram_url" text COLLATE "pg_catalog"."default",
  "instagram_username" text COLLATE "pg_catalog"."default",
  "instagram_followers" int4,
  "instagram_created_at" date,
  "x_url" text COLLATE "pg_catalog"."default",
  "x_username" text COLLATE "pg_catalog"."default",
  "x_followers" int4,
  "x_created_at" date,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "slug" uuid NOT NULL DEFAULT gen_random_uuid()
)
;
ALTER TABLE "public"."artists" OWNER TO "postgres";

-- ----------------------------
-- Table structure for countries
-- ----------------------------
DROP TABLE IF EXISTS "public"."countries";
CREATE TABLE "public"."countries" (
  "id" int4 NOT NULL DEFAULT nextval('countries_id_seq'::regclass),
  "code" varchar(2) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "is_eu" bool NOT NULL DEFAULT false
)
;
ALTER TABLE "public"."countries" OWNER TO "postgres";

-- ----------------------------
-- Table structure for event_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."event_notes";
CREATE TABLE "public"."event_notes" (
  "id" int4 NOT NULL DEFAULT nextval('event_notes_id_seq'::regclass),
  "writer_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "event_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."event_notes" OWNER TO "postgres";

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS "public"."events";
CREATE TABLE "public"."events" (
  "id" int4 NOT NULL DEFAULT nextval('events_id_seq'::regclass),
  "artist_id" int4 NOT NULL,
  "status" "public"."event_status" NOT NULL DEFAULT 'proposed'::event_status,
  "artist_manager_profile_id" int4,
  "availability_id" int4 NOT NULL,
  "venue_id" int4 NOT NULL,
  "administration_email" text COLLATE "pg_catalog"."default",
  "payroll_consultant_email" text COLLATE "pg_catalog"."default",
  "mo_cost" numeric,
  "venue_manager_cost" numeric,
  "deposit_cost" numeric,
  "deposit_invoice_number" varchar(100) COLLATE "pg_catalog"."default",
  "expense_reimbursement" numeric,
  "booking_percentage" numeric,
  "supplier_cost" numeric,
  "mo_artist_advanced_expenses" numeric,
  "artist_net_cost" numeric,
  "artist_upfront_cost" numeric,
  "total_cost" numeric,
  "transportations_cost" numeric,
  "cash_balance_cost" numeric,
  "hotel" text COLLATE "pg_catalog"."default",
  "restaurant" text COLLATE "pg_catalog"."default",
  "evening_contact" text COLLATE "pg_catalog"."default",
  "mo_coordinator_id" int4,
  "sound_check_start" time(6),
  "sound_check_end" time(6),
  "tecnical_rider_url" text COLLATE "pg_catalog"."default",
  "tecnical_rider_name" text COLLATE "pg_catalog"."default",
  "contract_signing" bool NOT NULL DEFAULT false,
  "deposit_invoice_issuing" bool NOT NULL DEFAULT false,
  "deposit_receipt_verification" bool NOT NULL DEFAULT false,
  "tech_sheet_submission" bool NOT NULL DEFAULT false,
  "artist_engagement" bool NOT NULL DEFAULT false,
  "professionals_engagement" bool NOT NULL DEFAULT false,
  "accompanying_persons_engagement" bool NOT NULL DEFAULT false,
  "performance" bool NOT NULL DEFAULT false,
  "post_date_feedback" bool NOT NULL DEFAULT false,
  "bordereau" bool NOT NULL DEFAULT false,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now(),
  "previous_status" "public"."event_status",
  "tour_manager_email" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."events" OWNER TO "postgres";

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."languages";
CREATE TABLE "public"."languages" (
  "id" int4 NOT NULL DEFAULT nextval('languages_id_seq'::regclass),
  "code" varchar(2) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."languages" OWNER TO "postgres";

-- ----------------------------
-- Table structure for manager_artists
-- ----------------------------
DROP TABLE IF EXISTS "public"."manager_artists";
CREATE TABLE "public"."manager_artists" (
  "manager_profile_id" int4 NOT NULL,
  "artist_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."manager_artists" OWNER TO "postgres";

-- ----------------------------
-- Table structure for mo_coordinators
-- ----------------------------
DROP TABLE IF EXISTS "public"."mo_coordinators";
CREATE TABLE "public"."mo_coordinators" (
  "id" int4 NOT NULL DEFAULT nextval('mo_coordinators_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."mo_coordinators" OWNER TO "postgres";

-- ----------------------------
-- Table structure for profile_languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."profile_languages";
CREATE TABLE "public"."profile_languages" (
  "profile_id" int4 NOT NULL,
  "language_id" int4 NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profile_languages" OWNER TO "postgres";

-- ----------------------------
-- Table structure for profile_notes
-- ----------------------------
DROP TABLE IF EXISTS "public"."profile_notes";
CREATE TABLE "public"."profile_notes" (
  "id" int4 NOT NULL DEFAULT nextval('profile_notes_id_seq'::regclass),
  "writer_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "receiver_profile_id" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profile_notes" OWNER TO "postgres";

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS "public"."profiles";
CREATE TABLE "public"."profiles" (
  "id" int4 NOT NULL DEFAULT nextval('profiles_id_seq'::regclass),
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "surname" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "birth_date" date NOT NULL,
  "birth_place" text COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "gender" "public"."profile_genders" NOT NULL,
  "company" text COLLATE "pg_catalog"."default",
  "tax_code" text COLLATE "pg_catalog"."default",
  "ipi_code" text COLLATE "pg_catalog"."default",
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default",
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default",
  "billing_country_id" int4,
  "billing_subdivision_id" int4,
  "billing_city" text COLLATE "pg_catalog"."default",
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default",
  "billing_email" text COLLATE "pg_catalog"."default",
  "billing_pec" text COLLATE "pg_catalog"."default",
  "billing_phone" text COLLATE "pg_catalog"."default",
  "taxable_invoice" bool DEFAULT false,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."profiles" OWNER TO "postgres";

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."sessions";
CREATE TABLE "public"."sessions" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "token" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL,
  "ip_address" text COLLATE "pg_catalog"."default",
  "user_agent" text COLLATE "pg_catalog"."default",
  "user_id" text COLLATE "pg_catalog"."default" NOT NULL,
  "impersonated_by" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."sessions" OWNER TO "postgres";

-- ----------------------------
-- Table structure for subdivisions
-- ----------------------------
DROP TABLE IF EXISTS "public"."subdivisions";
CREATE TABLE "public"."subdivisions" (
  "id" int4 NOT NULL DEFAULT nextval('subdivisions_id_seq'::regclass),
  "country_id" int4 NOT NULL,
  "name" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."subdivisions" OWNER TO "postgres";

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "email_verified" bool NOT NULL,
  "image" text COLLATE "pg_catalog"."default",
  "role" "public"."user_roles" NOT NULL DEFAULT 'user'::user_roles,
  "created_at" timestamp(6) NOT NULL,
  "updated_at" timestamp(6) NOT NULL,
  "banned" bool,
  "ban_reason" text COLLATE "pg_catalog"."default",
  "ban_expires" timestamp(6),
  "status" "public"."user_status" NOT NULL DEFAULT 'waiting-for-approval'::user_status
)
;
ALTER TABLE "public"."users" OWNER TO "postgres";

-- ----------------------------
-- Table structure for venues
-- ----------------------------
DROP TABLE IF EXISTS "public"."venues";
CREATE TABLE "public"."venues" (
  "id" int4 NOT NULL DEFAULT nextval('venues_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "slug" uuid NOT NULL DEFAULT gen_random_uuid(),
  "status" "public"."user_status" NOT NULL,
  "avatar_url" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."venue_types" NOT NULL,
  "capacity" int4 NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "country_id" int4 NOT NULL,
  "subdivision_id" int4 NOT NULL,
  "city" text COLLATE "pg_catalog"."default" NOT NULL,
  "zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "manager_profile_id" int4 NOT NULL,
  "company" text COLLATE "pg_catalog"."default" NOT NULL,
  "tax_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "ipi_code" text COLLATE "pg_catalog"."default" NOT NULL,
  "bic_code" text COLLATE "pg_catalog"."default",
  "aba_routing_number" varchar(20) COLLATE "pg_catalog"."default",
  "iban" text COLLATE "pg_catalog"."default" NOT NULL,
  "sdi_recipient_code" text COLLATE "pg_catalog"."default",
  "billing_address" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_country_id" int4 NOT NULL,
  "billing_subdivision_id" int4 NOT NULL,
  "billing_city" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_zip_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "billing_email" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_pec" text COLLATE "pg_catalog"."default" NOT NULL,
  "billing_phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "taxable_invoice" bool NOT NULL DEFAULT false,
  "tiktok_url" text COLLATE "pg_catalog"."default",
  "tiktok_username" text COLLATE "pg_catalog"."default",
  "tiktok_followers" int4,
  "tiktok_created_at" date,
  "facebook_url" text COLLATE "pg_catalog"."default",
  "facebook_username" text COLLATE "pg_catalog"."default",
  "facebook_followers" int4,
  "facebook_created_at" date,
  "instagram_url" text COLLATE "pg_catalog"."default",
  "instagram_username" text COLLATE "pg_catalog"."default",
  "instagram_followers" int4,
  "instagram_created_at" date,
  "x_url" text COLLATE "pg_catalog"."default",
  "x_username" text COLLATE "pg_catalog"."default",
  "x_followers" int4,
  "x_created_at" date,
  "created_at" timestamp(6) NOT NULL DEFAULT now(),
  "updated_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."venues" OWNER TO "postgres";

-- ----------------------------
-- Table structure for verifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."verifications";
CREATE TABLE "public"."verifications" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "identifier" text COLLATE "pg_catalog"."default" NOT NULL,
  "value" text COLLATE "pg_catalog"."default" NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "created_at" timestamp(6),
  "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."verifications" OWNER TO "postgres";

-- ----------------------------
-- Table structure for zones
-- ----------------------------
DROP TABLE IF EXISTS "public"."zones";
CREATE TABLE "public"."zones" (
  "id" int4 NOT NULL DEFAULT nextval('zones_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) NOT NULL DEFAULT now()
)
;
ALTER TABLE "public"."zones" OWNER TO "postgres";

-- ----------------------------
-- Function structure for cash_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."cash_dist"(money, money);
CREATE FUNCTION "public"."cash_dist"(money, money)
  RETURNS "pg_catalog"."money" AS '$libdir/btree_gist', 'cash_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."cash_dist"(money, money) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for date_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."date_dist"(date, date);
CREATE FUNCTION "public"."date_dist"(date, date)
  RETURNS "pg_catalog"."int4" AS '$libdir/btree_gist', 'date_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."date_dist"(date, date) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for float4_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."float4_dist"(float4, float4);
CREATE FUNCTION "public"."float4_dist"(float4, float4)
  RETURNS "pg_catalog"."float4" AS '$libdir/btree_gist', 'float4_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."float4_dist"(float4, float4) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for float8_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."float8_dist"(float8, float8);
CREATE FUNCTION "public"."float8_dist"(float8, float8)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'float8_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."float8_dist"(float8, float8) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_compress"(internal);
CREATE FUNCTION "public"."gbt_bit_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bit_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_consistent"(internal, bit, int2, oid, internal);
CREATE FUNCTION "public"."gbt_bit_consistent"(internal, bit, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_bit_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_consistent"(internal, bit, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_bit_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bit_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_bit_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bit_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal);
CREATE FUNCTION "public"."gbt_bit_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bit_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bit_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bit_union"(internal, internal);
CREATE FUNCTION "public"."gbt_bit_union"(internal, internal)
  RETURNS "public"."gbtreekey_var" AS '$libdir/btree_gist', 'gbt_bit_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bit_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_compress"(internal);
CREATE FUNCTION "public"."gbt_bool_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bool_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_consistent"(internal, bool, int2, oid, internal);
CREATE FUNCTION "public"."gbt_bool_consistent"(internal, bool, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_bool_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_consistent"(internal, bool, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_fetch"(internal);
CREATE FUNCTION "public"."gbt_bool_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bool_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_bool_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bool_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_bool_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bool_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_same"("public"."gbtreekey2", "public"."gbtreekey2", internal);
CREATE FUNCTION "public"."gbt_bool_same"("public"."gbtreekey2", "public"."gbtreekey2", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bool_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_same"("public"."gbtreekey2", "public"."gbtreekey2", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bool_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bool_union"(internal, internal);
CREATE FUNCTION "public"."gbt_bool_union"(internal, internal)
  RETURNS "public"."gbtreekey2" AS '$libdir/btree_gist', 'gbt_bool_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bool_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bpchar_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bpchar_compress"(internal);
CREATE FUNCTION "public"."gbt_bpchar_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bpchar_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bpchar_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bpchar_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bpchar_consistent"(internal, bpchar, int2, oid, internal);
CREATE FUNCTION "public"."gbt_bpchar_consistent"(internal, bpchar, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_bpchar_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bpchar_consistent"(internal, bpchar, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_compress"(internal);
CREATE FUNCTION "public"."gbt_bytea_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bytea_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_consistent"(internal, bytea, int2, oid, internal);
CREATE FUNCTION "public"."gbt_bytea_consistent"(internal, bytea, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_bytea_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_consistent"(internal, bytea, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_bytea_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bytea_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_bytea_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bytea_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal);
CREATE FUNCTION "public"."gbt_bytea_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_bytea_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_bytea_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_bytea_union"(internal, internal);
CREATE FUNCTION "public"."gbt_bytea_union"(internal, internal)
  RETURNS "public"."gbtreekey_var" AS '$libdir/btree_gist', 'gbt_bytea_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_bytea_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_compress"(internal);
CREATE FUNCTION "public"."gbt_cash_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_cash_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_consistent"(internal, money, int2, oid, internal);
CREATE FUNCTION "public"."gbt_cash_consistent"(internal, money, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_cash_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_consistent"(internal, money, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_distance"(internal, money, int2, oid, internal);
CREATE FUNCTION "public"."gbt_cash_distance"(internal, money, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_cash_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_distance"(internal, money, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_fetch"(internal);
CREATE FUNCTION "public"."gbt_cash_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_cash_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_cash_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_cash_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_cash_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_cash_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_cash_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_cash_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_cash_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_cash_union"(internal, internal);
CREATE FUNCTION "public"."gbt_cash_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_cash_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_cash_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_compress"(internal);
CREATE FUNCTION "public"."gbt_date_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_date_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_consistent"(internal, date, int2, oid, internal);
CREATE FUNCTION "public"."gbt_date_consistent"(internal, date, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_date_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_consistent"(internal, date, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_distance"(internal, date, int2, oid, internal);
CREATE FUNCTION "public"."gbt_date_distance"(internal, date, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_date_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_distance"(internal, date, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_fetch"(internal);
CREATE FUNCTION "public"."gbt_date_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_date_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_date_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_date_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_date_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_date_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_same"("public"."gbtreekey8", "public"."gbtreekey8", internal);
CREATE FUNCTION "public"."gbt_date_same"("public"."gbtreekey8", "public"."gbtreekey8", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_date_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_same"("public"."gbtreekey8", "public"."gbtreekey8", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_date_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_date_union"(internal, internal);
CREATE FUNCTION "public"."gbt_date_union"(internal, internal)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbt_date_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_date_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_decompress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_decompress"(internal);
CREATE FUNCTION "public"."gbt_decompress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_decompress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_decompress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_compress"(internal);
CREATE FUNCTION "public"."gbt_enum_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_enum_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_consistent"(internal, anyenum, int2, oid, internal);
CREATE FUNCTION "public"."gbt_enum_consistent"(internal, anyenum, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_enum_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_consistent"(internal, anyenum, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_fetch"(internal);
CREATE FUNCTION "public"."gbt_enum_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_enum_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_enum_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_enum_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_enum_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_enum_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_same"("public"."gbtreekey8", "public"."gbtreekey8", internal);
CREATE FUNCTION "public"."gbt_enum_same"("public"."gbtreekey8", "public"."gbtreekey8", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_enum_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_same"("public"."gbtreekey8", "public"."gbtreekey8", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_enum_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_enum_union"(internal, internal);
CREATE FUNCTION "public"."gbt_enum_union"(internal, internal)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbt_enum_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_enum_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_compress"(internal);
CREATE FUNCTION "public"."gbt_float4_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float4_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_consistent"(internal, float4, int2, oid, internal);
CREATE FUNCTION "public"."gbt_float4_consistent"(internal, float4, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_float4_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_consistent"(internal, float4, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_distance"(internal, float4, int2, oid, internal);
CREATE FUNCTION "public"."gbt_float4_distance"(internal, float4, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_float4_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_distance"(internal, float4, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_fetch"(internal);
CREATE FUNCTION "public"."gbt_float4_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float4_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_float4_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float4_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_float4_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float4_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal);
CREATE FUNCTION "public"."gbt_float4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float4_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float4_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float4_union"(internal, internal);
CREATE FUNCTION "public"."gbt_float4_union"(internal, internal)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbt_float4_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float4_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_compress"(internal);
CREATE FUNCTION "public"."gbt_float8_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float8_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_consistent"(internal, float8, int2, oid, internal);
CREATE FUNCTION "public"."gbt_float8_consistent"(internal, float8, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_float8_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_consistent"(internal, float8, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_distance"(internal, float8, int2, oid, internal);
CREATE FUNCTION "public"."gbt_float8_distance"(internal, float8, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_float8_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_distance"(internal, float8, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_fetch"(internal);
CREATE FUNCTION "public"."gbt_float8_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float8_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_float8_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float8_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_float8_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float8_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_float8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_float8_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_float8_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_float8_union"(internal, internal);
CREATE FUNCTION "public"."gbt_float8_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_float8_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_float8_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_compress"(internal);
CREATE FUNCTION "public"."gbt_inet_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_inet_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_consistent"(internal, inet, int2, oid, internal);
CREATE FUNCTION "public"."gbt_inet_consistent"(internal, inet, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_inet_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_consistent"(internal, inet, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_inet_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_inet_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_inet_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_inet_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_inet_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_inet_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_inet_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_inet_union"(internal, internal);
CREATE FUNCTION "public"."gbt_inet_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_inet_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_inet_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_compress"(internal);
CREATE FUNCTION "public"."gbt_int2_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int2_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_consistent"(internal, int2, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int2_consistent"(internal, int2, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_int2_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_consistent"(internal, int2, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_distance"(internal, int2, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int2_distance"(internal, int2, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_int2_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_distance"(internal, int2, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_fetch"(internal);
CREATE FUNCTION "public"."gbt_int2_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int2_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_int2_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int2_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_int2_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int2_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_same"("public"."gbtreekey4", "public"."gbtreekey4", internal);
CREATE FUNCTION "public"."gbt_int2_same"("public"."gbtreekey4", "public"."gbtreekey4", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int2_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_same"("public"."gbtreekey4", "public"."gbtreekey4", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int2_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int2_union"(internal, internal);
CREATE FUNCTION "public"."gbt_int2_union"(internal, internal)
  RETURNS "public"."gbtreekey4" AS '$libdir/btree_gist', 'gbt_int2_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int2_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_compress"(internal);
CREATE FUNCTION "public"."gbt_int4_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int4_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_consistent"(internal, int4, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int4_consistent"(internal, int4, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_int4_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_consistent"(internal, int4, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_distance"(internal, int4, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int4_distance"(internal, int4, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_int4_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_distance"(internal, int4, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_fetch"(internal);
CREATE FUNCTION "public"."gbt_int4_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int4_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_int4_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int4_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_int4_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int4_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal);
CREATE FUNCTION "public"."gbt_int4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int4_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_same"("public"."gbtreekey8", "public"."gbtreekey8", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int4_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int4_union"(internal, internal);
CREATE FUNCTION "public"."gbt_int4_union"(internal, internal)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbt_int4_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int4_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_compress"(internal);
CREATE FUNCTION "public"."gbt_int8_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int8_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_consistent"(internal, int8, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int8_consistent"(internal, int8, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_int8_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_consistent"(internal, int8, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_distance"(internal, int8, int2, oid, internal);
CREATE FUNCTION "public"."gbt_int8_distance"(internal, int8, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_int8_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_distance"(internal, int8, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_fetch"(internal);
CREATE FUNCTION "public"."gbt_int8_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int8_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_int8_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int8_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_int8_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int8_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_int8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_int8_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_int8_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_int8_union"(internal, internal);
CREATE FUNCTION "public"."gbt_int8_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_int8_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_int8_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_compress"(internal);
CREATE FUNCTION "public"."gbt_intv_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_consistent"(internal, interval, int2, oid, internal);
CREATE FUNCTION "public"."gbt_intv_consistent"(internal, interval, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_intv_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_consistent"(internal, interval, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_decompress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_decompress"(internal);
CREATE FUNCTION "public"."gbt_intv_decompress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_decompress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_decompress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_distance"(internal, interval, int2, oid, internal);
CREATE FUNCTION "public"."gbt_intv_distance"(internal, interval, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_intv_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_distance"(internal, interval, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_fetch"(internal);
CREATE FUNCTION "public"."gbt_intv_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_intv_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_intv_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_same"("public"."gbtreekey32", "public"."gbtreekey32", internal);
CREATE FUNCTION "public"."gbt_intv_same"("public"."gbtreekey32", "public"."gbtreekey32", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_intv_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_same"("public"."gbtreekey32", "public"."gbtreekey32", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_intv_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_intv_union"(internal, internal);
CREATE FUNCTION "public"."gbt_intv_union"(internal, internal)
  RETURNS "public"."gbtreekey32" AS '$libdir/btree_gist', 'gbt_intv_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_intv_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_compress"(internal);
CREATE FUNCTION "public"."gbt_macad8_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad8_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_consistent"(internal, macaddr8, int2, oid, internal);
CREATE FUNCTION "public"."gbt_macad8_consistent"(internal, macaddr8, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_macad8_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_consistent"(internal, macaddr8, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_fetch"(internal);
CREATE FUNCTION "public"."gbt_macad8_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad8_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_macad8_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad8_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_macad8_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad8_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_macad8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad8_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad8_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad8_union"(internal, internal);
CREATE FUNCTION "public"."gbt_macad8_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_macad8_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad8_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_compress"(internal);
CREATE FUNCTION "public"."gbt_macad_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_consistent"(internal, macaddr, int2, oid, internal);
CREATE FUNCTION "public"."gbt_macad_consistent"(internal, macaddr, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_macad_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_consistent"(internal, macaddr, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_fetch"(internal);
CREATE FUNCTION "public"."gbt_macad_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_macad_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_macad_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_macad_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_macad_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_macad_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_macad_union"(internal, internal);
CREATE FUNCTION "public"."gbt_macad_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_macad_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_macad_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_compress"(internal);
CREATE FUNCTION "public"."gbt_numeric_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_numeric_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_consistent"(internal, numeric, int2, oid, internal);
CREATE FUNCTION "public"."gbt_numeric_consistent"(internal, numeric, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_numeric_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_consistent"(internal, numeric, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_numeric_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_numeric_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_numeric_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_numeric_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal);
CREATE FUNCTION "public"."gbt_numeric_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_numeric_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_numeric_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_numeric_union"(internal, internal);
CREATE FUNCTION "public"."gbt_numeric_union"(internal, internal)
  RETURNS "public"."gbtreekey_var" AS '$libdir/btree_gist', 'gbt_numeric_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_numeric_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_compress"(internal);
CREATE FUNCTION "public"."gbt_oid_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_oid_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_consistent"(internal, oid, int2, oid, internal);
CREATE FUNCTION "public"."gbt_oid_consistent"(internal, oid, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_oid_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_consistent"(internal, oid, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_distance"(internal, oid, int2, oid, internal);
CREATE FUNCTION "public"."gbt_oid_distance"(internal, oid, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_oid_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_distance"(internal, oid, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_fetch"(internal);
CREATE FUNCTION "public"."gbt_oid_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_oid_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_oid_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_oid_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_oid_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_oid_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_same"("public"."gbtreekey8", "public"."gbtreekey8", internal);
CREATE FUNCTION "public"."gbt_oid_same"("public"."gbtreekey8", "public"."gbtreekey8", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_oid_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_same"("public"."gbtreekey8", "public"."gbtreekey8", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_oid_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_oid_union"(internal, internal);
CREATE FUNCTION "public"."gbt_oid_union"(internal, internal)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbt_oid_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_oid_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_compress"(internal);
CREATE FUNCTION "public"."gbt_text_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_text_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_consistent"(internal, text, int2, oid, internal);
CREATE FUNCTION "public"."gbt_text_consistent"(internal, text, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_text_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_consistent"(internal, text, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_text_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_text_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_text_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_text_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal);
CREATE FUNCTION "public"."gbt_text_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_text_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_same"("public"."gbtreekey_var", "public"."gbtreekey_var", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_text_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_text_union"(internal, internal);
CREATE FUNCTION "public"."gbt_text_union"(internal, internal)
  RETURNS "public"."gbtreekey_var" AS '$libdir/btree_gist', 'gbt_text_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_text_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_compress"(internal);
CREATE FUNCTION "public"."gbt_time_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_time_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_consistent"(internal, time, int2, oid, internal);
CREATE FUNCTION "public"."gbt_time_consistent"(internal, time, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_time_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_consistent"(internal, time, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_distance"(internal, time, int2, oid, internal);
CREATE FUNCTION "public"."gbt_time_distance"(internal, time, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_time_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_distance"(internal, time, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_fetch"(internal);
CREATE FUNCTION "public"."gbt_time_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_time_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_time_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_time_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_time_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_time_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_time_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_time_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_time_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_time_union"(internal, internal);
CREATE FUNCTION "public"."gbt_time_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_time_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_time_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_timetz_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_timetz_compress"(internal);
CREATE FUNCTION "public"."gbt_timetz_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_timetz_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_timetz_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_timetz_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_timetz_consistent"(internal, timetz, int2, oid, internal);
CREATE FUNCTION "public"."gbt_timetz_consistent"(internal, timetz, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_timetz_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_timetz_consistent"(internal, timetz, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_compress"(internal);
CREATE FUNCTION "public"."gbt_ts_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_ts_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_consistent"(internal, timestamp, int2, oid, internal);
CREATE FUNCTION "public"."gbt_ts_consistent"(internal, timestamp, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_ts_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_consistent"(internal, timestamp, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_distance"(internal, timestamp, int2, oid, internal);
CREATE FUNCTION "public"."gbt_ts_distance"(internal, timestamp, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_ts_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_distance"(internal, timestamp, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_fetch"(internal);
CREATE FUNCTION "public"."gbt_ts_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_ts_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_ts_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_ts_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_ts_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_ts_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_same"("public"."gbtreekey16", "public"."gbtreekey16", internal);
CREATE FUNCTION "public"."gbt_ts_same"("public"."gbtreekey16", "public"."gbtreekey16", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_ts_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_same"("public"."gbtreekey16", "public"."gbtreekey16", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_ts_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_ts_union"(internal, internal);
CREATE FUNCTION "public"."gbt_ts_union"(internal, internal)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbt_ts_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_ts_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_tstz_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_tstz_compress"(internal);
CREATE FUNCTION "public"."gbt_tstz_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_tstz_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_tstz_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_tstz_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_tstz_consistent"(internal, timestamptz, int2, oid, internal);
CREATE FUNCTION "public"."gbt_tstz_consistent"(internal, timestamptz, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_tstz_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_tstz_consistent"(internal, timestamptz, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_tstz_distance
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_tstz_distance"(internal, timestamptz, int2, oid, internal);
CREATE FUNCTION "public"."gbt_tstz_distance"(internal, timestamptz, int2, oid, internal)
  RETURNS "pg_catalog"."float8" AS '$libdir/btree_gist', 'gbt_tstz_distance'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_tstz_distance"(internal, timestamptz, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_compress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_compress"(internal);
CREATE FUNCTION "public"."gbt_uuid_compress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_uuid_compress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_compress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_consistent
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_consistent"(internal, uuid, int2, oid, internal);
CREATE FUNCTION "public"."gbt_uuid_consistent"(internal, uuid, int2, oid, internal)
  RETURNS "pg_catalog"."bool" AS '$libdir/btree_gist', 'gbt_uuid_consistent'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_consistent"(internal, uuid, int2, oid, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_fetch"(internal);
CREATE FUNCTION "public"."gbt_uuid_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_uuid_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_penalty
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_penalty"(internal, internal, internal);
CREATE FUNCTION "public"."gbt_uuid_penalty"(internal, internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_uuid_penalty'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_penalty"(internal, internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_picksplit
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_picksplit"(internal, internal);
CREATE FUNCTION "public"."gbt_uuid_picksplit"(internal, internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_uuid_picksplit'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_picksplit"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_same
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_same"("public"."gbtreekey32", "public"."gbtreekey32", internal);
CREATE FUNCTION "public"."gbt_uuid_same"("public"."gbtreekey32", "public"."gbtreekey32", internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_uuid_same'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_same"("public"."gbtreekey32", "public"."gbtreekey32", internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_uuid_union
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_uuid_union"(internal, internal);
CREATE FUNCTION "public"."gbt_uuid_union"(internal, internal)
  RETURNS "public"."gbtreekey32" AS '$libdir/btree_gist', 'gbt_uuid_union'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_uuid_union"(internal, internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_var_decompress
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_var_decompress"(internal);
CREATE FUNCTION "public"."gbt_var_decompress"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_var_decompress'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_var_decompress"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbt_var_fetch
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbt_var_fetch"(internal);
CREATE FUNCTION "public"."gbt_var_fetch"(internal)
  RETURNS "pg_catalog"."internal" AS '$libdir/btree_gist', 'gbt_var_fetch'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbt_var_fetch"(internal) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey16_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey16_in"(cstring);
CREATE FUNCTION "public"."gbtreekey16_in"(cstring)
  RETURNS "public"."gbtreekey16" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey16_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey16_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey16_out"("public"."gbtreekey16");
CREATE FUNCTION "public"."gbtreekey16_out"("public"."gbtreekey16")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey16_out"("public"."gbtreekey16") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey2_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey2_in"(cstring);
CREATE FUNCTION "public"."gbtreekey2_in"(cstring)
  RETURNS "public"."gbtreekey2" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey2_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey2_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey2_out"("public"."gbtreekey2");
CREATE FUNCTION "public"."gbtreekey2_out"("public"."gbtreekey2")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey2_out"("public"."gbtreekey2") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey32_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey32_in"(cstring);
CREATE FUNCTION "public"."gbtreekey32_in"(cstring)
  RETURNS "public"."gbtreekey32" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey32_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey32_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey32_out"("public"."gbtreekey32");
CREATE FUNCTION "public"."gbtreekey32_out"("public"."gbtreekey32")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey32_out"("public"."gbtreekey32") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey4_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey4_in"(cstring);
CREATE FUNCTION "public"."gbtreekey4_in"(cstring)
  RETURNS "public"."gbtreekey4" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey4_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey4_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey4_out"("public"."gbtreekey4");
CREATE FUNCTION "public"."gbtreekey4_out"("public"."gbtreekey4")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey4_out"("public"."gbtreekey4") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey8_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey8_in"(cstring);
CREATE FUNCTION "public"."gbtreekey8_in"(cstring)
  RETURNS "public"."gbtreekey8" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey8_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey8_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey8_out"("public"."gbtreekey8");
CREATE FUNCTION "public"."gbtreekey8_out"("public"."gbtreekey8")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey8_out"("public"."gbtreekey8") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey_var_in
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey_var_in"(cstring);
CREATE FUNCTION "public"."gbtreekey_var_in"(cstring)
  RETURNS "public"."gbtreekey_var" AS '$libdir/btree_gist', 'gbtreekey_in'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey_var_in"(cstring) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for gbtreekey_var_out
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gbtreekey_var_out"("public"."gbtreekey_var");
CREATE FUNCTION "public"."gbtreekey_var_out"("public"."gbtreekey_var")
  RETURNS "pg_catalog"."cstring" AS '$libdir/btree_gist', 'gbtreekey_out'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."gbtreekey_var_out"("public"."gbtreekey_var") OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for handle_event_delete
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."handle_event_delete"();
CREATE FUNCTION "public"."handle_event_delete"()
  RETURNS "pg_catalog"."trigger" AS $BODY$declare
  remaining_total int;
  remaining_confirmed int;
  remaining_one_id int;
  avail_expired boolean;
begin
  -- Only operate if OLD had a relevant status
  if old.status not in ('proposed','pre-confirmed','confirmed','conflict') then
     return old;
  end if;

  -- Is availability expired? (avoid downgrading expired back to 'available')
  select (end_date < now()) into avail_expired
  from public.artist_availabilities
  where id = old.availability_id;

  -- Count remaining events on this availability
  select
    count(*) filter (where status in ('proposed','pre-confirmed','confirmed','conflict')) as total_count,
    count(*) filter (where status = 'confirmed') as confirmed_count
  into remaining_total, remaining_confirmed
  from public.events
  where availability_id = old.availability_id;

  -- If no confirmed remain and availability not expired -> mark availability available
  if remaining_confirmed = 0 and not avail_expired then
    update public.artist_availabilities
    set status = 'available', updated_at = now()
    where id = old.availability_id;
  end if;

  -- If exactly one event remains on this availability and it's currently conflict -> restore it
  if remaining_total = 1 then
    select id into remaining_one_id
    from public.events
    where availability_id = old.availability_id
      and status = 'conflict'
    limit 1;

    if remaining_one_id is not null then
      update public.events
      set status = coalesce(previous_status, 'proposed'),
          previous_status = null,
          updated_at = now()
      where id = remaining_one_id;
    end if;
  end if;

  return old;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION "public"."handle_event_delete"() OWNER TO "postgres";

-- ----------------------------
-- Function structure for handle_event_insert
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."handle_event_insert"();
CREATE FUNCTION "public"."handle_event_insert"()
  RETURNS "pg_catalog"."trigger" AS $BODY$begin
  -- 1) Block if availability is expired
  if (
    select end_date < now()
    from public.artist_availabilities
    where id = new.availability_id
  ) then
    raise exception 'Cannot create event: availability is expired.';
  end if;

  -- 2) If inserting a confirmed event, ensure no other confirmed exists and book the availability
  if new.status = 'confirmed' then
    if exists (
      select 1
      from public.events
      where availability_id = new.availability_id
        and status = 'confirmed'
        and id <> new.id
    ) then
      raise exception 'An event is already confirmed for this availability.';
    end if;

    update public.artist_availabilities
    set status = 'booked', updated_at = now()
    where id = new.availability_id;
  end if;

  -- 3) Conflict: any other event on the same availability means conflict
  if new.status in ('proposed', 'pre-confirmed', 'confirmed', 'conflict') then
    if exists (
      select 1
      from public.events
      where availability_id = new.availability_id
        and id <> new.id
        and status in ('proposed', 'pre-confirmed', 'confirmed', 'conflict')
    ) then
      -- Turn all non-confirmed events on this availability into conflict (incl. the new one if P/PC)
      update public.events
      set previous_status = status,
          status = 'conflict',
          updated_at = now()
      where availability_id = new.availability_id
        and status in ('proposed', 'pre-confirmed');
    end if;
  end if;

  return new;
end;$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION "public"."handle_event_insert"() OWNER TO "postgres";

-- ----------------------------
-- Function structure for handle_event_update
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."handle_event_update"();
CREATE FUNCTION "public"."handle_event_update"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
declare
  active_count int;
  confirmed_count int;
  remaining_conflict_id int;
  is_expired boolean;
begin
  -- 1) If NEW is confirmed, enforce single confirmed & book availability
  if new.status = 'confirmed' then
    if exists (
      select 1 from public.events
      where availability_id = new.availability_id
        and status = 'confirmed'
        and id <> new.id
    ) then
      raise exception 'An event is already confirmed for this availability.';
    end if;

    update public.artist_availabilities
    set status = 'booked', updated_at = now()
    where id = new.availability_id;
  end if;

  -- 2) If downgraded from confirmed -> not confirmed, maybe free availability
  if old.status = 'confirmed' and new.status <> 'confirmed' then
    select count(*) into confirmed_count
    from public.events
    where availability_id = new.availability_id
      and status = 'confirmed';

    select (end_date < now()) into is_expired
    from public.artist_availabilities
    where id = new.availability_id;

    if confirmed_count = 0 and not is_expired then
      update public.artist_availabilities
      set status = 'available', updated_at = now()
      where id = new.availability_id;
    end if;
  end if;

  -- 3) Recompute conflicts on this availability
  -- Count "active" events (the ones that can be in conflict)
  select count(*) into active_count
  from public.events
  where availability_id = new.availability_id
    and status in ('proposed','pre-confirmed','confirmed','conflict');

  if active_count >= 2 then
    -- Turn all non-confirmed into conflict (including NEW if it is P/PC)
    update public.events
    set previous_status = status,
        status = 'conflict',
        updated_at = now()
    where availability_id = new.availability_id
      and status in ('proposed','pre-confirmed');
  elsif active_count = 1 then
    -- If exactly 1 remains and it is conflict, restore it
    select id into remaining_conflict_id
    from public.events
    where availability_id = new.availability_id
      and status = 'conflict'
    limit 1;

    if remaining_conflict_id is not null then
      update public.events
      set status = coalesce(previous_status, 'proposed'),
          previous_status = null,
          updated_at = now()
      where id = remaining_conflict_id;
    end if;
  end if;

  return new;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION "public"."handle_event_update"() OWNER TO "postgres";

-- ----------------------------
-- Function structure for int2_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."int2_dist"(int2, int2);
CREATE FUNCTION "public"."int2_dist"(int2, int2)
  RETURNS "pg_catalog"."int2" AS '$libdir/btree_gist', 'int2_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."int2_dist"(int2, int2) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for int4_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."int4_dist"(int4, int4);
CREATE FUNCTION "public"."int4_dist"(int4, int4)
  RETURNS "pg_catalog"."int4" AS '$libdir/btree_gist', 'int4_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."int4_dist"(int4, int4) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for int8_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."int8_dist"(int8, int8);
CREATE FUNCTION "public"."int8_dist"(int8, int8)
  RETURNS "pg_catalog"."int8" AS '$libdir/btree_gist', 'int8_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."int8_dist"(int8, int8) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for interval_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."interval_dist"(interval, interval);
CREATE FUNCTION "public"."interval_dist"(interval, interval)
  RETURNS "pg_catalog"."interval" AS '$libdir/btree_gist', 'interval_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."interval_dist"(interval, interval) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for oid_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."oid_dist"(oid, oid);
CREATE FUNCTION "public"."oid_dist"(oid, oid)
  RETURNS "pg_catalog"."oid" AS '$libdir/btree_gist', 'oid_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."oid_dist"(oid, oid) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for time_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."time_dist"(time, time);
CREATE FUNCTION "public"."time_dist"(time, time)
  RETURNS "pg_catalog"."interval" AS '$libdir/btree_gist', 'time_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."time_dist"(time, time) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for ts_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."ts_dist"(timestamp, timestamp);
CREATE FUNCTION "public"."ts_dist"(timestamp, timestamp)
  RETURNS "pg_catalog"."interval" AS '$libdir/btree_gist', 'ts_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."ts_dist"(timestamp, timestamp) OWNER TO "supabase_admin";

-- ----------------------------
-- Function structure for tstz_dist
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."tstz_dist"(timestamptz, timestamptz);
CREATE FUNCTION "public"."tstz_dist"(timestamptz, timestamptz)
  RETURNS "pg_catalog"."interval" AS '$libdir/btree_gist', 'tstz_dist'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;
ALTER FUNCTION "public"."tstz_dist"(timestamptz, timestamptz) OWNER TO "supabase_admin";

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."artist_availabilities_id_seq"
OWNED BY "public"."artist_availabilities"."id";
SELECT setval('"public"."artist_availabilities_id_seq"', 39, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."artist_notes_id_seq"
OWNED BY "public"."artist_notes"."id";
SELECT setval('"public"."artist_notes_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."artists_id_seq"
OWNED BY "public"."artists"."id";
SELECT setval('"public"."artists_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."countries_id_seq"
OWNED BY "public"."countries"."id";
SELECT setval('"public"."countries_id_seq"', 250, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."event_notes_id_seq"
OWNED BY "public"."event_notes"."id";
SELECT setval('"public"."event_notes_id_seq"', 17, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."events_id_seq"
OWNED BY "public"."events"."id";
SELECT setval('"public"."events_id_seq"', 55, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."languages_id_seq"
OWNED BY "public"."languages"."id";
SELECT setval('"public"."languages_id_seq"', 184, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."mo_coordinators_id_seq"
OWNED BY "public"."mo_coordinators"."id";
SELECT setval('"public"."mo_coordinators_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."profile_notes_id_seq"
OWNED BY "public"."profile_notes"."id";
SELECT setval('"public"."profile_notes_id_seq"', 26, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."profiles_id_seq"
OWNED BY "public"."profiles"."id";
SELECT setval('"public"."profiles_id_seq"', 15, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."subdivisions_id_seq"
OWNED BY "public"."subdivisions"."id";
SELECT setval('"public"."subdivisions_id_seq"', 3860, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."venues_id_seq"
OWNED BY "public"."venues"."id";
SELECT setval('"public"."venues_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."zones_id_seq"
OWNED BY "public"."zones"."id";
SELECT setval('"public"."zones_id_seq"', 5, true);

-- ----------------------------
-- Primary Key structure for table accounts
-- ----------------------------
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table artist_availabilities
-- ----------------------------
CREATE INDEX "artist_availabilities_no_overlap" ON "public"."artist_availabilities" USING gist (
  "artist_id" "public"."gist_int4_ops",
  "time_range" "pg_catalog"."range_ops"
);

-- ----------------------------
-- Checks structure for table artist_availabilities
-- ----------------------------
ALTER TABLE "public"."artist_availabilities" ADD CONSTRAINT "chk_time_range" CHECK (start_date < end_date);

-- ----------------------------
-- Excludes structure for table artist_availabilities
-- ----------------------------
ALTER TABLE "public"."artist_availabilities" ADD CONSTRAINT "artist_availabilities_no_overlap" EXCLUDE USING gist ("artist_id" "public"."gist_int4_ops" WITH "pg_catalog".=, "time_range" "pg_catalog"."range_ops" WITH "pg_catalog".&&);

-- ----------------------------
-- Primary Key structure for table artist_availabilities
-- ----------------------------
ALTER TABLE "public"."artist_availabilities" ADD CONSTRAINT "artist_availabilities_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table artist_languages
-- ----------------------------
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_pkey" PRIMARY KEY ("artist_id", "language_id");

-- ----------------------------
-- Primary Key structure for table artist_notes
-- ----------------------------
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table artist_zones
-- ----------------------------
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_pkey" PRIMARY KEY ("artist_id", "zone_id");

-- ----------------------------
-- Uniques structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table countries
-- ----------------------------
ALTER TABLE "public"."countries" ADD CONSTRAINT "countries_code_key" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table countries
-- ----------------------------
ALTER TABLE "public"."countries" ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table event_notes
-- ----------------------------
ALTER TABLE "public"."event_notes" ADD CONSTRAINT "event_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table events
-- ----------------------------
CREATE UNIQUE INDEX "ux_events_one_confirmed_per_availability" ON "public"."events" USING btree (
  "availability_id" "pg_catalog"."int4_ops" ASC NULLS LAST
) WHERE status = 'confirmed'::event_status;

-- ----------------------------
-- Triggers structure for table events
-- ----------------------------
CREATE TRIGGER "trg_event_delete" AFTER DELETE ON "public"."events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."handle_event_delete"();
CREATE TRIGGER "trg_event_insert" AFTER INSERT ON "public"."events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."handle_event_insert"();
CREATE TRIGGER "trg_event_update" AFTER UPDATE OF "status", "availability_id" ON "public"."events"
FOR EACH ROW
EXECUTE PROCEDURE "public"."handle_event_update"();

-- ----------------------------
-- Uniques structure for table events
-- ----------------------------
ALTER TABLE "public"."events" ADD CONSTRAINT "unique_artist_availability_venue" UNIQUE ("artist_id", "availability_id", "venue_id");

-- ----------------------------
-- Primary Key structure for table events
-- ----------------------------
ALTER TABLE "public"."events" ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table languages
-- ----------------------------
ALTER TABLE "public"."languages" ADD CONSTRAINT "languages_code_key" UNIQUE ("code");

-- ----------------------------
-- Primary Key structure for table languages
-- ----------------------------
ALTER TABLE "public"."languages" ADD CONSTRAINT "languages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table manager_artists
-- ----------------------------
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_pkey" PRIMARY KEY ("manager_profile_id", "artist_id");

-- ----------------------------
-- Primary Key structure for table mo_coordinators
-- ----------------------------
ALTER TABLE "public"."mo_coordinators" ADD CONSTRAINT "mo_coordinators_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table profile_languages
-- ----------------------------
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_pkey" PRIMARY KEY ("profile_id", "language_id");

-- ----------------------------
-- Primary Key structure for table profile_notes
-- ----------------------------
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE ("token");

-- ----------------------------
-- Primary Key structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table subdivisions
-- ----------------------------
ALTER TABLE "public"."subdivisions" ADD CONSTRAINT "subdivisions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table verifications
-- ----------------------------
ALTER TABLE "public"."verifications" ADD CONSTRAINT "verifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table zones
-- ----------------------------
ALTER TABLE "public"."zones" ADD CONSTRAINT "zones_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table zones
-- ----------------------------
ALTER TABLE "public"."zones" ADD CONSTRAINT "zones_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table accounts
-- ----------------------------
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_availabilities
-- ----------------------------
ALTER TABLE "public"."artist_availabilities" ADD CONSTRAINT "artist_availabilities_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_languages
-- ----------------------------
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."artist_languages" ADD CONSTRAINT "artist_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_notes
-- ----------------------------
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."artist_notes" ADD CONSTRAINT "artist_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artist_zones
-- ----------------------------
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."artist_zones" ADD CONSTRAINT "artist_zones_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."zones" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table artists
-- ----------------------------
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "public"."artists" ADD CONSTRAINT "artists_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- ----------------------------
-- Foreign Keys structure for table event_notes
-- ----------------------------
ALTER TABLE "public"."event_notes" ADD CONSTRAINT "event_notes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."event_notes" ADD CONSTRAINT "event_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table events
-- ----------------------------
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_events_artist" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_events_availability" FOREIGN KEY ("availability_id") REFERENCES "public"."artist_availabilities" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_events_manager_profile" FOREIGN KEY ("artist_manager_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_events_mo_coordinator" FOREIGN KEY ("mo_coordinator_id") REFERENCES "public"."mo_coordinators" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."events" ADD CONSTRAINT "fk_events_venue" FOREIGN KEY ("venue_id") REFERENCES "public"."venues" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table manager_artists
-- ----------------------------
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."manager_artists" ADD CONSTRAINT "manager_artists_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profile_languages
-- ----------------------------
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."profile_languages" ADD CONSTRAINT "profile_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profile_notes
-- ----------------------------
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_receiver_profile_id_fkey" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."profile_notes" ADD CONSTRAINT "profile_notes_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table profiles
-- ----------------------------
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table subdivisions
-- ----------------------------
ALTER TABLE "public"."subdivisions" ADD CONSTRAINT "subdivisions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table venues
-- ----------------------------
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_manager_profile_id_fkey" FOREIGN KEY ("manager_profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
