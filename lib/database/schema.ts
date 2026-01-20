import {
  pgTable,
  foreignKey,
  unique,
  text,
  timestamp,
  index,
  serial,
  date,
  integer,
  varchar,
  boolean,
  uuid,
  uniqueIndex,
  numeric,
  time,
  check,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { generatedTSTZRangeColumn } from '@/lib/database/tstz-range';

export const availabilityStatus = pgEnum('availability_status', ['available', 'booked', 'expired']);
export const eventStatus = pgEnum('event_status', [
  'proposed',
  'pre-confirmed',
  'confirmed',
  'rejected',
  'ended',
]);
export const profileGenders = pgEnum('profile_genders', ['male', 'female', 'non-binary']);
export const userRoles = pgEnum('user_roles', ['user', 'artist-manager', 'venue-manager', 'admin']);
export const userStatus = pgEnum('user_status', [
  'active',
  'waiting-for-approval',
  'disabled',
  'banned',
]);
export const venueTypes = pgEnum('venue_types', ['small', 'medium', 'big']);

export const contractStatus = pgEnum('contract_status', [
  'all',
  'to-sign',
  'signed',
  'refused',
  'error',
  'archived',
]);

export const paymentStatus = pgEnum('payment_status', [
  'pending',
  'upfront-required',
  'upfront-paid',
  'balance-required',
  'balance-paid',
  'fully-paid',
  'expired',
  'failed',
]);

export const paymentMethod = pgEnum('payment_method', [
  'stripe',
  'bank-transfer-sepa',
  'bank-transfer-instant',
  'bank-transfer-other',
  'cash',
  'other',
]);

export const sessions = pgTable(
  'sessions',
  {
    id: text().primaryKey().notNull(),
    expiresAt: timestamp('expires_at', {}).notNull(),
    token: text().notNull(),
    createdAt: timestamp('created_at', {}).notNull(),
    updatedAt: timestamp('updated_at', {}).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull(),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'sessions_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('sessions_token_unique').on(table.token),
  ],
);

export const verifications = pgTable('verifications', {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp('expires_at', {}).notNull(),
  createdAt: timestamp('created_at', {}),
  updatedAt: timestamp('updated_at', {}),
});

export const accounts = pgTable(
  'accounts',
  {
    id: text().primaryKey().notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {}),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {}),
    scope: text(),
    password: text(),
    createdAt: timestamp('created_at', {}).notNull(),
    updatedAt: timestamp('updated_at', {}).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'accounts_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
);

export const artists = pgTable(
  'artists',
  {
    id: serial().primaryKey().notNull(),
    email: text().notNull(),
    name: text().notNull(),
    surname: text().notNull(),
    stageName: text('stage_name').notNull(),
    bio: text('bio').notNull(),
    phone: text().notNull(),
    avatarUrl: text('avatar_url').notNull(),
    status: userStatus().notNull(),
    birthDate: date('birth_date').notNull(),
    birthPlace: text('birth_place').notNull(),
    address: text(),
    countryId: integer('country_id'),
    subdivisionId: integer('subdivision_id'),
    city: text(),
    zipCode: varchar('zip_code', { length: 10 }),
    gender: profileGenders().notNull(),
    tourManagerName: text('tour_manager_name').notNull(),
    tourManagerSurname: text('tour_manager_surname').notNull(),
    tourManagerEmail: text('tour_manager_email').notNull(),
    tourManagerPhone: text('tour_manager_phone').notNull(),
    company: text(),
    taxCode: text('tax_code'),
    taxCodeFileUrl: text('tax_code_file_url'),
    taxCodeFileName: text('tax_code_file_name'),
    idCardFileUrl: text('id_card_file_url'),
    idCardFileName: text('id_card_file_name'),
    ipiCode: text('ipi_code'),
    bicCode: text('bic_code'),
    abaRoutingNumber: varchar('aba_routing_number', { length: 20 }),
    iban: text(),
    sdiRecipientCode: text('sdi_recipient_code'),
    billingAddress: text('billing_address'),
    billingCountryId: integer('billing_country_id'),
    billingSubdivisionId: integer('billing_subdivision_id'),
    billingCity: text('billing_city'),
    billingZipCode: varchar('billing_zip_code', { length: 10 }),
    billingEmail: text('billing_email'),
    billingPec: text('billing_pec'),
    billingPhone: text('billing_phone'),
    taxableInvoice: boolean('taxable_invoice').default(false).notNull(),
    tiktokUrl: text('tiktok_url'),
    tiktokUsername: text('tiktok_username'),
    tiktokFollowers: integer('tiktok_followers'),
    tiktokCreatedAt: date('tiktok_created_at'),
    facebookUrl: text('facebook_url'),
    facebookUsername: text('facebook_username'),
    facebookFollowers: integer('facebook_followers'),
    facebookCreatedAt: date('facebook_created_at'),
    instagramUrl: text('instagram_url'),
    instagramUsername: text('instagram_username'),
    instagramFollowers: integer('instagram_followers'),
    instagramCreatedAt: date('instagram_created_at'),
    xUrl: text('x_url'),
    xUsername: text('x_username'),
    xFollowers: integer('x_followers'),
    xCreatedAt: date('x_created_at'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    slug: uuid().defaultRandom().notNull(),
  },
  (table) => [
    index('idx_artists_created_at_desc').using(
      'btree',
      table.createdAt.desc().nullsFirst().op('timestamptz_ops'),
    ),
    index('idx_artists_email_trgm').using('gin', table.email.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_artists_name_trgm').using('gin', table.name.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_artists_phone_trgm').using('gin', table.phone.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_artists_stage_name_trgm').using(
      'gin',
      table.stageName.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_artists_surname_trgm').using(
      'gin',
      table.surname.asc().nullsLast().op('gin_trgm_ops'),
    ),
    foreignKey({
      columns: [table.billingCountryId],
      foreignColumns: [countries.id],
      name: 'artists_billing_country_id_fkey',
    })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.billingSubdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'artists_billing_subdivision_id_fkey',
    })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'artists_country_id_fkey',
    })
      .onUpdate('restrict')
      .onDelete('restrict'),
    foreignKey({
      columns: [table.subdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'artists_subdivision_id_fkey',
    })
      .onUpdate('restrict')
      .onDelete('restrict'),
    unique('artists_slug_key').on(table.slug),
  ],
);

export const users = pgTable(
  'users',
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text(),
    emailVerified: boolean('email_verified').notNull(),
    image: text(),
    role: userRoles().default('user').notNull(),
    createdAt: timestamp('created_at', {}).notNull(),
    updatedAt: timestamp('updated_at', {}).notNull(),
    banned: boolean(),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires', {}),
    status: userStatus().default('waiting-for-approval').notNull(),
  },
  (table) => [
    index('idx_users_email_trgm').using('gin', table.email.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_users_role').using('btree', table.role.asc().nullsLast().op('enum_ops')),
    index('idx_users_role_status').using(
      'btree',
      table.role.asc().nullsLast().op('enum_ops'),
      table.status.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_users_status').using('btree', table.status.asc().nullsLast().op('enum_ops')),
    uniqueIndex('users_email_unique').on(table.email).where(sql`${table.email} IS NOT NULL`),
  ],
);

export const subdivisions = pgTable(
  'subdivisions',
  {
    id: serial().primaryKey().notNull(),
    countryId: integer('country_id').notNull(),
    name: varchar({ length: 200 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'subdivisions_country_id_fkey',
    }).onDelete('restrict'),
  ],
);

export const languages = pgTable(
  'languages',
  {
    id: serial().primaryKey().notNull(),
    code: varchar({ length: 2 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique('languages_code_key').on(table.code)],
);

export const countries = pgTable(
  'countries',
  {
    id: serial().primaryKey().notNull(),
    code: varchar({ length: 2 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    isEu: boolean('is_eu').default(false).notNull(),
  },
  (table) => [unique('countries_code_key').on(table.code)],
);

export const profileNotes = pgTable(
  'profile_notes',
  {
    id: serial().primaryKey().notNull(),
    writerId: text('writer_id').notNull(),
    receiverProfileId: integer('receiver_profile_id').notNull(),
    content: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.receiverProfileId],
      foreignColumns: [profiles.id],
      name: 'profile_notes_receiver_profile_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.writerId],
      foreignColumns: [users.id],
      name: 'profile_notes_writer_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const profiles = pgTable(
  'profiles',
  {
    id: serial().primaryKey().notNull(),
    userId: text('user_id').notNull(),
    name: text().notNull(),
    surname: text().notNull(),
    phone: text().notNull(),
    avatarUrl: text('avatar_url'),
    birthDate: date('birth_date'),
    birthPlace: text('birth_place').notNull(),
    address: text().notNull(),
    countryId: integer('country_id'),
    subdivisionId: integer('subdivision_id'),
    city: text().notNull(),
    zipCode: varchar('zip_code', { length: 10 }).notNull(),
    gender: profileGenders(),
    company: text(),
    taxCode: text('tax_code'),
    ipiCode: text('ipi_code'),
    bicCode: text('bic_code'),
    abaRoutingNumber: varchar('aba_routing_number', { length: 20 }),
    iban: text(),
    sdiRecipientCode: text('sdi_recipient_code'),
    billingAddress: text('billing_address'),
    billingCountryId: integer('billing_country_id'),
    billingSubdivisionId: integer('billing_subdivision_id'),
    billingCity: text('billing_city'),
    billingZipCode: varchar('billing_zip_code', { length: 10 }),
    billingEmail: text('billing_email'),
    billingPec: text('billing_pec'),
    billingPhone: text('billing_phone'),
    taxableInvoice: boolean('taxable_invoice').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_profiles_company_trgm').using(
      'gin',
      table.company.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_profiles_created_at_desc').using(
      'btree',
      table.createdAt.desc().nullsFirst().op('timestamptz_ops'),
    ),
    index('idx_profiles_name_trgm').using('gin', table.name.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_profiles_phone_trgm').using('gin', table.phone.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_profiles_surname_trgm').using(
      'gin',
      table.surname.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_profiles_user_id').using('btree', table.userId.asc().nullsLast().op('text_ops')),
    uniqueIndex('uq_profiles_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.billingCountryId],
      foreignColumns: [countries.id],
      name: 'profiles_billing_country_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.billingSubdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'profiles_billing_subdivision_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'profiles_country_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.subdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'profiles_subdivision_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'profiles_user_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const zones = pgTable(
  'zones',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique('zones_name_key').on(table.name)],
);

export const moCoordinators = pgTable('mo_coordinators', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  surname: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const artistNotes = pgTable(
  'artist_notes',
  {
    id: serial().primaryKey().notNull(),
    writerId: text('writer_id').notNull(),
    artistId: integer('artist_id').notNull(),
    content: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'artist_notes_artist_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.writerId],
      foreignColumns: [users.id],
      name: 'artist_notes_writer_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const venues = pgTable(
  'venues',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    bio: text('bio'),
    slug: uuid().defaultRandom().notNull(),
    status: userStatus().notNull(),
    avatarUrl: text('avatar_url'),
    type: venueTypes().notNull(),
    capacity: integer().notNull(),
    address: text().notNull(),
    countryId: integer('country_id').notNull(),
    subdivisionId: integer('subdivision_id').notNull(),
    city: text().notNull(),
    zipCode: varchar('zip_code', { length: 10 }).notNull(),
    managerProfileId: integer('manager_profile_id'),
    company: text().notNull(),
    taxCode: text('tax_code').notNull(),
    vatCode: text('vat_code').notNull(),
    bicCode: text('bic_code'),
    abaRoutingNumber: varchar('aba_routing_number', { length: 20 }),
    sdiRecipientCode: text('sdi_recipient_code'),
    billingAddress: text('billing_address').notNull(),
    billingCountryId: integer('billing_country_id'),
    billingSubdivisionId: integer('billing_subdivision_id'),
    billingCity: text('billing_city').notNull(),
    billingZipCode: varchar('billing_zip_code', { length: 10 }).notNull(),
    billingEmail: text('billing_email'),
    billingPec: text('billing_pec').notNull(),
    billingPhone: text('billing_phone'),
    tiktokUrl: text('tiktok_url'),
    tiktokUsername: text('tiktok_username'),
    tiktokFollowers: integer('tiktok_followers'),
    tiktokCreatedAt: date('tiktok_created_at'),
    facebookUrl: text('facebook_url'),
    facebookUsername: text('facebook_username'),
    facebookFollowers: integer('facebook_followers'),
    facebookCreatedAt: date('facebook_created_at'),
    instagramUrl: text('instagram_url'),
    instagramUsername: text('instagram_username'),
    instagramFollowers: integer('instagram_followers'),
    instagramCreatedAt: date('instagram_created_at'),
    xUrl: text('x_url'),
    xUsername: text('x_username'),
    xFollowers: integer('x_followers'),
    xCreatedAt: date('x_created_at'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_venues_address_trgm').using(
      'gin',
      table.address.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_venues_capacity').using('btree', table.capacity.asc().nullsLast().op('int4_ops')),
    index('idx_venues_company_trgm').using(
      'gin',
      table.company.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_venues_created_at_desc').using(
      'btree',
      table.createdAt.desc().nullsFirst().op('timestamptz_ops'),
    ),
    index('idx_venues_manager_profile_id').using(
      'btree',
      table.managerProfileId.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_venues_name_trgm').using('gin', table.name.asc().nullsLast().op('gin_trgm_ops')),
    index('idx_venues_tax_code_trgm').using(
      'gin',
      table.taxCode.asc().nullsLast().op('gin_trgm_ops'),
    ),
    index('idx_venues_type').using('btree', table.type.asc().nullsLast().op('enum_ops')),
    foreignKey({
      columns: [table.billingCountryId],
      foreignColumns: [countries.id],
      name: 'venues_billing_country_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.billingSubdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'venues_billing_subdivision_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'venues_country_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.managerProfileId],
      foreignColumns: [profiles.id],
      name: 'venues_manager_profile_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.subdivisionId],
      foreignColumns: [subdivisions.id],
      name: 'venues_subdivision_id_fkey',
    }).onDelete('restrict'),
    unique('venues_slug_key').on(table.slug),
  ],
);

export const events = pgTable(
  'events',
  {
    id: serial().primaryKey().notNull(),
    title: text(),
    artistId: integer('artist_id').notNull(),
    artistManagerProfileId: integer('artist_manager_profile_id'),
    availabilityId: integer('availability_id').notNull(),
    venueId: integer('venue_id').notNull(),
    payrollConsultantEmail: text('payroll_consultant_email'),
    moCost: numeric('mo_cost'),
    venueManagerCost: numeric('venue_manager_cost'),
    depositCost: numeric('deposit_cost'),
    depositInvoiceNumber: varchar('deposit_invoice_number', { length: 100 }),
    bookingPercentage: numeric('booking_percentage'),
    moArtistAdvancedExpenses: numeric('mo_artist_advanced_expenses'),
    artistNetCost: numeric('artist_net_cost'),
    artistUpfrontCost: numeric('artist_upfront_cost'),
    totalCost: numeric('total_cost'),
    transportationsCost: numeric('transportations_cost'),
    cashBalanceCost: numeric('cash_balance_cost'),
    hotel: text(),
    hotelCost: numeric('hotel_cost'),
    restaurant: text(),
    restaurantCost: numeric('restaurant_cost'),
    eveningContact: text('evening_contact'),
    moCoordinatorId: integer('mo_coordinator_id'),
    soundCheckStart: time('sound_check_start'),
    soundCheckEnd: time('sound_check_end'),
    tecnicalRiderUrl: text('tecnical_rider_url'),
    tecnicalRiderName: text('tecnical_rider_name'),
    contractSigning: boolean('contract_signing').default(false).notNull(),
    depositInvoiceIssuing: boolean('deposit_invoice_issuing').default(false).notNull(),
    depositReceiptVerification: boolean('deposit_receipt_verification').default(false).notNull(),
    techSheetSubmission: boolean('tech_sheet_submission').default(false).notNull(),
    artistEngagement: boolean('artist_engagement').default(false).notNull(),
    professionalsEngagement: boolean('professionals_engagement').default(false).notNull(),
    accompanyingPersonsEngagement: boolean('accompanying_persons_engagement')
      .default(false)
      .notNull(),
    performance: boolean().default(false).notNull(),
    postDateFeedback: boolean('post_date_feedback').default(false).notNull(),
    bordereau: boolean().default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    tourManagerEmail: text('tour_manager_email'),
    hasConflict: boolean('has_conflict').default(false).notNull(),
    status: eventStatus().default('proposed').notNull(),
    eventType:text('event_type'),
    paymentDate:timestamp('payment_date', { precision: 6, withTimezone: true, mode: 'string' }),
    
    // Payment flow fields
    paymentStatus: paymentStatus('payment_status').default('pending'),
    
    // Upfront payment (50%)
    upfrontPaymentAmount: numeric('upfront_payment_amount'),
    upfrontPaymentMethod: paymentMethod('upfront_payment_method'),
    upfrontPaymentDate: timestamp('upfront_payment_date', { withTimezone: true }),
    upfrontPaymentReference: text('upfront_payment_reference'),
    upfrontPaymentNotes: text('upfront_payment_notes'),
    upfrontPaymentSender: text('upfront_payment_sender'),
    upfrontPaymentStripeId: text('upfront_payment_stripe_id'),
    upfrontInvoiceUrl: text('upfront_invoice_url'),
    upfrontInvoiceName: text('upfront_invoice_name'),
    upfrontConfirmationUrl: text('upfront_confirmation_url'),
    upfrontConfirmationName: text('upfront_confirmation_name'),
    
    // Final balance payment (50%)
    finalBalanceAmount: numeric('final_balance_amount'),
    finalBalanceMethod: paymentMethod('final_balance_method'),
    finalBalanceDate: timestamp('final_balance_date', { withTimezone: true }),
    finalBalanceReference: text('final_balance_reference'),
    finalBalanceNotes: text('final_balance_notes'),
    finalBalanceSender: text('final_balance_sender'),
    finalBalanceStripeId: text('final_balance_stripe_id'),
    finalBalanceDeadline: timestamp('final_balance_deadline', { withTimezone: true }),
    finalInvoiceUrl: text('final_invoice_url'),
    finalInvoiceName: text('final_invoice_name'),
    finalConfirmationUrl: text('final_confirmation_url'),
    finalConfirmationName: text('final_confirmation_name'),
    
    // Payment status timestamps
    paymentPendingAt: timestamp('payment_pending_at', { withTimezone: true }).defaultNow(),
    upfrontRequiredAt: timestamp('upfront_required_at', { withTimezone: true }),
    upfrontPaidAt: timestamp('upfront_paid_at', { withTimezone: true }),
    balanceRequiredAt: timestamp('balance_required_at', { withTimezone: true }),
    balancePaidAt: timestamp('balance_paid_at', { withTimezone: true }),
    fullyPaidAt: timestamp('fully_paid_at', { withTimezone: true }),
    paymentExpiredAt: timestamp('payment_expired_at', { withTimezone: true }),
    
    // Contract tracking
    contractSignedDate: timestamp('contract_signed_date', { withTimezone: true }),
    contractDocumentUrl: text('contract_document_url'),
    
    // Event status timestamps (timeline)
    proposedAt: timestamp('proposed_at', { withTimezone: true }).defaultNow(),
    preConfirmedAt: timestamp('pre_confirmed_at', { withTimezone: true }),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    rejectedAt: timestamp('rejected_at', { withTimezone: true }),
    endedAt: timestamp('ended_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_events_artist_id').using('btree', table.artistId.asc().nullsLast().op('int4_ops')),
    index('idx_events_availability_id').using(
      'btree',
      table.availabilityId.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_events_has_conflict')
      .using(
        'btree',
        table.availabilityId.asc().nullsLast().op('bool_ops'),
        table.hasConflict.asc().nullsLast().op('int4_ops'),
      )
      .where(sql`(has_conflict = true)`),
    index('idx_events_manager_pid').using(
      'btree',
      table.artistManagerProfileId.asc().nullsLast().op('int4_ops'),
    ),
    index('idx_events_status').using('btree', table.status.asc().nullsLast().op('enum_ops')),
    index('idx_events_status_artist_created_desc').using(
      'btree',
      table.status.asc().nullsLast().op('int4_ops'),
      table.artistId.asc().nullsLast().op('timestamptz_ops'),
      table.createdAt.desc().nullsFirst().op('int4_ops'),
    ),
    index('idx_events_status_created_desc').using(
      'btree',
      table.status.asc().nullsLast().op('enum_ops'),
      table.createdAt.desc().nullsFirst().op('timestamptz_ops'),
    ),
    index('idx_events_status_venue_created_desc').using(
      'btree',
      table.status.asc().nullsLast().op('enum_ops'),
      table.venueId.asc().nullsLast().op('int4_ops'),
      table.createdAt.desc().nullsFirst().op('int4_ops'),
    ),
    index('idx_events_venue_id').using('btree', table.venueId.asc().nullsLast().op('int4_ops')),
    uniqueIndex('ux_events_one_confirmed_per_availability')
      .using('btree', table.availabilityId.asc().nullsLast().op('int4_ops'))
      .where(sql`(status = 'confirmed'::event_status)`),
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'fk_events_artist',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.availabilityId],
      foreignColumns: [artistAvailabilities.id],
      name: 'fk_events_availability',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.artistManagerProfileId],
      foreignColumns: [profiles.id],
      name: 'fk_events_manager_profile',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.moCoordinatorId],
      foreignColumns: [moCoordinators.id],
      name: 'fk_events_mo_coordinator',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.venueId],
      foreignColumns: [venues.id],
      name: 'fk_events_venue',
    }).onDelete('restrict'),
    unique('unique_artist_availability_venue').on(
      table.artistId,
      table.availabilityId,
      table.venueId,
    ),
  ],
);

export const contracts = pgTable(
  'contracts',
  {
    id: serial().primaryKey().notNull(),
    eventId: integer('event_id').notNull(),
    status: contractStatus().default('to-sign').notNull(),
    fileUrl: text('file_url'),
    fileName: text('file_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_contracts_status').using('btree', table.status.asc().nullsLast().op('enum_ops')),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: 'contracts_event_id_fkey',
    }).onDelete('cascade'),
    unique('contracts_event_id_key').on(table.eventId),
  ],
);

export const eventNotes = pgTable(
  'event_notes',
  {
    id: serial().primaryKey().notNull(),
    writerId: text('writer_id').notNull(),
    eventId: integer('event_id').notNull(),
    content: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: 'event_notes_event_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.writerId],
      foreignColumns: [users.id],
      name: 'event_notes_writer_id_fkey',
    }).onDelete('cascade'),
  ],
);

export const artistAvailabilities = pgTable(
  'artist_availabilities',
  {
    id: serial().primaryKey().notNull(),
    artistId: integer('artist_id').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    status: availabilityStatus().default('available').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    timeRange: generatedTSTZRangeColumn('time_range', 'start_date', 'end_date', {
      lowerInclusive: true,
      upperInclusive: false,
    }),
  },
  (table) => [
    index('idx_artist_availabilities_time_range_gist').using(
      'gist',
      table.timeRange.asc().nullsLast().op('range_ops'),
    ),
    index('idx_avail_artist_id').using('btree', table.artistId.asc().nullsLast().op('int4_ops')),
    index('idx_avail_status').using('btree', table.status.asc().nullsLast().op('enum_ops')),
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'artist_availabilities_artist_id_fkey',
    }).onDelete('restrict'),
    check('chk_time_range', sql`start_date < end_date`),
  ],
);

export const artistLanguages = pgTable(
  'artist_languages',
  {
    artistId: integer('artist_id').notNull(),
    languageId: integer('language_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'artist_languages_artist_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.languageId],
      foreignColumns: [languages.id],
      name: 'artist_languages_language_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.artistId, table.languageId], name: 'artist_languages_pkey' }),
  ],
);

export const artistZones = pgTable(
  'artist_zones',
  {
    artistId: integer('artist_id').notNull(),
    zoneId: integer('zone_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'artist_zones_artist_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.zoneId],
      foreignColumns: [zones.id],
      name: 'artist_zones_zone_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.artistId, table.zoneId], name: 'artist_zones_pkey' }),
  ],
);

export const managerArtists = pgTable(
  'manager_artists',
  {
    managerProfileId: integer('manager_profile_id').notNull(),
    artistId: integer('artist_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'manager_artists_artist_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.managerProfileId],
      foreignColumns: [profiles.id],
      name: 'manager_artists_manager_profile_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.managerProfileId, table.artistId], name: 'manager_artists_pkey' }),
  ],
);

export const profileLanguages = pgTable(
  'profile_languages',
  {
    profileId: integer('profile_id').notNull(),
    languageId: integer('language_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.languageId],
      foreignColumns: [languages.id],
      name: 'profile_languages_language_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: 'profile_languages_profile_id_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.profileId, table.languageId], name: 'profile_languages_pkey' }),
  ],
);
