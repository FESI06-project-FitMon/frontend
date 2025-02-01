import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useCalendarGatherings, EVENT_TYPES, getEventColor } from '../../service/myCalendar';
import Null from '@/components/common/Null';
import { ColorLegend } from './ColorLegend';

export default function CalendarTab() {
  const { data: calendarData, isLoading } = useCalendarGatherings();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');

  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentTitle(calendarApi.view.title);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  if (isLoading) {
    return (
      <Null
        message="로딩 중..."
        svg={
          <Image
            src="/assets/image/spinner.svg"
            alt="로딩 스피너"
            width={50}
            height={50}
          />
        }
      />
    );
  }

  if (!calendarData?.content || calendarData.content.length === 0) {
    return <Null message="일정이 없습니다." />;
  }

  return (
    <div className="space-y-6 pb-[50px]">
      <div className="bg-dark-300 rounded-lg p-4">
        {/* ColorLegend 컴포넌트 사용 */}
        <ColorLegend eventTypes={EVENT_TYPES} getColor={getEventColor} />

        {/* 캘린더 네비게이션 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrev} className="p-2">
            <img src="/assets/image/toggle.svg" alt="prev" className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-white text-lg font-bold">{currentTitle}</h2>
          <button onClick={handleNext} className="p-2">
            <img src="/assets/image/toggle.svg" alt="next" className="w-6 h-6" />
          </button>
        </div>

        {/* FullCalendar */}
        <div className="calendar-wrapper">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarData?.events ?? []}
            locale="en"
            height="auto"
            editable={false}
            selectable={false}
            headerToolbar={false}
            eventContent={({ event }) => (
              <div className="event-container flex items-center justify-between">
                <div
                  style={{
                    width: '45%',
                    height: '2px',
                    backgroundColor: event.backgroundColor,
                  }}
                />
                <div
                  className="flex items-center justify-center gap-1"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    textShadow: `
                      -1px 0 ${event.backgroundColor},
                      0 1px ${event.backgroundColor},
                      1px 0 ${event.backgroundColor},
                      0 -1px ${event.backgroundColor}
                    `
                  }}
                >
                  {event.extendedProps.isHost && (
                    <Image
                      src="/assets/image/crown.svg"
                      alt="Host"
                      width={12}
                      height={12}
                      style={{ marginRight: '4px' }}
                    />
                  )}
                  <span>{event.title}</span>
                </div>
                <div
                  style={{
                    width: '45%',
                    height: '2px',
                    backgroundColor: event.backgroundColor,
                  }}
                />
              </div>
            )}
            dayHeaderClassNames="bg-dark-300 text-white text-base font-medium py-4"
            dayHeaderContent={({ date }) => (
              <span className="flex justify-center">
                {date.toLocaleString('en-US', { weekday: 'short' })}
              </span>
            )}
            dayCellClassNames={({ isToday }) =>
              `calendar-cell ${isToday ? 'today' : ''}`
            }
            dayCellContent={({ date }) => (
              <div className="flex items-center justify-center h-8">
                <span className="w-6 h-6 flex items-center justify-center">
                  {date.getDate()}
                </span>
              </div>
            )}
            datesSet={updateTitle}
            eventClick={() => {
              alert('Calendar modification is not available.');
            }}
          />
        </div>

        <style>{`
          .calendar-wrapper {
            position: relative;
          }
          .calendar-wrapper .fc-theme-standard td,
          .calendar-wrapper .fc-theme-standard th {
            border: none;
          }
          
          .calendar-wrapper .fc-theme-standard .fc-scrollgrid {
            border: none;
          }

          .calendar-cell {
            background-color: transparent;
            min-height: 64px;
          }
          
          .fc-daygrid-event {
            background: transparent !important;
            border: none !important;
          }
          
          .fc-daygrid-event .event-container {
            min-height: 18px;
          }
          
          .fc .fc-daygrid-day-events {
            margin-top: 4px !important;
          }

          .fc-event-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
                
          .fc-daygrid-day.fc-day-today {
            background-color: rgba(255, 33, 64) !important;
          }

          .fc .fc-daygrid-day-top {
            justify-content: center;
          }

          .fc-direction-ltr .fc-daygrid-event.fc-event-end {
            margin-right: 0;
          }
        `}</style>
      </div>
    </div>
  );
}