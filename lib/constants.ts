import { View } from 'react-big-calendar';
import { EventStatus, VenueType } from './types';

export const TIME_ZONE = 'Europe/Rome';

// resend password email
export const RPE_BLOCK_DURATION = 30 * 1000;
export const RPE_BLOCK_STORAGE_NAME = 'rpe_send_at';

// navbar
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

// avatar upload
export const AU_LOCAL_STORAGE_TTL = 2 * 60 * 60 * 1000; // 2hours;
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
