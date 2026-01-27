'use server';

import { database } from '@/lib/database/connection';
import { professionals } from '@/lib/database/schema';
import { ServerActionResponse, Professional } from '@/lib/types';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { updateProfessionalSchema } from '@/lib/validation/professional-schema';
import { AppError } from '@/lib/classes/AppError';
import { eq } from 'drizzle-orm';

export async function updateProfessional(
  input: {
    professionalId: number;
    fullName: string;
    role: Professional['role'];
    roleDescription?: string | null;
    email?: string | null;
    phone?: string | null;
    competencies?: string | null;
  },
): Promise<ServerActionResponse<Professional>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['admin'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = updateProfessionalSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const data = validation.data;

    const [updated] = await database
      .update(professionals)
      .set({
        fullName: data.fullName.trim(),
        role: data.role,
        roleDescription: data.roleDescription?.trim() || null,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        competencies: data.competencies?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(professionals.id, data.professionalId))
      .returning({
        id: professionals.id,
        fullName: professionals.fullName,
        role: professionals.role,
        roleDescription: professionals.roleDescription,
        email: professionals.email,
        phone: professionals.phone,
        competencies: professionals.competencies,
        createdAt: professionals.createdAt,
        updatedAt: professionals.updatedAt,
      });

    if (!updated) {
      throw new AppError('Professionista non trovato.');
    }

    return { success: true, message: null, data: updated as Professional };
  } catch (error) {
    console.error('[updateProfessional] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento professionista non riuscito.',
      data: null,
    };
  }
}
