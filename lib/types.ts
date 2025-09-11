import { Event as RbcEvent } from 'react-big-calendar';
import {
  availabilityStatus,
  eventStatus,
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

// users
export type UserToApprove = {
  id: string;
  role: UserRole;
  name: string;
  surname: string;
  email: string;
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
  avatarUrl: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  languages: Language[];
  birthDate: string;
  birthPlace: string;
  address: string;
  country: Country;
  subdivision: Subdivision;
  city: string;
  zipCode: string;
  gender: Gender;

  artists: T[];

  company: string;
  taxCode: string;
  ipiCode: string;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  iban: string;
  sdiRecipientCode: string | null;
  billingAddress: string;
  billingCountry: Country;
  billingSubdivision: Subdivision;
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
  phone: string;
  email: string;
  languages: Language[];
  birthDate: string;
  birthPlace: string;
  address: string;
  country: Country;
  subdivision: Subdivision;
  city: string;
  zipCode: string;
  gender: Gender;
  zones: Zone[];

  managers: ArtistManagerSelectData[];

  tourManagerEmail: string;
  tourManagerName: string;
  tourManagerSurname: string;
  tourManagerPhone: string;

  company: string;
  taxCode: string;
  ipiCode: string;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  iban: string;
  sdiRecipientCode: string | null;
  billingAddress: string;
  billingCountry: Country;
  billingSubdivision: Subdivision;
  billingCity: string;
  billingZipCode: string;
  billingEmail: string;
  billingPhone: string;
  billingPec: string;
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
  | 'phone'
  | 'email'
  | 'company'
  | 'managers'
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

  avatarUrl: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  languages: Language[];

  venues: T[];

  birthDate: string;
  birthPlace: string;
  address: string;
  country: Country;
  subdivision: Subdivision;
  city: string;
  zipCode: string;
  gender: Gender;
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
  avatarUrl: string;
  name: string;
  type: VenueType;
  capacity: number;

  address: string;
  country: Country;
  subdivision: Subdivision;
  city: string;
  zipCode: string;

  manager: VenueManagerSelectData;

  company: string;
  taxCode: string;
  ipiCode: string;
  bicCode: string | null;
  abaRoutingNumber: string | null;
  iban: string;
  sdiRecipientCode: string | null;
  billingAddress: string;
  billingCountry: Country;
  billingSubdivision: Subdivision;
  billingCity: string;
  billingZipCode: string;
  billingEmail: string;
  billingPhone: string;
  billingPec: string;
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

export type VenueTableData = Pick<
  VenueData,
  | 'id'
  | 'slug'
  | 'status'
  | 'avatarUrl'
  | 'name'
  | 'company'
  | 'taxCode'
  | 'address'
  | 'manager'
  | 'type'
  | 'capacity'
  | 'createdAt'
>;

export type VenueSelectData = Pick<
  VenueData,
  'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'address' | 'manager'
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

  start: Date;
  end: Date;
}

// event
export type Event = {
  id: number;

  artist: ArtistSelectData;
  availability: ArtistAvailability;
  venue: VenueSelectData;
  status: EventStatus;

  previousStatus: EventStatus | null;

  artistManager: ArtistManagerSelectData | null;

  tourManagerName: string;
  tourManagerSurname: string;

  administrationEmail: string | null;

  payrollConsultantEmail: string | null;

  moCost: string | null;

  venueManagerCost: string | null;

  depositCost: string | null;

  depositInvoiceNumber: string | null;

  expenseReimbursement: string | null;

  bookingPercentage: string | null;

  supplierCost: string | null;

  moArtistAdvancedExpenses: string | null;

  artistNetCost: string | null;

  artistUpfrontCost: string | null;

  hotel: string | null;
  restaurant: string | null;
  eveningContact: string | null;
  moCoordinator: MoCoordinator | null;

  totalCost: string | null;

  transportationsCost: string | null;

  cashBalanceCost: string | null;

  soundCheckStart: string | null;
  soundCheckEnd: string | null;
  tecnicalRiderUrl: string | null;
  tecnicalRiderName: string | null;

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

export type EventsTableFilters = {
  currentPage: number | null;
  status: EventStatus[];
  artistIds: string[];
  artistManagerIds: string[];
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

  start: Date;
  end: Date;
}

//navbar
export type NavbarLink = {
  label: string;
  href: string;
  iconSrc: string;
  iconAlt: string;
  canAccess: UserRole[];
};
