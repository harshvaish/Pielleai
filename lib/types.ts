import { Event } from 'react-big-calendar';

export type ServerActionResponse<T = unknown> = {
  success: boolean;
  message: null | string;
  data: T;
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
