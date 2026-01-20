'use server';

import { ServerActionResponse, VenueSelectData, VenueManagerSelectData } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import type { VenueFormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export const createVenue = async (
  data: VenueFormSchema,
): Promise<ServerActionResponse<VenueSelectData>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[createVenue] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['admin', 'venue-manager'])) {
      console.error('[createVenue] - Error: role', session);
      throw new AppError('Non sei autorizzato.');
    }
    const isAdmin = user.role === 'admin';

    const { countryId, subdivisionId, venueManagerId, billingCountry, billingSubdivisionId } = data;
    const fallbackName = data.name?.trim() || 'Locale';
    const fallbackType = data.type || 'small';
    const fallbackCapacity = data.capacity ?? 0;
    const billingCountryId = billingCountry?.id;

    const [countryCheck, subdivisionCheck] = await Promise.all([
      countryId !== undefined && countryId !== null
        ? database
            .select({ id: countries.id })
            .from(countries)
            .where(eq(countries.id, countryId))
        : Promise.resolve([]),

      subdivisionId !== undefined && subdivisionId !== null
        ? database
            .select({ id: subdivisions.id, countryId: subdivisions.countryId })
            .from(subdivisions)
            .where(eq(subdivisions.id, subdivisionId))
        : Promise.resolve([]),
    ]);

    if (countryId !== undefined && countryId !== null && countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionId !== undefined && subdivisionId !== null && subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (countryId !== undefined && countryId !== null && subdivisionId !== undefined && subdivisionId !== null) {
      if (subdivisionCheck[0]?.countryId != countryId) {
        throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
      }
    }

    if (billingCountryId !== undefined && billingCountryId !== null) {
      const billingCountryCheck = await database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountryId));

      if (billingCountryCheck.length !== 1) {
        throw new AppError('Nazione selezionata non valida.');
      }
    }

    if (billingSubdivisionId !== undefined && billingSubdivisionId !== null) {
      const billingSubdivisionCheck = await database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, billingSubdivisionId));

      if (billingSubdivisionCheck.length !== 1) {
        throw new AppError('Provincia di fatturazione selezionata non valida.');
      }

      if (billingCountryId !== undefined && billingCountryId !== null && billingSubdivisionCheck[0].countryId != billingCountryId) {
        throw new AppError('La provincia di fatturazione non appartiene alla nazione selezionata.');
      }
    }

    if (venueManagerId) {
      const venueManagerCheck = await database
        .select({ id: users.id })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(and(eq(users.role, 'venue-manager'), eq(profiles.id, venueManagerId)));

      if (venueManagerCheck.length !== 1) {
        throw new AppError('Manager selezionato non valido.');
      }

      if (!isAdmin && venueManagerCheck[0].id != user.id) {
        console.error('[createVenue] - Error: venueManagerId is not the current user', session);
        throw new AppError('Non è possibile selezionare un promoter diverso da te.');
      }
    }

    const insertValues: any = {
      status: 'active',
      avatarUrl: data.avatarUrl || null,
      name: data.name || fallbackName,
      bio: data.bio || null,
      type: fallbackType,
      capacity: fallbackCapacity,
      managerProfileId: data.venueManagerId || null,

      address: data.address || '',
      city: data.city || '',
      zipCode: data.zipCode || '',

      company: data.company || '',
      taxCode: data.taxCode || '',
      vatCode: data.vatCode || '',
      bicCode: data.bicCode || null,
      abaRoutingNumber: data.abaRoutingNumber || null,
      sdiRecipientCode: data.sdiRecipientCode || null,
      billingAddress: data.billingAddress || '',
      billingCity: data.billingCity || '',
      billingZipCode: data.billingZipCode || '',
      billingEmail: data.billingEmail || null,
      billingPhone: data.billingPhone || null,
      billingPec: data.billingPec || '',

      tiktokUrl: data.tiktokUrl || null,
      tiktokUsername: data.tiktokUsername || null,
      tiktokFollowers: data.tiktokFollowers || null,
      tiktokCreatedAt: data.tiktokCreatedAt || null,

      facebookUrl: data.facebookUrl || null,
      facebookUsername: data.facebookUsername || null,
      facebookFollowers: data.facebookFollowers || null,
      facebookCreatedAt: data.facebookCreatedAt || null,

      instagramUrl: data.instagramUrl || null,
      instagramUsername: data.instagramUsername || null,
      instagramFollowers: data.instagramFollowers || null,
      instagramCreatedAt: data.instagramCreatedAt || null,

      xUrl: data.xUrl || null,
      xUsername: data.xUsername || null,
      xFollowers: data.xFollowers || null,
      xCreatedAt: data.xCreatedAt || null,
    };

    if (countryId !== undefined && countryId !== null) {
      insertValues.countryId = countryId;
    }

    if (subdivisionId !== undefined && subdivisionId !== null) {
      insertValues.subdivisionId = subdivisionId;
    }

    if (billingCountryId !== undefined && billingCountryId !== null) {
      insertValues.billingCountryId = billingCountryId;
    }

    if (billingSubdivisionId !== undefined && billingSubdivisionId !== null) {
      insertValues.billingSubdivisionId = billingSubdivisionId;
    }

    const venueResult = await database
      .insert(venues)
      .values(insertValues)
      .returning({ id: venues.id, slug: venues.slug });

    const slug = venueResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`, 'max');
    revalidateTag('venues', 'max');

    const venueId = venueResult[0]?.id;
    if (!venueId) {
      throw new AppError('Recupero id locale non riuscito.');
    }

    let manager: VenueManagerSelectData | null = null;
    if (venueManagerId) {
      const managerResult = await database
        .select({
          id: users.id,
          profileId: profiles.id,
          avatarUrl: profiles.avatarUrl,
          name: profiles.name,
          surname: profiles.surname,
          status: users.status,
        })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(eq(profiles.id, venueManagerId));

      manager = managerResult[0] ?? null;
    }

    return {
      success: true,
      message: null,
      data: {
        id: venueId,
        slug: slug ?? '',
        status: 'active',
        avatarUrl: insertValues.avatarUrl ?? null,
        name: insertValues.name ?? '',
        address: insertValues.address ?? '',
        manager,
        company: insertValues.company ?? '',
        vatCode: insertValues.vatCode ?? '',
      },
    };
  } catch (error) {
    console.error('[createVenue] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione locale non riuscita.',
      data: null,
    };
  }
};
