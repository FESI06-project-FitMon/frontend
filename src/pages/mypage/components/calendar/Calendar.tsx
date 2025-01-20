import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  hostedGatherings, // 호스트로 참여한 모임 데이터
  userGatherings // 유저로 참여한 모임 데이터
} from '@/pages/mypage/constants/constants';
import Preparing from '@/components/common/Preparing';

export default function CalendarTab() {
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
  const events = [
    ...hostedGatherings.map((gathering) => ({
      gatheringId: gathering.gatheringId,
      gatheringTitle: gathering.gatheringTitle,
      startDate: gathering.gatheringStartDate,
      endDate: gathering.gatheringEndDate,
      isHost: true, // 호스트 여부
      gatheringMainType: gathering.gatheringMainType, // 모임 타입
    })),
    ...userGatherings.map((gathering) => ({
      gatheringId: gathering.gatheringId,
      gatheringTitle: gathering.gatheringTitle,
      startDate: gathering.gatheringStartDate,
      endDate: gathering.gatheringEndDate,
      isHost: false, // 유저 참여 여부
      gatheringMainType: gathering.gatheringMainType, // 모임 타입
    })),
  ];

  // FullCalendar에 사용할 이벤트 데이터 생성
  const calendarEvents = events.map(event => ({
    id: event.gatheringId.toString(), // 이벤트 ID
    start: new Date(event.startDate).toISOString(), // 이벤트 시작 날짜
    end: new Date(event.endDate).toISOString(), // 이벤트 종료 날짜
    title: event.gatheringTitle, // 이벤트 제목
    backgroundColor: getEventColor(event.gatheringMainType), // 배경 색상
    borderColor: getEventColor(event.gatheringMainType), // 테두리 색상
    textColor: event.gatheringMainType === '유산소형' ? '#000000' : '#FFFFFF', // 텍스트 색상
    extendedProps: { // 추가 속성
      isHost: event.isHost, // 호스트 여부
      type: event.gatheringMainType, // 모임 타입
    }
  }));

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
          <Preparing isVisible={true} message="api 준비 중인 서비스입니다..." />
          <FullCalendar
            ref={calendarRef} // FullCalendar 레퍼런스 설정
            plugins={[dayGridPlugin]} // FullCalendar 플러그인 (dayGrid 사용)
            initialView="dayGridMonth" // 기본 뷰 설정 (월별 보기)
            events={calendarEvents} // 캘린더 이벤트 데이터
            locale="en" // 언어 설정
            height="auto" // 높이 자동 설정
            editable={false} // 이벤트 수정 불가능
            selectable={false} // 날짜 선택 불가능
            headerToolbar={false} // 기본 헤더 비활성화
            eventContent={({ event }) => (
              // 이벤트 커스터마이즈 렌더링
              <div className="flex items-center justify-center gap-1 px-1 py-0.5 rounded text-xs" style={{ color: event.textColor }}>
                {event.extendedProps.isHost && (
                  <Image
                    src="/assets/image/crown.svg"
                    alt="host"
                    width={12}
                    height={12}
                  />
                )}
                <span>{event.title}</span>
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

