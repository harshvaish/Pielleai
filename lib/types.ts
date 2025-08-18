import { Event as RbcEvent } from 'react-big-calendar';
import { AvailabilityStatus, EventStatus, Gender, VenueType } from './constants';
import { userRoles, userStatus } from './database/schema';

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
/* ------------------------------------------------- */
export type UserStatus = (typeof userStatus.enumValues)[number];
export type UserRole = (typeof userRoles.enumValues)[number];

export type UserToApprove = {
  id: string;
  role: UserRole;
  name: string;
  surname: string;
  email: string;
};
/* ------------------------------------------------- */
export interface CalendarEvent extends RbcEvent {
  id: number;
  artist: ArtistSelectData;
  venue: VenueSelectData;
  artistManager: ArtistManagerSelectData | null;
  status: EventStatus;

  start: Date;
  end: Date;
}

export interface CalendarAvailability extends RbcEvent {
  id: number;
  status: AvailabilityStatus;
}
/* ------------------------------------------------- */
export type Language = {
  id: number;
  name: string;
};
/* ------------------------------------------------- */
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
/* ------------------------------------------------- */
export type Zone = {
  id: number;
  name: string;
};
/* ------------------------------------------------- */
export type ProfileNote = {
  id: number;
  content: string;
  createdAt: string;
};

export type EventNote = {
  id: number;
  content: string;
  createdAt: Date;
};
/* ------------------------------------------------- */
export type MoCoordinator = {
  id: number;
  name: string;
  surname: string;
};
/* ------------------------------------------------- */
export type ArtistManagersTableFilters = {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
  artistIds: string[];
  company: string;
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

export type ArtistManagerTableData = Pick<ArtistManagerData, 'id' | 'profileId' | 'status' | 'createdAt' | 'avatarUrl' | 'name' | 'surname' | 'phone' | 'email' | 'company' | 'artists'>;

export type ArtistManagerSelectData = Pick<ArtistManagerData, 'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname' | 'status'>;
/* ------------------------------------------------- */
export type ArtistsTableFilters = {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
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

export type ArtistTableData = Pick<ArtistData, 'id' | 'slug' | 'status' | 'zones' | 'createdAt' | 'avatarUrl' | 'name' | 'surname' | 'phone' | 'email' | 'company' | 'managers'>;

export type ArtistListData = Pick<
  ArtistData,
  'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'surname' | 'stageName' | 'phone' | 'email' | 'tourManagerEmail' | 'tourManagerName' | 'tourManagerSurname' | 'tourManagerPhone'
>;

export type ArtistSelectData = Pick<ArtistData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'surname' | 'stageName'>;

/* ------------------------------------------------- */
export type VenueManagersTableFilters = {
  currentPage: number;
  fullName: string;
  email: string;
  phone: string;
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

export type VenueManagerTableData = Pick<VenueManagerData, 'id' | 'profileId' | 'status' | 'createdAt' | 'avatarUrl' | 'name' | 'surname' | 'phone' | 'email' | 'venues'>;

export type VenueManagerSelectData = Pick<VenueManagerData, 'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname' | 'status'>;
/* ------------------------------------------------- */
export type VenuesTableFilters = {
  currentPage: number;
  name: string;
  company: string;
  taxCode: string;
  address: string;
  types: VenueType[];
  managerIds: string[];
  capacity: string;
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

export type VenueTableData = Pick<VenueData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'company' | 'taxCode' | 'address' | 'manager' | 'type' | 'capacity'>;

export type VenueSelectData = Pick<VenueData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'address' | 'manager'>;

export type VenueListData = Pick<VenueData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name' | 'company' | 'taxCode' | 'address' | 'type' | 'capacity'>;

export type VenueBadgeData = Pick<VenueData, 'id' | 'slug' | 'status' | 'avatarUrl' | 'name'>;

/* ------------------------------------------------- */

export type ArtistAvailability = {
  id: number;
  startDate: Date;
  endDate: Date;
  status: AvailabilityStatus;
};

export type Availability = Pick<ArtistAvailability, 'startDate' | 'endDate'>;

export type TimeRange = {
  startTime: string;
  endTime: string;
  status?: AvailabilityStatus;
  availabilityId?: number;
};

/* ------------------------------------------------- */

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

export type EventsCalendarFilters = {
  status: EventStatus[];
  artistIds: string[];
  artistManagerIds: string[];
  venueIds: string[];
  startDate: Date | null;
  endDate: Date | null;
};
