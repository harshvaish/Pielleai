import { View } from 'react-big-calendar';
import { EventStatus, Gender, UserRole, VenueType } from './types';

export const TIME_ZONE = 'Europe/Rome';

// resend password email
export const RPE_BLOCK_DURATION = 30 * 1000;
export const RPE_BLOCK_STORAGE_NAME = 'rpe_send_at';

// confirm email
export const CE_EMAIL_STORAGE_NAME = 'ce_email';
export const CE_BLOCK_STORAGE_NAME = 'ce_send_at';
export const CE_BLOCK_DURATION = 5 * 60 * 1000; // 10min

// navbar
export const NAVBAR_LINKS: {
  label: string;
  href: string;
  iconSrc: string;
  iconAlt: string;
  canAccess: UserRole[];
}[] = [
  {
    label: 'Calendario',
    href: '/calendario',
    iconSrc: '/images/navbar-icons/calendar.svg',
    iconAlt: 'icona Calendario',
    canAccess: ['artist-manager'],
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconSrc: '/images/navbar-icons/dashboard.svg',
    iconAlt: 'icona Dashboard',
    canAccess: ['admin', 'venue-manager'],
  },
  {
    label: 'Eventi',
    href: '/eventi',
    iconSrc: '/images/navbar-icons/events.svg',
    iconAlt: 'icona Eventi',
    canAccess: ['admin', 'artist-manager', 'venue-manager'],
  },
  {
    label: 'Manager artisti',
    href: '/manager-artisti',
    iconSrc: '/images/navbar-icons/artist-managers.svg',
    iconAlt: 'icona Manager artisti',
    canAccess: ['admin'],
  },
  {
    label: 'Artisti',
    href: '/artisti',
    iconSrc: '/images/navbar-icons/artists.svg',
    iconAlt: 'icona Artisti',
    canAccess: ['admin', 'artist-manager', 'venue-manager'],
  },
  {
    label: 'Promoter locali',
    href: '/promoter-locali',
    iconSrc: '/images/navbar-icons/venue-managers.svg',
    iconAlt: 'icona Promoter locali',
    canAccess: ['admin'],
  },
  {
    label: 'Locali',
    href: '/locali',
    iconSrc: '/images/navbar-icons/venues.svg',
    iconAlt: 'icona Locali',
    canAccess: ['admin', 'venue-manager'],
  },
];

// avatar upload
export const AU_MAX_SIZE_MB = 5;
export const AU_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// pdf upload
export const PDFU_MAX_SIZE_MB = 10;
export const PDFU_ALLOWED_MIME_TYPES = ['application/pdf'];

// tables
export const PAGINATED_TABLE_ROWS_X_PAGE = 10;
export const NEW_USER_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

// calendars
export const CALENDAR_VIEWS: View[] = ['day', 'week', 'month'];

//genders
export const GENDERS_LABELS: Record<Gender, string> = {
  'male': 'Maschile',
  'female': 'Femminile',
  'non-binary': 'Non-binary',
};

//events
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  'proposed': 'Proposto',
  'pre-confirmed': 'Pre confermato',
  'confirmed': 'Confermato',
  'conflict': 'Conflitto',
  'rejected': 'Rifiutato',
};

//venues
export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  small: 'Club / DJ set',
  medium: 'Media > 3.000',
  big: 'Grande > 10.000',
};
