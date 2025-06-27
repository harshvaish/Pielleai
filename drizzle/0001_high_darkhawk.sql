CREATE TABLE "profile_languages" (
	"profile_id" integer NOT NULL,
	"language_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_languages_pkey" PRIMARY KEY("profile_id","language_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"phone" text NOT NULL,
	"avatar_url" text NOT NULL,
	"birth_date" date NOT NULL,
	"birth_place" text NOT NULL,
	"address" text NOT NULL,
	"country_id" integer NOT NULL,
	"subdivision_id" integer NOT NULL,
	"city" text NOT NULL,
	"zip_code" varchar(10) NOT NULL,
	"gender" "gender_enum" NOT NULL,
	"company" text NOT NULL,
	"tax_code" text NOT NULL,
	"ipi_code" text NOT NULL,
	"bic_code" text NOT NULL,
	"aba_routing_number" varchar(20) NOT NULL,
	"iban" text NOT NULL,
	"sdi_recipient_code" text NOT NULL,
	"billing_address" text NOT NULL,
	"billing_country_id" integer NOT NULL,
	"billing_subdivision_id" integer NOT NULL,
	"billing_city" text NOT NULL,
	"billing_zip_code" varchar(10) NOT NULL,
	"billing_email" text NOT NULL,
	"billing_pec" text NOT NULL,
	"billing_phone" text NOT NULL,
	"taxable_invoice" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."gender_enum";--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('maschile', 'femminile', 'non-binary');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "gender" SET DATA TYPE "public"."gender_enum" USING "gender"::"public"."gender_enum";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_billing_country_id_fkey" FOREIGN KEY ("billing_country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_billing_subdivision_id_fkey" FOREIGN KEY ("billing_subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_subdivision_id_fkey" FOREIGN KEY ("subdivision_id") REFERENCES "public"."subdivisions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."user_role";