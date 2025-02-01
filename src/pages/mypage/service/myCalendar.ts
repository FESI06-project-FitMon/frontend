import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../api/calendarService';

export const EVENT_TYPES = ['유산소형', '경기형', '헬스형'] as const;

export const getEventColor = (type: string) => {
  switch (type) {
    case '유산소형':
      return '#faf4b1';
    case '경기형':
      return '#4e7868';
    case '헬스형':
      return '#604163';
    default:
      return 'primary';
  }
};

export const CALENDAR_KEYS = {
  all: ['calendar'] as const,
  list: (page: number, pageSize: number) => [...CALENDAR_KEYS.all, { page, pageSize }] as const,
};

export function useCalendarGatherings(page = 0, pageSize = 100) {
  return useQuery({
    queryKey: CALENDAR_KEYS.list(page, pageSize),
    queryFn: async () => {
      const data = await calendarService.getCalendarGatherings(page, pageSize);
      
      const events = data.content
        ?.filter(gathering => gathering.status !== '취소됨')
        ?.map(gathering => ({
          id: gathering.gatheringId.toString(),
          start: gathering.startDate,
          end: gathering.endDate,
          title: gathering.title,
          backgroundColor: getEventColor(gathering.mainType),
          borderColor: getEventColor(gathering.mainType),
          textColor: gathering.mainType === '유산소형' ? '#000000' : '#FFFFFF',
          extendedProps: {
            isHost: gathering.captainStatus,
            type: gathering.mainType
          }
        })) ?? [];

      return {
        ...data,
        events
      };
    }
  });
}