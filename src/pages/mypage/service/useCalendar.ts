import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../api/calendarService';

export const CALENDAR_KEYS = {
  all: ['calendar'] as const,
  list: (page: number, pageSize: number) => [...CALENDAR_KEYS.all, { page, pageSize }] as const,
};

export function useCalendarGatherings(page = 0, pageSize = 100) {
  return useQuery({
    queryKey: CALENDAR_KEYS.list(page, pageSize),
    queryFn: () => calendarService.getCalendarGatherings(page, pageSize)
  });
}