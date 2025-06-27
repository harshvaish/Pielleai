'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ServerActionResponse } from '@/lib/types';
import {
  ArtistsManagerFormData,
  createArtistsManagerFullFormSchema,
} from '@/lib/validation/createArtistsManagerFormSchema';
import { database } from '@/lib/database/connection';
import { profileLanguages, profiles } from '@/lib/database/schema';

export const createArtistsManager = async (
  data: ArtistsManagerFormData
): Promise<ServerActionResponse<null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[signIn] - Error: unauthorized', session);
      return {
        success: false,
        message: 'Non sei autorizzato.',
        data: null,
      };
    }
  } catch (error) {
    console.error('[signIn] - Error: ', error);
    return {
      success: false,
      message: 'Autenticazione non riutita.',
      data: null,
    };
  }

  const validation = createArtistsManagerFullFormSchema.safeParse(data);

  if (!validation.success) {
    console.error('[signIn] - Error: validation failed');
    return {
      success: true,
      message: 'I dati inviati non sono corretti.',
      data: null,
    };
  }

  const { name, signUpEmail, signUpPassword } = data;

  let newUserId: string | undefined;

  try {
    await database.transaction(async (tx) => {
      const { user } = await auth.api.createUser({
        headers: await headers(),
        body: {
          email: signUpEmail,
          password: signUpPassword,
          name,
          role: 'artist-manager',
        },
      });

      if (!user || !user.id) {
        return {
          success: false,
          message: "Errore durante la creazione dell'account.",
          data: null,
        };
      }

      newUserId = user.id;

      const profileResult = await tx
        .insert(profiles)
        .values({
          userId: newUserId,
          avatarUrl: data.avatarUrl,
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          birthDate: data.birthDate,
          birthPlace: data.birthPlace,
          gender: data.gender,
          // languages: data.languages,
          address: data.address,
          countryId: data.countryId,
          subdivisionId: data.subdivisionId,
          city: data.city,
          zipCode: data.zipCode,

          company: data.company,
          taxCode: data.taxCode,
          ipiCode: data.ipiCode,
          bicCode: data.bicCode,
          abaRoutingNumber: data.abaRoutingNumber,
          iban: data.iban,
          sdiRecipientCode: data.sdiRecipientCode,
          billingAddress: data.billingAddress,
          billingCountryId: data.billingCountryId,
          billingSubdivisionId: data.billingSubdivisionId,
          billingCity: data.billingCity,
          billingZipCode: data.billingZipCode,
          billingEmail: data.billingEmail,
          billingPhone: data.billingPhone,
          billingPec: data.billingPec,
          taxableInvoice: data.taxableInvoice === 'true',
        })
        .returning({ id: profiles.id });

      const profileId = profileResult[0]?.id;
      if (!profileId) {
        return {
          success: false,
          message: 'Recupero id utente non riuscito.',
          data: null,
        };
      }

      // Insert profile-language relationships
      const languageInserts = (data.languages || []).map(
        (languageId: number) => ({
          profileId,
          languageId,
        })
      );

      if (languageInserts.length > 0) {
        await tx.insert(profileLanguages).values(languageInserts);
      }
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    if (newUserId) {
      try {
        await auth.api.removeUser({
          headers: await headers(),
          body: { userId: newUserId },
        });
      } catch (delErr) {
        console.error(
          '[createArtistsManager] rollback: failed deleting auth user',
          delErr
        );
      }
    }

    console.error('[createArtistsManager] transaction failed', error);
    return {
      success: false,
      message: "Errore durante la creazione dell'account.",
      data: null,
    };
  }
};
