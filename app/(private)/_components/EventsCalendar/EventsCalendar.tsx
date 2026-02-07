'use client';

import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  ToolbarProps as RBCToolbarProps,
  ShowMoreProps as RBCShowMoreProps,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-overrides.css';
import { addDays, addMonths, addWeeks, endOfDay, format, getDay, parse, startOfDay, startOfWeek } from 'date-fns';
import { EVENTS_CALENDAR_VIEWS, TIME_ZONE } from '@/lib/constants';
import ShowMore from './ShowMore';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArtistSelectData,
  CalendarEvent,
  EventsCalendarFilters,
  EventStatus,
  UserRole,
  VenueSelectData,
} from '@/lib/types';
import useSWR from 'swr';
import { calculateRange, fetcher, splitCsv } from '@/lib/utils';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { toast } from 'sonner';
import { it } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import WeekEvent from './WeekEvent';
import MonthEvent from './MonthEvent';
import ScheduleDate from './ScheduleDate';
import ScheduleEvent from './ScheduleEvent';
import ScheduleTime from './ScheduleTime';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import EventContent from './EventContent';
import { Toolbar } from './Toolbar';
import { useSearchParams } from 'next/navigation';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import WeekHeader from '../Calendar/WeekHeader';
import MonthHeader from '../Calendar/MonthHeader';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ArtistsBadge from '../Badges/ArtistsBadge';
import VenuesBadge from '../Badges/VenuesBadge';
import EventStatusBadge from '../Badges/EventStatusBadge';
import EventConflictBadge from '../Badges/EventConflictBadge';
import { HostedEventBadge } from '../Badges/HostedEventBadge';

const locales = { it };

export const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type EventsCalendarProps = {
  userRole: UserRole;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export default function EventsCalendar({ userRole, artists, venues }: EventsCalendarProps) {
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const calendarWrapRef = useRef<HTMLDivElement | null>(null);
  const anchorElRef = useRef<HTMLElement | null>(null);

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [calendarRange, setCalendarRange] = useState<{ start: Date; end: Date }>(() =>
    calculateRange(new Date(), 'week'),
  );
  const [view, setView] = useState<View>('week');

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
    placement: 'left' | 'right';
    arrowTop: number;
  } | null>(null);

  const isAdmin = userRole === 'admin';

  const filters: EventsCalendarFilters = {
    artistIds: splitCsv(searchParams.get('a')),
    venueIds: splitCsv(searchParams.get('v')),
    status: splitCsv(searchParams.get('s')) as EventStatus[],
  };

  const startDateUTC = fromZonedTime(
    startOfDay(calendarRange.start), // set to 00:00 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const endDateUTC = fromZonedTime(
    endOfDay(calendarRange.end), // set to 23:59 in local TZ
    TIME_ZONE, // your app’s locale time zone, e.g. 'Europe/Rome'
  ).toISOString(); // convert to UTC string

  const qs = new URLSearchParams(searchParams.toString());
  qs.set('sd', startDateUTC);
  qs.set('ed', endDateUTC);
  const fetchUrl = `/api/events/calendar/range?${qs.toString()}`;

  const { data: response, isLoading } = useSWR(fetchUrl, fetcher, { keepPreviousData: true });

  const onNavigateHandler = (newDate: Date) => {
    setCalendarDate(newDate);
    setCalendarRange(calculateRange(newDate, view));
  };

  const onToolbarNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'TODAY') {
      const today = new Date();
      setCalendarDate(today);
      setCalendarRange(calculateRange(today, view));
      return;
    }

    const direction = action === 'PREV' ? -1 : 1;
    let nextDate = calendarDate;

    switch (view) {
      case 'day':
        nextDate = addDays(calendarDate, direction);
        break;
      case 'week':
        nextDate = addWeeks(calendarDate, direction);
        break;
      case 'month':
        nextDate = addMonths(calendarDate, direction);
        break;
      case 'agenda':
        nextDate = addDays(calendarDate, 30 * direction);
        break;
      default:
        nextDate = addDays(calendarDate, direction);
    }

    setCalendarDate(nextDate);
    setCalendarRange(calculateRange(nextDate, view));
  };

  const onViewHandler = (nextView: View) => {
    setView(nextView);
    setCalendarRange(calculateRange(calendarDate, nextView));
  };

  const eventPropGetter = ({ status }: CalendarEvent) => ({ className: status });

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero eventi calendario non riuscito.');
      return;
    }

    setEvents(
      response.data.map((event: CalendarEvent) => ({
        ...event,
        start: toZonedTime(event.start, TIME_ZONE),
        end: toZonedTime(event.end, TIME_ZONE),
      })),
    );
  }, [response]);

  useEffect(() => {
    if (!isDesktop || !selectedEvent) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest('.rbc-event, .rbc-agenda-event-cell, .rbc-show-more')) return;
      setSelectedEvent(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isDesktop, selectedEvent]);

  useEffect(() => {
    if (!isDesktop || !selectedEvent) return;

    let frame = 0;
    const updateAnchorRect = () => {
      if (!anchorElRef.current) return;
      setAnchorRect(anchorElRef.current.getBoundingClientRect());
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateAnchorRect();
      });
    };

    const scrollTargets = new Set<Element>(
      calendarWrapRef.current?.querySelectorAll(
        '.rbc-time-content, .rbc-agenda-content, .rbc-agenda-view, .rbc-month-view',
      ) ?? [],
    );
    const anchorScrollParent = anchorElRef.current?.closest(
      '.rbc-agenda-content, .rbc-agenda-view, .rbc-time-content, .rbc-month-view',
    );
    if (anchorScrollParent) scrollTargets.add(anchorScrollParent);

    scrollTargets.forEach((el) => el.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    updateAnchorRect();

    return () => {
      scrollTargets.forEach((el) => el.removeEventListener('scroll', onScroll));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isDesktop, selectedEvent]);

  useLayoutEffect(() => {
    if (!isDesktop || !selectedEvent || !anchorRect || !calendarWrapRef.current) {
      setPanelPosition(null);
      return;
    }

    const containerRect = calendarWrapRef.current.getBoundingClientRect();
    const outOfView =
      anchorRect.bottom < containerRect.top || anchorRect.top > containerRect.bottom;
    if (outOfView) {
      setPanelPosition(null);
      return;
    }
    const padding = 12;
    const placement: 'right' = 'right';
    const panelWidth = panelRef.current?.offsetWidth ?? 640;
    const rawLeft = anchorRect.right - containerRect.left + padding;
    const left = Math.min(Math.max(rawLeft, 8), containerRect.width - panelWidth - 8);
    const panelHeight = panelRef.current?.offsetHeight ?? 420;
    const rawTop = anchorRect.top - containerRect.top;
    const top =
      view === 'agenda'
        ? rawTop
        : Math.min(Math.max(rawTop, 8), containerRect.height - panelHeight - 8);
    const anchorCenterY = anchorRect.top - containerRect.top + anchorRect.height / 2;
    const arrowTop = Math.min(Math.max(anchorCenterY - top - 8, 12), panelHeight - 12);

    setPanelPosition({ top, left, placement, arrowTop });
  }, [isDesktop, selectedEvent, anchorRect, view]);

  const selectedEventTitle = selectedEvent
    ? selectedEvent.title?.trim() ||
      generateEventTitle(
        selectedEvent.artist.stageName?.trim() ||
          `${selectedEvent.artist.name} ${selectedEvent.artist.surname}`.trim(),
        selectedEvent.venue.name,
        selectedEvent.start,
        selectedEvent.end,
      )
    : '';

  useEffect(() => {
    if (selectedEvent) return;
    anchorElRef.current = null;
    setAnchorRect(null);
  }, [selectedEvent]);

  const renderEventHeader = (event: CalendarEvent, showClose: boolean) => {
    const startDate = format(event.start, 'dd/MM/yyyy');
    const endDate = format(event.end, 'dd/MM/yyyy');
    return (
      <div className='flex items-start justify-between gap-3'>
        <div className='flex flex-wrap lg:flex-nowrap min-w-0 items-center gap-2 text-sm font-semibold text-zinc-900'>
          <ArtistsBadge
            artists={[event.artist]}
            userRole={userRole}
          />
          <span className='text-xs text-zinc-400'>x</span>
          <VenuesBadge
            userRole={userRole}
            venues={[event.venue]}
          />
          <span className='text-xs text-zinc-400'>—</span>
          <span className='text-xs font-semibold text-zinc-600 whitespace-nowrap'>
            {startDate} - {endDate}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          {event.hostedEvent && (
            <HostedEventBadge
              size='xs'
              className='text-[10px] px-1.5 py-0.5'
            />
          )}
          <EventStatusBadge status={event.status} size='xs' />
          {isAdmin && event.hasConflict && <EventConflictBadge size='sm' />}
          {showClose && (
            <Button
              size='icon'
              variant='ghost'
              className='shrink-0'
              onClick={() => setSelectedEvent(null)}
            >
              <X className='size-4' />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='relative'>
      {isLoading && <Skeleton className='absolute inset-0 z-50 opacity-60 rounded-xl' />}
      <Toolbar
        {...({
          date: calendarDate,
          view,
          onNavigate: onToolbarNavigate,
          onView: onViewHandler,
          views: EVENTS_CALENDAR_VIEWS,
          label: '',
          localizer: { messages: {} },
        } as RBCToolbarProps<CalendarEvent, object>)}
        filters={filters}
        artists={artists}
        venues={venues}
      />
      <div
        ref={calendarWrapRef}
        className='relative'
      >
        <BigCalendar
          localizer={localizer}
          culture='it'
          messages={{ allDay: 'All day' }}
          showMultiDayTimes
          date={calendarDate}
          onNavigate={onNavigateHandler}
          onView={onViewHandler}
          view={view}
          views={EVENTS_CALENDAR_VIEWS}
          defaultView='week'
          length={30}
          toolbar={false}
          showAllEvents={false}
          components={{
            day: { event: WeekEvent },
            week: { header: WeekHeader, event: WeekEvent },
            month: { header: MonthHeader, event: MonthEvent },
            agenda: { date: ScheduleDate, time: ScheduleTime, event: ScheduleEvent },
            showMore: (props) => (
              <ShowMore
                {...(props as RBCShowMoreProps<CalendarEvent>)}
                userRole={userRole}
              />
            ),
          }}
          events={events}
          style={{ minHeight: '600px' }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={(ev, e) => {
            const rawTarget = e?.target as HTMLElement | null;
            const scheduleClickTarget = rawTarget?.closest('.schedule-event-click');
            if (view === 'agenda' && !scheduleClickTarget) return;

            const anchorTarget =
              (view === 'agenda' ? scheduleClickTarget : null) ||
              rawTarget?.closest('.rbc-event') ||
              rawTarget?.closest('.rbc-agenda-event-cell') ||
              scheduleClickTarget;
            if (anchorTarget) {
              anchorElRef.current = anchorTarget as HTMLElement;
              setAnchorRect(anchorTarget.getBoundingClientRect());
            }
            setSelectedEvent(ev as CalendarEvent);
            if (!isDesktop) setDialogOpen(true);
          }}
        />

        {isDesktop && selectedEvent && (
          <aside
            ref={panelRef}
            className='absolute z-20 w-[640px] xl:w-[720px] max-w-[calc(100%-1rem)] max-h-[calc(100%-2rem)] rounded-2xl border bg-white/95 p-5 shadow-xl backdrop-blur'
            style={
              panelPosition
                ? { top: panelPosition.top, left: panelPosition.left }
                : { top: 80, right: 24 }
            }
          >
            {panelPosition && (
              <span
                className={`absolute top-0 h-3 w-3 rotate-45 border bg-white/95 ${panelPosition.placement === 'right' ? '-left-1.5 border-b-0 border-r-0' : '-right-1.5 border-b-0 border-l-0'}`}
                style={{ top: panelPosition.arrowTop }}
              />
            )}
            {renderEventHeader(selectedEvent, true)}

            <div className='mt-4 max-h-[calc(100%-6rem)] overflow-y-auto'>
              <EventContent
                userRole={userRole}
                event={selectedEvent}
                showHostedBadge={false}
              />
            </div>
          </aside>
        )}
      </div>

      {!isDesktop && (
        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) window.setTimeout(() => setSelectedEvent(null), 200);
          }}
          modal={false}
          showOverlay={false}
          title={selectedEvent ? selectedEventTitle : 'Evento'}
          description=''
          isTitleHidden
          isDescriptionHidden
        >
          {selectedEvent && (
            <div className='space-y-4'>
              {renderEventHeader(selectedEvent, false)}
              <EventContent
                userRole={userRole}
                event={selectedEvent}
                showHostedBadge={false}
              />
            </div>
          )}
        </ConfirmDialog>
      )}
    </div>
  );
}
