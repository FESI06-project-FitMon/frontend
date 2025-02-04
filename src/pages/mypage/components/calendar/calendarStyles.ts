// calendarStyles.ts
export const calendarStyles = `
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
    cursor: pointer !important;  /* 이벤트에 커서 포인터 추가 */
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
    background-color: rgba(255, 33, 64, 0.2) !important;
  }

  .fc .fc-daygrid-day-top {
    justify-content: center;
  }

  .fc-direction-ltr .fc-daygrid-event.fc-event-end {
    margin-right: 0;
  }

  /* today 날짜 원형 스타일 제거, 기본 스타일만 유지 */
  .fc-day-today .fc-daygrid-day-number {
    color: #FF2140;  /* 오늘 날짜는 빨간색 텍스트만 적용 */
  }

  /* 이벤트 호버 시 커서 스타일 */
  .fc-event:hover {
    cursor: pointer;
  }
`;