// CalendarTab.tsx
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import FullCalendar from '@fullcalendar/react';
import { EventContentArg, DayCellContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useCalendarGatherings, EVENT_TYPES, getEventColor } from '../../service/myCalendar';
import { StateData } from '@/components/common/StateData';
import { ColorLegend } from './ColorLegend';
import { EventContent } from './EventContent';
import { DayCell, DayHeader } from './CalendarCell';
import { calendarStyles } from './calendarStyles';

export default function CalendarTab() {
  const { data: calendarData, isLoading } = useCalendarGatherings();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const router = useRouter();

  const updateTitle = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title);
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentTitle(calendarApi.view.title);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentTitle(calendarApi.view.title);
    }
  }, []);

  const handleEventClick = useCallback((arg: { event: { id: string } }) => {
    const gatheringId = arg.event.id;
    if (gatheringId) {
      router.push(`/detail/${gatheringId}`);
    }
  }, [router]);

  const renderEventContent = useCallback((arg: EventContentArg) => {
    return <EventContent event={arg.event} />;
  }, []);

  const renderDayCellContent = useCallback((arg: DayCellContentArg) => {
    return <DayCell date={arg.date} />;
  }, []);

  const renderDayHeaderContent = useCallback((arg: DayCellContentArg) => {
    return <DayHeader date={arg.date} />;
  }, []);

  // 이벤트 데이터 메모이제이션
  const events = useMemo(() => {
    return calendarData?.events ?? [];
  }, [calendarData?.events]);

  useEffect(() => {
    updateTitle();
  }, [updateTitle]);

  if (!calendarData?.content || calendarData.content.length === 0) {
    return <StateData isLoading={isLoading} emptyMessage="일정이 없습니다." />;
  }

  return (
    <div className="space-y-6 pb-[50px]">
      <div className="bg-dark-300 rounded-lg p-4">
        <ColorLegend eventTypes={EVENT_TYPES} getColor={getEventColor} />

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrev}
            className="p-2"
            type="button"
            aria-label="Previous month"
          >
            <img src="/assets/image/toggle.svg" alt="prev" className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-white text-lg font-bold">{currentTitle}</h2>
          <button
            onClick={handleNext}
            className="p-2"
            type="button"
            aria-label="Next month"
          >
            <img src="/assets/image/toggle.svg" alt="next" className="w-6 h-6" />
          </button>
        </div>

        <div className="calendar-wrapper">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale="en"
            dayMaxEvents={false}  // "more" 링크 대신 모든 이벤트 표시
            height="auto"
            eventDisplay="block"
            editable={false}
            selectable={false}
            headerToolbar={false}
            eventContent={renderEventContent}
            dayCellContent={renderDayCellContent}
            dayHeaderContent={renderDayHeaderContent}
            dayHeaderClassNames="bg-dark-300 text-white py-4"
            dayCellClassNames={({ isToday }) =>
              `calendar-cell ${isToday ? 'today' : ''}`
            }
            datesSet={updateTitle}
            eventClick={handleEventClick}
          />
        </div>

        <style jsx global>{calendarStyles}</style>
      </div>
    </div>
  );
}