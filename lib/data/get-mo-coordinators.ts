'server only';

import { database } from '@/lib/database/connection';
import { MoCoordinator } from '../types';
import { moCoordinators } from '../database/schema';

export async function getMoCoordinators(): Promise<MoCoordinator[]> {
  try {
    const results = await database
      .select({
        id: moCoordinators.id,
        name: moCoordinators.name,
        surname: moCoordinators.surname,
      })
      .from(moCoordinators)
      .orderBy(moCoordinators.name, moCoordinators.surname);

    return results;
  } catch (error) {
    console.error('[getMoCoordinators] - Error: ', error);
    throw new Error('Recupero coordinatori non riuscito.');
  }
}
