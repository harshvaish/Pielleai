'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, count, eq, inArray } from 'drizzle-orm';
import {
  profiles,
  countries,
  languages as languagesTable,
  subdivisions,
  zones as zonesTable,
  users,
  artists,
  artistLanguages,
  managerArtists,
  artistZones,
  artistAvailabilities,
} from '@/lib/database/schema';
import {
  eventFormSchema,
  EventFormSchema,
} from '@/lib/validation/eventFormSchema';

export const createEvent = async (
  data: EventFormSchema
): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[createEvent] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[createEvent] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = eventFormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[createEvent] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { artistId, artistManagerId, availabilityId } = validation.data;

  try {
    const [artistCheck, managerCheck, availabilityCheck] = await Promise.all([
      database
        .select({ count: count() })
        .from(artists)
        .where(eq(artists.id, artistId))
        .limit(1),

      database
        .select({ count: count() })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(
          and(
            eq(profiles.id, artistManagerId),
            eq(users.role, 'artist-manager')
          )
        )
        .limit(1),

      database
        .select({ count: count() })
        .from(artistAvailabilities)
        .where(
          and(
            eq(artistAvailabilities.id, availabilityId),
            eq(artistAvailabilities.status, 'available')
          )
        )
        .limit(1),
    ]);

    if (artistCheck[0].count === 0) {
      return {
        success: false,
        message: 'Artista selezionato non valido.',
        data: null,
      };
    }

    if (managerCheck[0].count === 0) {
      return {
        success: false,
        message: 'Manager artista selezionato non valido.',
        data: null,
      };
    }

    if (availabilityCheck[0].count === 0) {
      return {
        success: false,
        message: 'Disponibilità selezionata non valida.',
        data: null,
      };
    }

    await database.transaction(async (tx) => {
      const eventResult = await tx
        .insert(events)
        .values({
          status: validation.data.status,

          avatarUrl: validation.data.avatarUrl,
          name: validation.data.name,
          surname: validation.data.surname,
          stageName: validation.data.stageName,
          email: validation.data.email,
          phone: validation.data.phone,
          birthDate: validation.data.birthDate,
          birthPlace: validation.data.birthPlace,
          gender: validation.data.gender,
          address: validation.data.address,
          countryId: validation.data.countryId,
          subdivisionId: validation.data.subdivisionId,
          city: validation.data.city,
          zipCode: validation.data.zipCode,
          tourManagerName: validation.data.tourManagerName,
          tourManagerSurname: validation.data.tourManagerSurname,
          tourManagerEmail: validation.data.tourManagerEmail,
          tourManagerPhone: validation.data.tourManagerPhone,

          company: validation.data.company,
          taxCode: validation.data.taxCode,
          ipiCode: validation.data.ipiCode,
          bicCode: validation.data.bicCode,
          abaRoutingNumber: validation.data.abaRoutingNumber,
          iban: validation.data.iban,
          sdiRecipientCode: validation.data.sdiRecipientCode,
          billingAddress: validation.data.billingAddress,
          billingCountryId: validation.data.billingCountry.id,
          billingSubdivisionId: validation.data.billingSubdivisionId,
          billingCity: validation.data.billingCity,
          billingZipCode: validation.data.billingZipCode,
          billingEmail: validation.data.billingEmail,
          billingPhone: validation.data.billingPhone,
          billingPec: validation.data.billingPec,
          taxableInvoice: validation.data.taxableInvoice === 'true',

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
        .returning({ id: artists.id });

      const newArtistId = artistResult[0]?.id;
      if (!newArtistId) {
        return {
          success: false,
          message: 'Recupero id artista non riuscito.',
          data: null,
        };
      }

      const languageInserts = (data.languages || []).map(
        (languageId: number) => ({
          artistId: newArtistId,
          languageId,
        })
      );

      if (languageInserts.length > 0) {
        await tx.insert(artistLanguages).values(languageInserts);
      }

      const managerArtistsInserts = (data.artistManagers || []).map(
        (artistManagerId: number) => ({
          managerProfileId: artistManagerId,
          artistId: newArtistId,
        })
      );

      if (managerArtistsInserts.length > 0) {
        await tx.insert(managerArtists).values(managerArtistsInserts);
      }

      const artistZonesInserts = (data.zones || []).map((zoneId: number) => ({
        artistId: newArtistId,
        zoneId: zoneId,
      }));

      if (artistZonesInserts.length > 0) {
        await tx.insert(artistZones).values(artistZonesInserts);
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[createEvent] transaction failed', error);
    return {
      success: false,
      message: 'Creazione artista non riuscita.',
      data: null,
    };
  }
};
