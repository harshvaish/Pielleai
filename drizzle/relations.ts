import { relations } from 'drizzle-orm/relations';
import {
  users,
  sessions,
  accounts,
  countries,
  artists,
  subdivisions,
  profiles,
  profileNotes,
  artistNotes,
  venues,
  artistZones,
  zones,
  managerArtists,
  artistLanguages,
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
  profileNotes: many(profileNotes),
  artistNotes: many(artistNotes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const artistsRelations = relations(artists, ({ one, many }) => ({
  country_billingCountryId: one(countries, {
    fields: [artists.billingCountryId],
    references: [countries.id],
    relationName: 'artists_billingCountryId_countries_id',
  }),
  subdivision_billingSubdivisionId: one(subdivisions, {
    fields: [artists.billingSubdivisionId],
    references: [subdivisions.id],
    relationName: 'artists_billingSubdivisionId_subdivisions_id',
  }),
  country_countryId: one(countries, {
    fields: [artists.countryId],
    references: [countries.id],
    relationName: 'artists_countryId_countries_id',
  }),
  subdivision_subdivisionId: one(subdivisions, {
    fields: [artists.subdivisionId],
    references: [subdivisions.id],
    relationName: 'artists_subdivisionId_subdivisions_id',
  }),
  artistNotes: many(artistNotes),
  artistZones: many(artistZones),
  managerArtists: many(managerArtists),
  artistLanguages: many(artistLanguages),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  artists_billingCountryId: many(artists, {
    relationName: 'artists_billingCountryId_countries_id',
  }),
  artists_countryId: many(artists, {
    relationName: 'artists_countryId_countries_id',
  }),
  subdivisions: many(subdivisions),
  profiles_billingCountryId: many(profiles, {
    relationName: 'profiles_billingCountryId_countries_id',
  }),
  profiles_countryId: many(profiles, {
    relationName: 'profiles_countryId_countries_id',
  }),
  venues_billingCountryId: many(venues, {
    relationName: 'venues_billingCountryId_countries_id',
  }),
  venues_countryId: many(venues, {
    relationName: 'venues_countryId_countries_id',
  }),
}));

export const subdivisionsRelations = relations(
  subdivisions,
  ({ one, many }) => ({
    artists_billingSubdivisionId: many(artists, {
      relationName: 'artists_billingSubdivisionId_subdivisions_id',
    }),
    artists_subdivisionId: many(artists, {
      relationName: 'artists_subdivisionId_subdivisions_id',
    }),
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
    venues_billingSubdivisionId: many(venues, {
      relationName: 'venues_billingSubdivisionId_subdivisions_id',
    }),
    venues_subdivisionId: many(venues, {
      relationName: 'venues_subdivisionId_subdivisions_id',
    }),
  })
);

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
  profileNotes: many(profileNotes),
  venues: many(venues),
  managerArtists: many(managerArtists),
  profileLanguages: many(profileLanguages),
}));

export const profileNotesRelations = relations(profileNotes, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileNotes.receiverProfileId],
    references: [profiles.id],
  }),
  user: one(users, {
    fields: [profileNotes.writerId],
    references: [users.id],
  }),
}));

export const artistNotesRelations = relations(artistNotes, ({ one }) => ({
  artist: one(artists, {
    fields: [artistNotes.artistId],
    references: [artists.id],
  }),
  user: one(users, {
    fields: [artistNotes.writerId],
    references: [users.id],
  }),
}));

export const venuesRelations = relations(venues, ({ one }) => ({
  country_billingCountryId: one(countries, {
    fields: [venues.billingCountryId],
    references: [countries.id],
    relationName: 'venues_billingCountryId_countries_id',
  }),
  subdivision_billingSubdivisionId: one(subdivisions, {
    fields: [venues.billingSubdivisionId],
    references: [subdivisions.id],
    relationName: 'venues_billingSubdivisionId_subdivisions_id',
  }),
  country_countryId: one(countries, {
    fields: [venues.countryId],
    references: [countries.id],
    relationName: 'venues_countryId_countries_id',
  }),
  profile: one(profiles, {
    fields: [venues.managerProfileId],
    references: [profiles.id],
  }),
  subdivision_subdivisionId: one(subdivisions, {
    fields: [venues.subdivisionId],
    references: [subdivisions.id],
    relationName: 'venues_subdivisionId_subdivisions_id',
  }),
}));

export const artistZonesRelations = relations(artistZones, ({ one }) => ({
  artist: one(artists, {
    fields: [artistZones.artistId],
    references: [artists.id],
  }),
  zone: one(zones, {
    fields: [artistZones.zoneId],
    references: [zones.id],
  }),
}));

export const zonesRelations = relations(zones, ({ many }) => ({
  artistZones: many(artistZones),
}));

export const managerArtistsRelations = relations(managerArtists, ({ one }) => ({
  artist: one(artists, {
    fields: [managerArtists.artistId],
    references: [artists.id],
  }),
  profile: one(profiles, {
    fields: [managerArtists.managerProfileId],
    references: [profiles.id],
  }),
}));

export const artistLanguagesRelations = relations(
  artistLanguages,
  ({ one }) => ({
    artist: one(artists, {
      fields: [artistLanguages.artistId],
      references: [artists.id],
    }),
    language: one(languages, {
      fields: [artistLanguages.languageId],
      references: [languages.id],
    }),
  })
);

export const languagesRelations = relations(languages, ({ many }) => ({
  artistLanguages: many(artistLanguages),
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
