import { Event as RbcEvent } from 'react-big-calendar';
import {
  availabilityStatus,
  eventStatus,
  contractStatus,
  profileGenders,
  userRoles,
  userStatus,
  venueTypes,
} from './database/schema';

// project
export type ServerActionResponse<T = unknown> =
  | {
      success: true;
      message: null;
      data: T;
    }
  | {
      success: false;
      message: string;
      data: null;
    };

export type ApiResponse<T = unknown> =
  | { success: true; message: null; data: T }
  | { success: false; message: string; data: null };

// enums
export type AvailabilityStatus = (typeof availabilityStatus.enumValues)[number];
export type EventStatus = (typeof eventStatus.enumValues)[number];
export type Gender = (typeof profileGenders.enumValues)[number];
export type UserRole = (typeof userRoles.enumValues)[number];
export type UserStatus = (typeof userStatus.enumValues)[number];
export type VenueType = (typeof venueTypes.enumValues)[number];
export type ContractStatus  = (typeof contractStatus.enumValues)[number];

// users
export type UserToApprove = {
  id: string;
  role: UserRole;
  name: string;
  surname: string;
  email: string | null;
};

// search bar
export type RawSearchItem = {
  id: string;
  profileId: number;
  avatarUrl: string;
  name: string;
  surname: string;
  path: string;
};
export type SearchItem = {
  avatarUrl: string;
  fullName: string;
  surname: string;
  path: string;
  role: string;
};

// languages
export type Language = {
  id: number;
  name: string;
};

// geo
export type Country = {
  id: number;
  code: string;
  name: string;
  isEu: boolean;
};
export type Subdivision = {
  id: number;
  name: string;
};

// zones
export type Zone = {
  id: number;
  name: string;
};

// notes
export type ProfileNote = {
  id: number;
  content: string;
  createdAt: Date;
};
export type EventNote = {
  id: number;
  content: string;
  createdAt: Date;
};

// mo coordinators
export type MoCoordinator = {
  id: number;
  name: string;
  surname: string;
};

// artist manager
export type ArtistManagersTableFilters = {
  currentPage: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  artistIds: string[];
  company: string | null;
};

export type ArtistManagerData<T = ArtistListData | ArtistSelectData> = {
  id: string;
  profileId: number;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  name: string;
  surname: string;
  phone: string;
  email: string | null;
  languages: Language[];
  birthDate: string | null;
  birthPlace: string | null;
  address: string;
  country: Country | null;
  subdivision: Subdivision | null;
  city: string;
  zipCode: string;
  gender: Gender | null;

  artists: T[];

  company: string;
  taxCode: string;
  ipiCode: string;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  iban: string;
  sdiRecipientCode: string | null;
  billingAddress: string;
  billingCountry: Country | null;
  billingSubdivision: Subdivision | null;
  billingCity: string;
  billingZipCode: string;
  billingEmail: string;
  billingPhone: string;
  billingPec: string;
  taxableInvoice: boolean;
};

export type ArtistManagerTableData = Pick<
  ArtistManagerData,
  | 'id'
  | 'profileId'
  | 'status'
  | 'createdAt'
  | 'avatarUrl'
  | 'name'
  | 'surname'
  | 'phone'
  | 'email'
  | 'company'
  | 'artists'
>;

export type ArtistManagerSelectData = Pick<
  ArtistManagerData,
  'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname' | 'status'
>;

// artist
export type ArtistsTableFilters = {
  currentPage: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  managerIds: string[];
  zoneIds: string[];
};

export type ArtistData = {
  id: number;
  slug: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string;
  name: string;
  surname: string;
  stageName: string;
  bio: string;
  phone: string;
  email: string;
  languages: Language[];
  birthDate: string | null;
  birthPlace: string | null;
  address: string | null;
  country: Country | null;
  subdivision: Subdivision | null;
  city: string | null;
  zipCode: string | null;
  gender: Gender;
  zones: Zone[];

  managers: ArtistManagerSelectData[];

  tourManagerEmail: string;
  tourManagerName: string;
  tourManagerSurname: string;
  tourManagerPhone: string;

  company: string | null;
  taxCode: string | null;
  ipiCode: string | null;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  iban: string | null;
  sdiRecipientCode: string | null;
  billingAddress: string | null;
  billingCountry: Country | null;
  billingSubdivision: Subdivision | null;
  billingCity: string | null;
  billingZipCode: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
  billingPec: string | null;
  taxableInvoice: boolean;

  tiktokUrl: string | null;
  tiktokUsername: string | null;
  tiktokFollowers: number | null;
  tiktokCreatedAt: string | null;

  facebookUrl: string | null;
  facebookUsername: string | null;
  facebookFollowers: number | null;
  facebookCreatedAt: string | null;

  instagramUrl: string | null;
  instagramUsername: string | null;
  instagramFollowers: number | null;
  instagramCreatedAt: string | null;

  xUrl: string | null;
  xUsername: string | null;
  xFollowers: number | null;
  xCreatedAt: string | null;
};

export type ArtistTableData = Pick<
  ArtistData,
  | 'id'
  | 'slug'
  | 'status'
  | 'zones'
  | 'createdAt'
  | 'avatarUrl'
  | 'name'
  | 'surname'
  | 'stageName'
  | 'bio'
  | 'phone'
  | 'email'
  | 'company'
  | 'tourManagerEmail'
  | 'tourManagerName'
  | 'tourManagerSurname'
  | 'tourManagerPhone'
  | 'managers'
  | 'tiktokUrl'
  | 'facebookUrl'
  | 'instagramUrl'
  | 'xUrl'
>;

export type ArtistListData = Pick<
  ArtistData,
  | 'id'
  | 'slug'
  | 'status'
  | 'avatarUrl'
  | 'name'
  | 'surname'
  | 'stageName'
  | 'phone'
  | 'email'
  | 'tourManagerEmail'
  | 'tourManagerName'
  | 'tourManagerSurname'
  | 'tourManagerPhone'
>;

export type ArtistSelectData = Pick<
  ArtistData,
  'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'surname' | 'stageName'
> &
  Partial<
    Pick<
      ArtistData,
      'tourManagerEmail' | 'tourManagerName' | 'tourManagerSurname' | 'tourManagerPhone'
    >
  >;

// venue manager
export type VenueManagersTableFilters = {
  currentPage: number;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  venueIds: string[];
};

export type VenueManagerData<T = VenueTableData | VenueListData | VenueBadgeData> = {
  id: string;
  profileId: number;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  avatarUrl: string | null;
  name: string;
  surname: string;
  phone: string;
  email: string | null;
  languages: Language[];

  venues: T[];

  birthDate: string | null;
  birthPlace: string | null;
  address: string;
  country: Country | null;
  subdivision: Subdivision | null;
  city: string;
  zipCode: string;
  gender: Gender | null;
};

export type VenueManagerTableData = Pick<
  VenueManagerData,
  | 'id'
  | 'profileId'
  | 'status'
  | 'createdAt'
  | 'avatarUrl'
  | 'name'
  | 'surname'
  | 'phone'
  | 'email'
  | 'venues'
>;

export type VenueManagerSelectData = Pick<
  VenueManagerData,
  'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname' | 'status' 
>;

// venue
export type VenuesTableFilters = {
  currentPage: number;
  name: string | null;
  company: string | null;
  taxCode: string | null;
  address: string | null;
  types: VenueType[];
  managerIds: string[];
  capacity: string | null;
};

export type VenueData = {
  id: number;
  slug: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  name: string;
  bio: string | null;
  type: VenueType;
  capacity: number;

  address: string;
  country: Country | null;
  subdivision: Subdivision | null;
  city: string;
  zipCode: string;

  manager: VenueManagerSelectData | null;

  company: string;
  taxCode: string;
  vatCode: string;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  sdiRecipientCode: string | null;
  billingAddress: string;
  billingCountry: Country | null;
  billingSubdivision: Subdivision | null;
  billingCity: string;
  billingZipCode: string;
  billingEmail: string | null;
  billingPhone: string | null;
  billingPec: string;

  tiktokUrl: string | null;
  tiktokUsername: string | null;
  tiktokFollowers: number | null;
  tiktokCreatedAt: string | null;

  facebookUrl: string | null;
  facebookUsername: string | null;
  facebookFollowers: number | null;
  facebookCreatedAt: string | null;

  instagramUrl: string | null;
  instagramUsername: string | null;
  instagramFollowers: number | null;
  instagramCreatedAt: string | null;

  xUrl: string | null;
  xUsername: string | null;
  xFollowers: number | null;
  xCreatedAt: string | null;
};

export type VenueTableData = Pick<
  VenueData,
  | 'id'
  | 'slug'
  | 'status'
  | 'avatarUrl'
  | 'name'
  | 'bio'
  | 'company'
  | 'taxCode'
  | 'address'
  | 'manager'
  | 'type'
  | 'capacity'
  | 'createdAt'
  | 'tiktokUrl'
  | 'facebookUrl'
  | 'instagramUrl'
  | 'xUrl'
>;

export type VenueSelectData = Pick<
  VenueData,
  'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'address' | 'manager' | 'company' | 'vatCode'
>;

export type VenueListData = Pick<
  VenueData,
  | 'id'
  | 'slug'
  | 'status'
  | 'avatarUrl'
  | 'name'
  | 'company'
  | 'taxCode'
  | 'address'
  | 'type'
  | 'capacity'
>;

export type VenueBadgeData = Pick<VenueData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name'>;

// availability
export type ArtistAvailability = {
  id: number;
  artistId: number;
  startDate: Date;
  endDate: Date;
  status: AvailabilityStatus;
  event?: {
    id: number;
    title: string | null;
    status: EventStatus;
    eventType: EventType | null;
    venue: {
      id: number;
      name: string;
      city: string | null;
    };
  } | null;
  canDelete?: boolean;
};

export type Availability = Pick<ArtistAvailability, 'startDate' | 'endDate'>;

export type TimeRange = {
  startTime: string;
  endTime: string;
  status?: AvailabilityStatus;
  availabilityId?: number;
  canDelete?: boolean;
};

// availability calendar
export interface CalendarAvailability extends RbcEvent {
  id: number;
  status: AvailabilityStatus;
  event?: ArtistAvailability['event'];

  start: Date;
  end: Date;
}
export type EventType = "dj-set" | "live" | "festival";

// event
export type Event = {
  id: number;
  title?: string | null;
  artist: ArtistSelectData;
  availability: ArtistAvailability;
  venue: VenueSelectData;
  status: EventStatus;
  hasConflict: boolean;
  artistManager: ArtistManagerSelectData | null;
  tourManagerEmail: string | null;
  payrollConsultantEmail: string | null;
  moCost: string | null;
  venueManagerCost: string | null;
  eventType: EventType;
  paymentDate: Date;
  depositCost: string | null;
  contract?: {
    id: number;
    status?: string;
    ccs?: string[]; 
    fileUrl?: string | null;
    fileName?: string | null;
    latestHistory?: any;
  } | null;  
  depositInvoiceNumber: string | null;

  bookingPercentage: string | null;

  moArtistAdvancedExpenses: string | null;

  artistNetCost: string | null;

  artistUpfrontCost: string | null;

  hotel: string | null;
  hotelCost: string | null;
  restaurant: string | null;
  restaurantCost: string | null;
  eveningContact: string | null;
  moCoordinator: MoCoordinator | null;

  totalCost: string | null;

  transportationsCost: string | null;
  cashBalanceCost: string | null;

  soundCheckStart: string | null;
  soundCheckEnd: string | null;
  tecnicalRiderUrl: string | null;
  tecnicalRiderName: string | null;
  tourManagerName: string | null;
  contractSigning: boolean;
  depositInvoiceIssuing: boolean;
  depositReceiptVerification: boolean;
  techSheetSubmission: boolean;
  artistEngagement: boolean;
  professionalsEngagement: boolean;
  accompanyingPersonsEngagement: boolean;

  performance: boolean;

  postDateFeedback: boolean;
  bordereau: boolean;

  notes: EventNote[];
};

export type ArtistEventListItem = {
  id: number;
  title: string | null;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  eventType: EventType | null;
  venue: {
    id: number;
    name: string;
    city: string | null;
  };
};

export type EventSummary = {
  id: number;
  status: EventStatus;
  eventType: EventType | null;
  startDate: Date;
  endDate: Date;
  artist: {
    id: number;
    name: string;
    surname: string;
    stageName: string | null;
  };
  venue: {
    id: number;
    name: string;
    city: string | null;
    address: string | null;
  };
};

export type EventsTableFilters = {
  currentPage: number | null;
  status: EventStatus[];
  conflict: boolean;
  artistIds: string[];
  artistManagerIds: string[];
  venueIds: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type ArtistEventsTableFilters = {
  currentPage: number | null;
  status: EventStatus[];
  venueIds: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// event calendar
export type EventsCalendarFilters = {
  status: EventStatus[];
  artistIds: string[];
  venueIds: string[];
  startDate?: Date;
  endDate?: Date;
};

export interface CalendarEvent extends RbcEvent {
  id: number;
  artist: ArtistSelectData;
  venue: VenueBadgeData;
  artistManager: {
    id: string | null;
    profileId: number | null;
    status: UserStatus | null;
    avatarUrl: string | null;
    name: string | null;
    surname: string | null;
  };
  status: EventStatus;
  hasConflict: boolean;

  start: Date;
  end: Date;
}

//navbar
export type NavbarLink = {
  label: string;
  href: string;
  iconSrc: string;
  iconAlt: string;
  visibleTo: UserRole[];
  separator: boolean;
};
