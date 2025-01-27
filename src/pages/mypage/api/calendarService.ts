// calendarService.ts
import apiRequest from '@/utils/apiRequest';
import { CalendarGathering, PageResponse } from '@/types';

export const calendarService = {
  getCalendarGatherings: (page = 0, pageSize = 100) => {
    return apiRequest<PageResponse<CalendarGathering>>({
      param: `api/v1/my-page/calendar?page=${page}&pageSize=${pageSize}`,
      method: 'get'
    });
  }
};