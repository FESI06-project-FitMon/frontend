import React, { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useCalendarGatherings } from '../../service/useCalendar';

export default function CalendarTab() {
  const { data: calendarData } = useCalendarGatherings();

  // FullCalendar 컴포넌트의 레퍼런스를 저장하기 위한 useRef
  const calendarRef = useRef<FullCalendar | null>(null);

  // 현재 캘린더 제목 (현재 월, 연도 등)을 저장하기 위한 상태
  const [currentTitle, setCurrentTitle] = useState('');

  // 캘린더 제목을 업데이트하는 함수
  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentTitle(calendarApi.view.title); // 캘린더의 현재 제목을 가져옴
    }
  };

  // 이전 달 버튼 클릭 핸들러
  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev(); // 이전 달로 이동
      setCurrentTitle(calendarApi.view.title); // 제목 업데이트
    }
  };

  // 다음 달 버튼 클릭 핸들러
  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next(); // 다음 달로 이동
      setCurrentTitle(calendarApi.view.title); // 제목 업데이트
    }
  };

  // 컴포넌트가 처음 렌더링될 때 캘린더 제목 설정
  useEffect(() => {
    updateTitle();
  }, []);

  // 모임 타입에 따라 이벤트 배경 색상을 반환하는 함수
  const getEventColor = (type: string) => {
    switch (type) {
      case '유산소형':
        return '#faf4b1';
      case '경기형':
        return '#4e7868';
      case '근력형':
        return '#604163';
      default:
        return '#5779b3';
    }
  };

  // 호스트 및 유저 모임 데이터를 이벤트 형식으로 병합
  const events = useMemo(() => 
    calendarData?.content?.map(gathering => ({
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
    })) ?? [], [calendarData]);


  return (
    <div className="space-y-6 pb-[50px]">
      <div className="bg-dark-300 rounded-lg p-4">
        {/* 캘린더 상단 네비게이션 (이전/다음 버튼과 현재 제목) */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrev} className="p-2">
            <img src="/assets/image/toggle.svg" alt="prev" className="w-6 h-6 rotate-180" />
          </button>
          <h2 className="text-white text-lg font-bold">
            {currentTitle} {/* 현재 캘린더 제목 */}
          </h2>
          <button onClick={handleNext} className="p-2">
            <img src="/assets/image/toggle.svg" alt="next" className="w-6 h-6" />
          </button>
        </div>

        {/* FullCalendar 컴포넌트 */}
        <div className="calendar-wrapper">
          <FullCalendar
            ref={calendarRef} // FullCalendar 레퍼런스 설정
            plugins={[dayGridPlugin]} // FullCalendar 플러그인 (dayGrid 사용)
            initialView="dayGridMonth" // 기본 뷰 설정 (월별 보기)
            events={events} // 캘린더 이벤트 데이터
            locale="en" // 언어 설정
            height="auto" // 높이 자동 설정
            editable={false} // 이벤트 수정 불가능
            selectable={false} // 날짜 선택 불가능
            headerToolbar={false} // 기본 헤더 비활성화
            eventContent={({ event }) => (
              <div
                className="event-container flex items-center justify-between"
              >
                {/* 왼쪽 선 */}
                <div
                  style={{
                    width: '45%',
                    height: '2px',
                    backgroundColor: event.backgroundColor,
                  }}
                ></div>
            
                {/* 텍스트와 호스트 이미지 */}
                <div
                  className="flex items-center justify-center gap-1"
                  style={{
                    fontSize: '0.75rem', // 텍스트 크기
                    fontWeight: 'bold', // 텍스트 굵기
                    color: event.textColor || '#FFFFFF',
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
            
                {/* 오른쪽 선 */}
                <div
                  style={{
                    width: '45%',
                    height: '2px',
                    backgroundColor: event.backgroundColor,
                  }}
                ></div>
              </div>
            )}
            
            dayHeaderClassNames="bg-dark-300 text-white text-base font-medium py-4" // 날짜 헤더 스타일
            dayHeaderContent={({ date }) => (
              <span className="flex justify-center">
                {date.toLocaleString('en-US', { weekday: 'short' })} {/* 요일 표시 */}
              </span>
            )}
            dayCellClassNames={({ isToday }) =>
              `calendar-cell ${isToday ? 'today' : ''}` // 오늘 날짜 강조 스타일
            }
            dayCellContent={({ date }) => (
              <div className="flex items-center justify-center h-8">
                <span className="w-6 h-6 flex items-center justify-center">
                  {date.getDate()} {/* 날짜 숫자 표시 */}
                </span>
              </div>
            )}
            datesSet={updateTitle} // 날짜가 변경될 때 제목 업데이트
            eventClick={() => {
              alert('Calendar modification is not available.'); // 이벤트 클릭 시 알림
            }}
          />
        </div>

        {/* 캘린더 스타일 */}
        <style>{`
          .calendar-wrapper {
          position: relative;  /* 이미 relative 클래스를 추가했지만, 확실히 하기 위해 */
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
         /* 이벤트 높이 조절 */  
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
          background-color: rgba(255, 33, 64) !important; // 오늘 날짜 배경색
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

