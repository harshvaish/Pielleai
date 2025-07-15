import { Event } from 'react-big-calendar';
import { Gender, UserStatus, VenueType } from './constants';

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
export type EventStatus =
  | 'proposed'
  | 'preconfirmed'
  | 'confirmed'
  | 'conflict'
  | 'draft';

/* ------------------------------------------------- */
export interface CalendarEvent extends Event {
  id: number;
  artistName: string;
  artistManagerName: string;
  venueName: string;
  status: EventStatus;
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
/* ------------------------------------------------- */
export type ArtistManagerData = {
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
>;

export type ArtistManagerSelectData = Pick<
  ArtistManagerData,
  'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname'
>;

/* ------------------------------------------------- */

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
  | 'phone'
  | 'email'
  | 'company'
  | 'managers'
>;

/* ------------------------------------------------- */
export type VenueManagerData = {
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
};

export type VenueManagerTableData = Pick<
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
>;

export type VenueManagerSelectData = Pick<
  ArtistManagerData,
  'id' | 'profileId' | 'avatarUrl' | 'name' | 'surname' | 'status'
>;
/* ------------------------------------------------- */

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
>;
