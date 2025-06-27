import { relations } from 'drizzle-orm/relations';
import {
  users,
  sessions,
  accounts,
  countries,
  subdivisions,
  profiles,
  languages,
  profileLanguages,
} from './schema';

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  profiles: many(profiles),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const subdivisionsRelations = relations(
  subdivisions,
  ({ one, many }) => ({
    country: one(countries, {
      fields: [subdivisions.countryId],
      references: [countries.id],
    }),
    profiles_billingSubdivisionId: many(profiles, {
      relationName: 'profiles_billingSubdivisionId_subdivisions_id',
    }),
    profiles_subdivisionId: many(profiles, {
      relationName: 'profiles_subdivisionId_subdivisions_id',
    }),
  })
);

export const countriesRelations = relations(countries, ({ many }) => ({
  subdivisions: many(subdivisions),
  profiles_billingCountryId: many(profiles, {
    relationName: 'profiles_billingCountryId_countries_id',
  }),
  profiles_countryId: many(profiles, {
    relationName: 'profiles_countryId_countries_id',
  }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  country_billingCountryId: one(countries, {
    fields: [profiles.billingCountryId],
    references: [countries.id],
    relationName: 'profiles_billingCountryId_countries_id',
  }),
  subdivision_billingSubdivisionId: one(subdivisions, {
    fields: [profiles.billingSubdivisionId],
    references: [subdivisions.id],
    relationName: 'profiles_billingSubdivisionId_subdivisions_id',
  }),
  country_countryId: one(countries, {
    fields: [profiles.countryId],
    references: [countries.id],
    relationName: 'profiles_countryId_countries_id',
  }),
  subdivision_subdivisionId: one(subdivisions, {
    fields: [profiles.subdivisionId],
    references: [subdivisions.id],
    relationName: 'profiles_subdivisionId_subdivisions_id',
  }),
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  profileLanguages: many(profileLanguages),
}));

export const profileLanguagesRelations = relations(
  profileLanguages,
  ({ one }) => ({
    language: one(languages, {
      fields: [profileLanguages.languageId],
      references: [languages.id],
    }),
    profile: one(profiles, {
      fields: [profileLanguages.profileId],
      references: [profiles.id],
    }),
  })
);

export const languagesRelations = relations(languages, ({ many }) => ({
  profileLanguages: many(profileLanguages),
}));
