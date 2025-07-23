import { View } from 'react-big-calendar';

export const USER_STATUS = [
  'active',
  'waiting-for-approval',
  'disabled',
  'banned',
] as const; // as const = is an immutable array
export type UserStatus = (typeof USER_STATUS)[number];

// resend password email
export const RPE_BLOCK_DURATION = 30 * 1000;
export const RPE_BLOCK_STORAGE_NAME = 'rpe_send_at';

export const NAVBAR_LINKS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconSrc: '/images/navbar-icons/dashboard.svg',
    iconAlt: 'icona Dashboard',
    separator: false,
  },
  {
    label: 'Eventi',
    href: '/eventi',
    iconSrc: '/images/navbar-icons/events.svg',
    iconAlt: 'icona Eventi',
    separator: true,
  },
  {
    label: 'Manager artisti',
    href: '/manager-artisti',
    iconSrc: '/images/navbar-icons/manager-artists.svg',
    iconAlt: 'icona Manager artisti',
    separator: false,
  },
  {
    label: 'Artisti',
    href: '/artisti',
    iconSrc: '/images/navbar-icons/artists.svg',
    iconAlt: 'icona Artisti',
    separator: true,
  },
  {
    label: 'Promoter locali',
    href: '/promoter-locali',
    iconSrc: '/images/navbar-icons/manager-venues.svg',
    iconAlt: 'icona Promoter locali',
    separator: false,
  },
  {
    label: 'Locali',
    href: '/locali',
    iconSrc: '/images/navbar-icons/venues.svg',
    iconAlt: 'icona Locali',
    separator: false,
  },
];

export const CALENDAR_VIEWS: View[] = ['day', 'week', 'month'];

// avatar upload
export const AU_LOCAL_STORAGE_TTL = 2 * 60 * 60 * 1000; // 2hours;
export const AU_MAX_SIZE_MB = 5;
export const AU_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const GENDERS = ['maschile', 'femminile', 'non-binary'] as const;
export type Gender = (typeof GENDERS)[number];

export const PAGINATED_TABLE_ROWS_X_PAGE = 10;

export const NEW_USER_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

export const VENUE_TYPES = ['small', 'medium', 'big'] as const;
export type VenueType = (typeof VENUE_TYPES)[number];

export const AVAILABILITY_STATUS = [
  'available',
  'booked',
  'cancelled',
] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUS)[number];

export const EVENTS_STATUS = [
  'proposed',
  'pre-confirmed',
  'confirmed',
  'rejected',
] as const;
export type EventStatus = (typeof EVENTS_STATUS)[number];
