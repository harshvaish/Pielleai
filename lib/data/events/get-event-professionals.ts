'server only';

import { database } from '@/lib/database/connection';
import { eventProfessionals, professionals } from '@/lib/database/schema';
import { Professional } from '@/lib/types';
import { asc, eq } from 'drizzle-orm';

export async function getEventProfessionals(eventId: number): Promise<Professional[]> {
  try {
    return await database
      .select({
        id: professionals.id,
        fullName: professionals.fullName,
        role: professionals.role,
        roleDescription: professionals.roleDescription,
        email: professionals.email,
        phone: professionals.phone,
        competencies: professionals.competencies,
        createdAt: professionals.createdAt,
        updatedAt: professionals.updatedAt,
      })
      .from(eventProfessionals)
      .innerJoin(professionals, eq(eventProfessionals.professionalId, professionals.id))
      .where(eq(eventProfessionals.eventId, eventId))
      .orderBy(asc(professionals.fullName));
  } catch (error) {
    console.error('[getEventProfessionals] - Error:', error);
    throw new Error('Recupero professionisti evento non riuscito.');
  }
}
