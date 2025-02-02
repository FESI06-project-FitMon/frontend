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
    background-color: rgba(255, 33, 64, 0.1) !important;
  }

  .fc .fc-daygrid-day-top {
    justify-content: center;
  }

  .fc-direction-ltr .fc-daygrid-event.fc-event-end {
    margin-right: 0;
  }

  .fc-day-today .fc-daygrid-day-number {
    background-color: #FF2140;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;