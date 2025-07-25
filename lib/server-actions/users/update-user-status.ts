'use server';

import { UserStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { users } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus
): Promise<ServerActionResponse<null>> {
  try {
    await database
      .update(users)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[updateUserStatus] - Error updating user:', err);
    return {
      success: false,
      message: 'Aggiornamento utente non riuscito.',
      data: null,
    };
  }
}
