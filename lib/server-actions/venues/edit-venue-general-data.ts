'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { and, eq } from 'drizzle-orm';
import {
  profiles,
  countries,
  subdivisions,
  users,
  venues,
} from '@/lib/database/schema';
import {
  editVenueS1FormSchema,
  EditVenueS1FormSchema,
} from '@/lib/validation/venueFormSchema';

export const editVenueGeneralData = async ({
  venueId,
  data,
}: {
  venueId: number;
  data: EditVenueS1FormSchema;
}): Promise<ServerActionResponse<null>> => {
  const headersList = await headers();
  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[editVenueGeneralData] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[editVenueGeneralData] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = editVenueS1FormSchema.safeParse(data);

  if (!validation.success) {
    console.error(
      '[editVenueGeneralData] - Error: validation failed',
      validation.error.issues[0]
    );
    return {
      success: false,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { countryId, subdivisionId, venueManagerId } = validation.data;

  try {
    const [countryCheck, subdivisionCheck, venueManagerCheck] =
      await Promise.all([
        database
          .select({ id: countries.id })
          .from(countries)
          .where(eq(countries.id, countryId)),

        database
          .select({ id: subdivisions.id, countryId: subdivisions.countryId })
          .from(subdivisions)
          .where(eq(subdivisions.id, subdivisionId)),

        database
          .select({ id: profiles.id })
          .from(profiles)
          .innerJoin(users, eq(profiles.userId, users.id))
          .where(
            and(
              eq(users.role, 'venue-manager'),
              eq(profiles.id, venueManagerId)
            )
          ),
      ]);

    if (countryCheck.length !== 1) {
      return {
        success: false,
        message: 'Stato selezionato non valido.',
        data: null,
      };
    }

    if (subdivisionCheck.length !== 1) {
      return {
        success: false,
        message: 'Provincia selezionata non valida.',
        data: null,
      };
    }

    if (subdivisionCheck[0].countryId != countryId) {
      return {
        success: false,
        message: 'La provincia selezionata non appartiene allo stato indicato.',
        data: null,
      };
    }

    if (venueManagerCheck.length !== 1) {
      return {
        success: false,
        message: 'Manager selezionato non valido.',
        data: null,
      };
    }

    await database
      .update(venues)
      .set({
        avatarUrl: validation.data.avatarUrl,
        name: validation.data.name,
        type: validation.data.type,
        capacity: validation.data.capacity,
        address: validation.data.address,
        countryId: validation.data.countryId,
        subdivisionId: validation.data.subdivisionId,
        city: validation.data.city,
        zipCode: validation.data.zipCode,
        managerProfileId: venueManagerId,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[editVenueGeneralData] update failed', error);
    return {
      success: false,
      message: 'Aggiornamento dati generali locale non riuscito.',
      data: null,
    };
  }
};
