'use server';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import { venueFormSchema, VenueFormSchema } from '@/lib/validation/venue-form-schema';
import { AppError } from '@/lib/classes/AppError';
import { revalidateTag } from 'next/cache';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';

export const createVenue = async (data: VenueFormSchema): Promise<ServerActionResponse<null>> => {
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

    const validation = venueFormSchema.safeParse(data);

    if (!validation.success) {
      console.error('[createVenue] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('I dati inviati non sono corretti.');
    }

    const { countryId, subdivisionId, venueManagerId, billingCountry, billingSubdivisionId } =
      validation.data;
    const fallbackName = validation.data.name?.trim() || 'Locale';
    const fallbackType = validation.data.type || 'small';
    const fallbackCapacity = validation.data.capacity ?? 0;

    const defaultCountry = await database.select({ id: countries.id }).from(countries).limit(1);
    const defaultCountryId = defaultCountry[0]?.id;
    if (!defaultCountryId) {
      throw new AppError('Nessuna nazione disponibile.');
    }

    const getDefaultSubdivisionId = async (resolvedCountryId: number) => {
      const rows = await database
        .select({ id: subdivisions.id })
        .from(subdivisions)
        .where(eq(subdivisions.countryId, resolvedCountryId))
        .limit(1);
      const id = rows[0]?.id;
      if (!id) {
        throw new AppError('Nessuna provincia disponibile.');
      }
      return id;
    };

    const resolvedCountryId = countryId ?? defaultCountryId;
    const resolvedSubdivisionId =
      subdivisionId ?? (await getDefaultSubdivisionId(resolvedCountryId));
    const billingCountryId = billingCountry?.id ?? null;
    const resolvedBillingSubdivisionId = billingSubdivisionId ?? null;

    const [countryCheck, subdivisionCheck] = await Promise.all([
      database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, resolvedCountryId)),

      database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, resolvedSubdivisionId)),
    ]);

    if (countryCheck.length !== 1) {
      throw new AppError('Stato selezionato non valido.');
    }

    if (subdivisionCheck.length !== 1) {
      throw new AppError('Provincia selezionata non valida.');
    }

    if (subdivisionCheck[0].countryId != resolvedCountryId) {
      throw new AppError('La provincia selezionata non appartiene allo stato indicato.');
    }

    if (billingCountryId !== null) {
      const billingCountryCheck = await database
        .select({ id: countries.id })
        .from(countries)
        .where(eq(countries.id, billingCountryId));

      if (billingCountryCheck.length !== 1) {
        throw new AppError('Nazione selezionata non valida.');
      }
    }

    if (resolvedBillingSubdivisionId !== null) {
      const billingSubdivisionCheck = await database
        .select({ id: subdivisions.id, countryId: subdivisions.countryId })
        .from(subdivisions)
        .where(eq(subdivisions.id, resolvedBillingSubdivisionId));

      if (billingSubdivisionCheck.length !== 1) {
        throw new AppError('Provincia di fatturazione selezionata non valida.');
      }

      if (billingCountryId !== null && billingSubdivisionCheck[0].countryId != billingCountryId) {
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

    const venueResult = await database
      .insert(venues)
      .values({
        status: 'active',
        avatarUrl: validation.data.avatarUrl || null,
        name: validation.data.name || fallbackName,
        bio: validation.data.bio || null,
        type: fallbackType,
        capacity: fallbackCapacity,
        managerProfileId: validation.data.venueManagerId || null,

        address: validation.data.address || '',
        countryId: resolvedCountryId,
        subdivisionId: resolvedSubdivisionId,
        city: validation.data.city || '',
        zipCode: validation.data.zipCode || '',

        company: validation.data.company || '',
        taxCode: validation.data.taxCode || '',
        vatCode: validation.data.vatCode || '',
        bicCode: validation.data.bicCode || null,
        abaRoutingNumber: validation.data.abaRoutingNumber || null,
        sdiRecipientCode: validation.data.sdiRecipientCode || null,
        billingAddress: validation.data.billingAddress || '',
        billingCountryId: billingCountryId,
        billingSubdivisionId: resolvedBillingSubdivisionId,
        billingCity: validation.data.billingCity || '',
        billingZipCode: validation.data.billingZipCode || '',
        billingEmail: validation.data.billingEmail || null,
        billingPhone: validation.data.billingPhone || null,
        billingPec: validation.data.billingPec || '',

        tiktokUrl: validation.data.tiktokUrl || null,
        tiktokUsername: validation.data.tiktokUsername || null,
        tiktokFollowers: validation.data.tiktokFollowers || null,
        tiktokCreatedAt: validation.data.tiktokCreatedAt || null,

        facebookUrl: validation.data.facebookUrl || null,
        facebookUsername: validation.data.facebookUsername || null,
        facebookFollowers: validation.data.facebookFollowers || null,
        facebookCreatedAt: validation.data.facebookCreatedAt || null,

        instagramUrl: validation.data.instagramUrl || null,
        instagramUsername: validation.data.instagramUsername || null,
        instagramFollowers: validation.data.instagramFollowers || null,
        instagramCreatedAt: validation.data.instagramCreatedAt || null,

        xUrl: validation.data.xUrl || null,
        xUsername: validation.data.xUsername || null,
        xFollowers: validation.data.xFollowers || null,
        xCreatedAt: validation.data.xCreatedAt || null,
      })
      .returning({ slug: venues.slug });

    const slug = venueResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`, 'max');
    revalidateTag('venues', 'max');

    return {
      success: true,
      message: null,
      data: null,
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
