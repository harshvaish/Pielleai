import {
  pgTable,
  text,
  timestamp,
  foreignKey,
  unique,
  boolean,
  serial,
  varchar,
  integer,
  date,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender_enum', [
  'maschile',
  'femminile',
  'non-binary',
]);

export const userStatus = pgEnum('user_status', [
  'active',
  'waiting-for-approval',
  'disabled',
  'banned',
]);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role'),
  status: userStatus().default('waiting-for-approval').notNull(),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const countries = pgTable(
  'countries',
  {
    id: serial().primaryKey().notNull(),
    code: varchar({ length: 2 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [unique('countries_code_key').on(table.code)]
);

export const subdivisions = pgTable(
  'subdivisions',
  {
    id: serial().primaryKey().notNull(),
    countryId: integer('country_id').notNull(),
    name: varchar({ length: 200 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.countryId],
      foreignColumns: [countries.id],
      name: 'subdivisions_country_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ]
);

export const languages = pgTable(
  'languages',
  {
    id: serial().primaryKey().notNull(),
    code: varchar({ length: 2 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [unique('languages_code_key').on(table.code)]
);

export const profiles = pgTable(
  'profiles',
  {
    id: serial().primaryKey().notNull(),
    userId: text('user_id').notNull(),
    name: text().notNull(),
    surname: text().notNull(),
    phone: text().notNull(),
    avatarUrl: text('avatar_url').notNull(),
    birthDate: date('birth_date').notNull(),
    birthPlace: text('birth_place').notNull(),
    address: text().notNull(),
    countryId: integer('country_id').notNull(),
    subdivisionId: integer('subdivision_id').notNull(),
    city: text().notNull(),
    zipCode: varchar('zip_code', { length: 10 }).notNull(),
    gender: genderEnum().notNull(),
    company: text().notNull(),
    taxCode: text('tax_code').notNull(),
    ipiCode: text('ipi_code').notNull(),
    bicCode: text('bic_code').notNull(),
    abaRoutingNumber: varchar('aba_routing_number', { length: 20 }).notNull(),
    iban: text().notNull(),
    sdiRecipientCode: text('sdi_recipient_code').notNull(),
    billingAddress: text('billing_address').notNull(),
    billingCountryId: integer('billing_country_id').notNull(),
    billingSubdivisionId: integer('billing_subdivision_id').notNull(),
    billingCity: text('billing_city').notNull(),
    billingZipCode: varchar('billing_zip_code', { length: 10 }).notNull(),
    billingEmail: text('billing_email').notNull(),
    billingPec: text('billing_pec').notNull(),
    billingPhone: text('billing_phone').notNull(),
    taxableInvoice: boolean('taxable_invoice').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
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
  ]
);

export const profileNotes = pgTable(
  'profile_notes',
  {
    id: serial().primaryKey().notNull(),
    writerId: text('writer_id').notNull(),
    receiverProfileId: integer('receiver_profile_id').notNull(),
    content: text().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.receiverProfileId],
      foreignColumns: [profiles.id],
      name: 'profile_notes_receiver_profile_id_fkey',
    }),
    foreignKey({
      columns: [table.writerId],
      foreignColumns: [users.id],
      name: 'profile_notes_writer_id_fkey',
    }),
  ]
);

export const profileLanguages = pgTable(
  'profile_languages',
  {
    profileId: integer('profile_id').notNull(),
    languageId: integer('language_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.languageId],
      foreignColumns: [languages.id],
      name: 'profile_languages_language_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: 'profile_languages_profile_id_fkey',
    }).onDelete('cascade'),
    primaryKey({
      columns: [table.profileId, table.languageId],
      name: 'profile_languages_pkey',
    }),
  ]
);
