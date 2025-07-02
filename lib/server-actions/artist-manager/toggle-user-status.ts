'use server';

import { UserStatus } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { users } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { eq } from 'drizzle-orm';

export async function toggleUserStatus(
  userId: string,
  initialUserStatus: UserStatus
): Promise<ServerActionResponse<null>> {
  const newStatus: UserStatus =
    initialUserStatus === 'active' ? 'disabled' : 'active';

  try {
    await database
      .update(users)
      .set({
        status: newStatus,
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (err) {
    console.error('[toggleUserStatus] - Error updating user:', err);
    return {
      success: false,
      message: 'Aggiornamento utente non riuscito.',
      data: null,
    };
  }
}
