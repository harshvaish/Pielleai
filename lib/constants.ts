export const USER_ROLES = [
  'admin',
  'artist-manager',
  'venue-manager',
  'user',
] as const; // as const = is an immutable array

export type UserRole = (typeof USER_ROLES)[number];

export const RPE_BLOCK_DURATION = 30 * 1000;
export const RPE_BLOCK_STORAGE_NAME = 'rpe_send_at';
