import { format, isSameDay } from 'date-fns';

/**
 * Generates an event title in the format:
 * - "Artist x Venue – DD/MM/YYYY" if start and end dates are the same
 * - "Artist x Venue – DD/MM/YYYY – DD/MM/YYYY" if dates are different
 * 
 * @param artistName - The name of the artist (stage name or full name)
 * @param venueName - The name of the venue
 * @param startDate - The start date of the event
 * @param endDate - The end date of the event
 * @returns The formatted event title
 */
export function generateEventTitle(
  artistName: string,
  venueName: string,
  startDate: Date,
  endDate: Date,
): string {
  const formattedStartDate = format(startDate, 'dd/MM/yyyy');
  
  if (isSameDay(startDate, endDate)) {
    return `${artistName} x ${venueName} – ${formattedStartDate}`;
  }
  
  const formattedEndDate = format(endDate, 'dd/MM/yyyy');
  return `${artistName} x ${venueName} – ${formattedStartDate} – ${formattedEndDate}`;
}
