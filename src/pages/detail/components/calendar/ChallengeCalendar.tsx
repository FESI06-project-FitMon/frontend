// CalendarTab.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventContentArg, DayCellContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { StateData } from '@/components/common/StateData';
import { EventContent } from './EventContent';
import { DayCell, DayHeader } from './CalendarCell';
import { calendarStyles } from './calendarStyles';
import { Metadata } from '@/components/common/Metadata';
import { useCalendarChallenges } from '../../service/gatheringService';
import Image from 'next/image';

export default function CalendarTab({ gatheringId }: { gatheringId: number }) {
  const { data: calendarData, isLoading } = useCalendarChallenges(gatheringId);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');

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

  const renderEventContent = useCallback((arg: EventContentArg) => {
    return <EventContent event={arg.event} />;
  }, []);

  const renderDayCellContent = useCallback((arg: DayCellContentArg) => {
    return <DayCell date={arg.date} />;
  }, []);

  const renderDayHeaderContent = useCallback((arg: DayCellContentArg) => {
    return <DayHeader date={arg.date} />;
  }, []);

  const renderMoreLinkContent = useCallback((arg: DayCellContentArg) => {
    return <div>{arg.dayNumberText}</div>;
  }, []);
  // 이벤트 데이터 메모이제이션
  const events = useMemo(() => {
    return calendarData ?? [];
  }, [calendarData]);

  useEffect(() => {
    updateTitle();
  }, [updateTitle]);

  if (!calendarData) {
    return <StateData isLoading={isLoading} emptyMessage="일정이 없습니다." />;
  }

  return (
    <>
      <Metadata
        title="챌린지 캘린더"
        description="해당 모임의 챌린지들을 캘린더로 한눈에 확인하세요."
      />
      <div className="space-y-6 pb-[50px]">
        <div className="bg-dark-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrev}
              className="p-2"
              type="button"
              aria-label="Previous month"
            >
              <Image
                src="/assets/image/toggle.svg"
                alt="prev"
                className="w-6 h-6 rotate-180"
                width={24}
                height={24}
              />
            </button>
            <h2 className="text-white text-lg font-bold">{currentTitle}</h2>
            <button
              onClick={handleNext}
              className="p-2"
              type="button"
              aria-label="Next month"
            >
              <Image
                src="/assets/image/toggle.svg"
                alt="next"
                className="w-6 h-6"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              locale="en"
              dayMaxEvents={5} // "more" 링크 대신 모든 이벤트 표시
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
              moreLinkContent={renderMoreLinkContent}
            />
          </div>

          <style jsx global>
            {calendarStyles}
          </style>
        </div>
      </div>
    </>
  );
}
