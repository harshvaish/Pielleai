import { pgTable, foreignKey, unique, text, timestamp, check, serial, integer, boolean, date, varchar, uuid, numeric, time, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const availabilityStatus = pgEnum("availability_status", ['available', 'booked', 'cancelled'])
export const eventStatus = pgEnum("event_status", ['proposed', 'pre-confirmed', 'confirmed', 'rejected'])
export const profileGenders = pgEnum("profile_genders", ['maschile', 'femminile', 'non-binary'])
export const userRoles = pgEnum("user_roles", ['user', 'artist-manager', 'venue-manager', 'admin'])
export const userStatus = pgEnum("user_status", ['active', 'waiting-for-approval', 'disabled', 'banned'])
export const venueTypes = pgEnum("venue_types", ['small', 'medium', 'big'])


export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	impersonatedBy: text("impersonated_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const artistAvailabilities = pgTable("artist_availabilities", {
	id: serial().primaryKey().notNull(),
	artistId: integer("artist_id").notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	status: availabilityStatus().default('available').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	// TODO: failed to parse database type 'tsrange'
	timeRange: unknown("time_range").generatedAlwaysAs(sql`tsrange(start_date, end_date, '[)'::text)`),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "artist_availabilities_artist_id_fkey"
		}).onDelete("cascade"),
	check("chk_time_range", sql`start_date < end_date`),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	role: userRoles().default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	banned: boolean(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
	status: userStatus().default('waiting-for-approval').notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const artists = pgTable("artists", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	surname: text().notNull(),
	stageName: text("stage_name").notNull(),
	phone: text().notNull(),
	avatarUrl: text("avatar_url").notNull(),
	status: userStatus().notNull(),
	birthDate: date("birth_date").notNull(),
	birthPlace: text("birth_place").notNull(),
	address: text().notNull(),
	countryId: integer("country_id").notNull(),
	subdivisionId: integer("subdivision_id").notNull(),
	city: text().notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	gender: profileGenders().notNull(),
	tourManagerName: text("tour_manager_name").notNull(),
	tourManagerSurname: text("tour_manager_surname").notNull(),
	tourManagerEmail: text("tour_manager_email").notNull(),
	tourManagerPhone: text("tour_manager_phone").notNull(),
	company: text().notNull(),
	taxCode: text("tax_code").notNull(),
	ipiCode: text("ipi_code").notNull(),
	bicCode: text("bic_code"),
	abaRoutingNumber: varchar("aba_routing_number", { length: 20 }),
	iban: text().notNull(),
	sdiRecipientCode: text("sdi_recipient_code"),
	billingAddress: text("billing_address").notNull(),
	billingCountryId: integer("billing_country_id").notNull(),
	billingSubdivisionId: integer("billing_subdivision_id").notNull(),
	billingCity: text("billing_city").notNull(),
	billingZipCode: varchar("billing_zip_code", { length: 10 }).notNull(),
	billingEmail: text("billing_email").notNull(),
	billingPec: text("billing_pec").notNull(),
	billingPhone: text("billing_phone").notNull(),
	taxableInvoice: boolean("taxable_invoice").default(false).notNull(),
	tiktokUrl: text("tiktok_url"),
	tiktokUsername: text("tiktok_username"),
	tiktokFollowers: integer("tiktok_followers"),
	tiktokCreatedAt: date("tiktok_created_at"),
	facebookUrl: text("facebook_url"),
	facebookUsername: text("facebook_username"),
	facebookFollowers: integer("facebook_followers"),
	facebookCreatedAt: date("facebook_created_at"),
	instagramUrl: text("instagram_url"),
	instagramUsername: text("instagram_username"),
	instagramFollowers: integer("instagram_followers"),
	instagramCreatedAt: date("instagram_created_at"),
	xUrl: text("x_url"),
	xUsername: text("x_username"),
	xFollowers: integer("x_followers"),
	xCreatedAt: date("x_created_at"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	slug: uuid().defaultRandom().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.billingCountryId],
			foreignColumns: [countries.id],
			name: "artists_billing_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.billingSubdivisionId],
			foreignColumns: [subdivisions.id],
			name: "artists_billing_subdivision_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [countries.id],
			name: "artists_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.subdivisionId],
			foreignColumns: [subdivisions.id],
			name: "artists_subdivision_id_fkey"
		}).onDelete("restrict"),
	unique("artists_slug_key").on(table.slug),
]);

export const subdivisions = pgTable("subdivisions", {
	id: serial().primaryKey().notNull(),
	countryId: integer("country_id").notNull(),
	name: varchar({ length: 200 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [countries.id],
			name: "subdivisions_country_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const languages = pgTable("languages", {
	id: serial().primaryKey().notNull(),
	code: varchar({ length: 2 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("languages_code_key").on(table.code),
]);

export const countries = pgTable("countries", {
	id: serial().primaryKey().notNull(),
	code: varchar({ length: 2 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isEu: boolean("is_eu").default(false).notNull(),
}, (table) => [
	unique("countries_code_key").on(table.code),
]);

export const profiles = pgTable("profiles", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	surname: text().notNull(),
	phone: text().notNull(),
	avatarUrl: text("avatar_url").notNull(),
	birthDate: date("birth_date").notNull(),
	birthPlace: text("birth_place").notNull(),
	address: text().notNull(),
	countryId: integer("country_id").notNull(),
	subdivisionId: integer("subdivision_id").notNull(),
	city: text().notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	gender: profileGenders().notNull(),
	company: text(),
	taxCode: text("tax_code"),
	ipiCode: text("ipi_code"),
	bicCode: text("bic_code"),
	abaRoutingNumber: varchar("aba_routing_number", { length: 20 }),
	iban: text(),
	sdiRecipientCode: text("sdi_recipient_code"),
	billingAddress: text("billing_address"),
	billingCountryId: integer("billing_country_id"),
	billingSubdivisionId: integer("billing_subdivision_id"),
	billingCity: text("billing_city"),
	billingZipCode: varchar("billing_zip_code", { length: 10 }),
	billingEmail: text("billing_email"),
	billingPec: text("billing_pec"),
	billingPhone: text("billing_phone"),
	taxableInvoice: boolean("taxable_invoice").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.billingCountryId],
			foreignColumns: [countries.id],
			name: "profiles_billing_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.billingSubdivisionId],
			foreignColumns: [subdivisions.id],
			name: "profiles_billing_subdivision_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [countries.id],
			name: "profiles_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.subdivisionId],
			foreignColumns: [subdivisions.id],
			name: "profiles_subdivision_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "profiles_user_id_fkey"
		}).onDelete("cascade"),
]);

export const zones = pgTable("zones", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("zones_name_key").on(table.name),
]);

export const profileNotes = pgTable("profile_notes", {
	id: serial().primaryKey().notNull(),
	writerId: text("writer_id").notNull(),
	receiverProfileId: integer("receiver_profile_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.receiverProfileId],
			foreignColumns: [profiles.id],
			name: "profile_notes_receiver_profile_id_fkey"
		}),
	foreignKey({
			columns: [table.writerId],
			foreignColumns: [users.id],
			name: "profile_notes_writer_id_fkey"
		}),
]);

export const artistNotes = pgTable("artist_notes", {
	id: serial().primaryKey().notNull(),
	writerId: text("writer_id").notNull(),
	artistId: integer("artist_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "artist_notes_artist_id_fkey"
		}),
	foreignKey({
			columns: [table.writerId],
			foreignColumns: [users.id],
			name: "artist_notes_writer_id_fkey"
		}),
]);

export const moCoordinators = pgTable("mo_coordinators", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	surname: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const venues = pgTable("venues", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: uuid().defaultRandom().notNull(),
	status: userStatus().notNull(),
	avatarUrl: text("avatar_url").notNull(),
	type: venueTypes().notNull(),
	capacity: integer().notNull(),
	address: text().notNull(),
	countryId: integer("country_id").notNull(),
	subdivisionId: integer("subdivision_id").notNull(),
	city: text().notNull(),
	zipCode: varchar("zip_code", { length: 10 }).notNull(),
	managerProfileId: integer("manager_profile_id").notNull(),
	company: text().notNull(),
	taxCode: text("tax_code").notNull(),
	ipiCode: text("ipi_code").notNull(),
	bicCode: text("bic_code"),
	abaRoutingNumber: varchar("aba_routing_number", { length: 20 }),
	iban: text().notNull(),
	sdiRecipientCode: text("sdi_recipient_code"),
	billingAddress: text("billing_address").notNull(),
	billingCountryId: integer("billing_country_id").notNull(),
	billingSubdivisionId: integer("billing_subdivision_id").notNull(),
	billingCity: text("billing_city").notNull(),
	billingZipCode: varchar("billing_zip_code", { length: 10 }).notNull(),
	billingEmail: text("billing_email").notNull(),
	billingPec: text("billing_pec").notNull(),
	billingPhone: text("billing_phone").notNull(),
	taxableInvoice: boolean("taxable_invoice").default(false).notNull(),
	tiktokUrl: text("tiktok_url"),
	tiktokUsername: text("tiktok_username"),
	tiktokFollowers: integer("tiktok_followers"),
	tiktokCreatedAt: date("tiktok_created_at"),
	facebookUrl: text("facebook_url"),
	facebookUsername: text("facebook_username"),
	facebookFollowers: integer("facebook_followers"),
	facebookCreatedAt: date("facebook_created_at"),
	instagramUrl: text("instagram_url"),
	instagramUsername: text("instagram_username"),
	instagramFollowers: integer("instagram_followers"),
	instagramCreatedAt: date("instagram_created_at"),
	xUrl: text("x_url"),
	xUsername: text("x_username"),
	xFollowers: integer("x_followers"),
	xCreatedAt: date("x_created_at"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.billingCountryId],
			foreignColumns: [countries.id],
			name: "venues_billing_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.billingSubdivisionId],
			foreignColumns: [subdivisions.id],
			name: "venues_billing_subdivision_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [countries.id],
			name: "venues_country_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.managerProfileId],
			foreignColumns: [profiles.id],
			name: "venues_manager_profile_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.subdivisionId],
			foreignColumns: [subdivisions.id],
			name: "venues_subdivision_id_fkey"
		}).onDelete("restrict"),
	unique("venues_slug_key").on(table.slug),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	artistId: integer("artist_id").notNull(),
	status: eventStatus().default('proposed').notNull(),
	artistManagerProfileId: integer("artist_manager_profile_id"),
	availabilityId: integer("availability_id").notNull(),
	venueId: integer("venue_id").notNull(),
	administrationEmail: text("administration_email"),
	payrollConsultantEmail: text("payroll_consultant_email"),
	moCost: numeric("mo_cost"),
	venueManagerCost: numeric("venue_manager_cost"),
	depositCost: numeric("deposit_cost"),
	depositInvoiceNumber: varchar("deposit_invoice_number", { length: 100 }),
	expenseReimbursement: numeric("expense_reimbursement"),
	bookingPercentage: numeric("booking_percentage"),
	supplierCost: numeric("supplier_cost"),
	moArtistAdvancedExpenses: numeric("mo_artist_advanced_expenses"),
	artistNetCost: numeric("artist_net_cost"),
	artistUpfrontCost: numeric("artist_upfront_cost"),
	totalCost: numeric("total_cost"),
	transportationsCost: numeric("transportations_cost"),
	cashBalanceCost: numeric("cash_balance_cost"),
	hotel: text(),
	restaurant: text(),
	eveningContact: text("evening_contact"),
	moCoordinatorId: integer("mo_coordinator_id"),
	soundCheckStart: time("sound_check_start"),
	soundCheckEnd: time("sound_check_end"),
	tecnicalRiderUrl: text("tecnical_rider_url"),
	tecnicalRiderName: text("tecnical_rider_name"),
	contractSigning: boolean("contract_signing").default(false),
	depositInvoiceIssuing: boolean("deposit_invoice_issuing").default(false),
	depositReceiptVerification: boolean("deposit_receipt_verification").default(false),
	techSheetSubmission: boolean("tech_sheet_submission").default(false),
	artistEngagement: boolean("artist_engagement").default(false),
	professionalsEngagement: boolean("professionals_engagement").default(false),
	accompanyingPersonsEngagement: boolean("accompanying_persons_engagement").default(false),
	performance: boolean().default(false),
	postDateFeedback: boolean("post_date_feedback").default(false),
	bordereau: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "fk_events_artist"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.availabilityId],
			foreignColumns: [artistAvailabilities.id],
			name: "fk_events_availability"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.artistManagerProfileId],
			foreignColumns: [profiles.id],
			name: "fk_events_manager"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.moCoordinatorId],
			foreignColumns: [moCoordinators.id],
			name: "fk_events_mo_coordinator"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.venueId],
			foreignColumns: [venues.id],
			name: "fk_events_venue"
		}).onDelete("restrict"),
	unique("unique_artist_availability").on(table.artistId, table.availabilityId),
	unique("unique_venue_availability").on(table.availabilityId, table.venueId),
]);

export const eventNotes = pgTable("event_notes", {
	id: serial().primaryKey().notNull(),
	writerId: text("writer_id").notNull(),
	eventId: integer("event_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_notes_event_id_fkey"
		}),
	foreignKey({
			columns: [table.writerId],
			foreignColumns: [users.id],
			name: "event_notes_writer_id_fkey"
		}),
]);

export const artistZones = pgTable("artist_zones", {
	artistId: integer("artist_id").notNull(),
	zoneId: integer("zone_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "artist_zones_artist_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.zoneId],
			foreignColumns: [zones.id],
			name: "artist_zones_zone_id_fkey"
		}).onDelete("restrict"),
	primaryKey({ columns: [table.artistId, table.zoneId], name: "artist_zones_pkey"}),
]);

export const managerArtists = pgTable("manager_artists", {
	managerProfileId: integer("manager_profile_id").notNull(),
	artistId: integer("artist_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "manager_artists_artist_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.managerProfileId],
			foreignColumns: [profiles.id],
			name: "manager_artists_manager_profile_id_fkey"
		}).onDelete("restrict"),
	primaryKey({ columns: [table.managerProfileId, table.artistId], name: "manager_artists_pkey"}),
]);

export const artistLanguages = pgTable("artist_languages", {
	artistId: integer("artist_id").notNull(),
	languageId: integer("language_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "artist_languages_artist_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [languages.id],
			name: "artist_languages_language_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	primaryKey({ columns: [table.artistId, table.languageId], name: "artist_languages_pkey"}),
]);

export const profileLanguages = pgTable("profile_languages", {
	profileId: integer("profile_id").notNull(),
	languageId: integer("language_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [languages.id],
			name: "profile_languages_language_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profiles.id],
			name: "profile_languages_profile_id_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	primaryKey({ columns: [table.profileId, table.languageId], name: "profile_languages_pkey"}),
]);
