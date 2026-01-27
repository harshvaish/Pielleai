'use server';

import { database } from '@/lib/database/connection';
import { professionals } from '@/lib/database/schema';
import { ServerActionResponse, Professional } from '@/lib/types';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { createProfessionalSchema } from '@/lib/validation/professional-schema';
import { AppError } from '@/lib/classes/AppError';

export async function createProfessional(
  input: {
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

    const validation = createProfessionalSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const data = validation.data;

    const [created] = await database
      .insert(professionals)
      .values({
        fullName: data.fullName.trim(),
        role: data.role,
        roleDescription: data.roleDescription?.trim() || null,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        competencies: data.competencies?.trim() || null,
      })
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

    return { success: true, message: null, data: created as Professional };
  } catch (error) {
    console.error('[createProfessional] - Error:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Creazione professionista non riuscita.',
      data: null,
    };
  }
}
