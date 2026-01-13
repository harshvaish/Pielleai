'use server';

import { ServerActionResponse, VenueSelectData, VenueManagerSelectData } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import { profiles, countries, subdivisions, users, venues } from '@/lib/database/schema';
import { venueFormSchema, VenueFormSchema } from '@/lib/validation/venue-form-schema';
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

    const sanitizeText = (value?: string | null) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const validation = venueFormSchema.safeParse({
      ...data,
      name: sanitizeText(data.name),
      address: sanitizeText(data.address),
      city: sanitizeText(data.city),
      company: sanitizeText(data.company),
      taxCode: sanitizeText(data.taxCode),
      vatCode: sanitizeText(data.vatCode),
      sdiRecipientCode: sanitizeText(data.sdiRecipientCode),
      billingAddress: sanitizeText(data.billingAddress),
      billingCity: sanitizeText(data.billingCity),
      billingZipCode: sanitizeText(data.billingZipCode),
      billingEmail: sanitizeText(data.billingEmail),
      billingPhone: sanitizeText(data.billingPhone),
      billingPec: sanitizeText(data.billingPec),
    });

    if (!validation.success) {
      console.error('[createVenue] - Error: validation failed', validation.error.issues[0]);
      const issue = validation.error.issues[0];
      const message = issue?.message || 'I dati inviati non sono corretti.';
      throw new AppError(message);
    }

    const { countryId, subdivisionId, venueManagerId, billingCountry, billingSubdivisionId } =
      validation.data;
    const fallbackName = validation.data.name?.trim() || 'Locale';
    const fallbackType = validation.data.type || 'small';
    const fallbackCapacity = validation.data.capacity ?? 0;
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
      avatarUrl: validation.data.avatarUrl || null,
      name: validation.data.name || fallbackName,
      bio: validation.data.bio || null,
      type: fallbackType,
      capacity: fallbackCapacity,
      managerProfileId: validation.data.venueManagerId || null,

      address: validation.data.address || '',
      city: validation.data.city || '',
      zipCode: validation.data.zipCode || '',

      company: validation.data.company || '',
      taxCode: validation.data.taxCode || '',
      vatCode: validation.data.vatCode || '',
      bicCode: validation.data.bicCode || null,
      abaRoutingNumber: validation.data.abaRoutingNumber || null,
      sdiRecipientCode: validation.data.sdiRecipientCode || null,
      billingAddress: validation.data.billingAddress || '',
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
