import { View } from 'react-big-calendar';
import { EventStatus, Gender, NavbarLink, VenueType } from './types';

export const TIME_ZONE = 'Europe/Rome';

// resend password email
export const RPE_EMAIL_STORAGE_NAME = 'rpe_email';
export const RPE_BLOCK_STORAGE_NAME = 'rpe_send_at';
export const RPE_BLOCK_DURATION = 30 * 1000;

// confirm email
export const CE_EMAIL_STORAGE_NAME = 'ce_email';
export const CE_BLOCK_STORAGE_NAME = 'ce_send_at';
export const CE_BLOCK_DURATION = 5 * 60 * 1000; // 10min

// navbar
export const NAVBAR_LINKS: NavbarLink[] = [
  {
    label: 'Calendario',
    href: '/calendario',
    iconSrc: '/images/navbar-icons/calendar.svg',
    iconAlt: 'icona Calendario',
    visibleTo: ['artist-manager'],
    separator: false,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconSrc: '/images/navbar-icons/dashboard.svg',
    iconAlt: 'icona Dashboard',
    visibleTo: ['admin', 'venue-manager'],
    separator: false,
  },
  {
    label: 'Eventi',
    href: '/eventi',
    iconSrc: '/images/navbar-icons/events.svg',
    iconAlt: 'icona Eventi',
    visibleTo: ['admin', 'artist-manager', 'venue-manager'],
    separator: true,
  },
  {
    label: 'Manager artisti',
    href: '/manager-artisti',
    iconSrc: '/images/navbar-icons/artist-managers.svg',
    iconAlt: 'icona Manager artisti',
    visibleTo: ['admin'],
    separator: false,
  },
  {
    label: 'Artisti',
    href: '/artisti',
    iconSrc: '/images/navbar-icons/artists.svg',
    iconAlt: 'icona Artisti',
    visibleTo: ['admin', 'artist-manager', 'venue-manager'],
    separator: true,
  },
  {
    label: 'Promoter locali',
    href: '/promoter-locali',
    iconSrc: '/images/navbar-icons/venue-managers.svg',
    iconAlt: 'icona Promoter locali',
    visibleTo: ['admin'],
    separator: false,
  },
  {
    label: 'Locali',
    href: '/locali',
    iconSrc: '/images/navbar-icons/venues.svg',
    iconAlt: 'icona Locali',
    visibleTo: ['admin', 'venue-manager', 'artist-manager'],
    separator: false,
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
  'rejected': 'Rifiutato',
  'ended': 'Finito',
};

//venues
export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  small: 'Piccola < 3.000',
  medium: 'Media > 3.000',
  big: 'Grande > 10.000',
};
