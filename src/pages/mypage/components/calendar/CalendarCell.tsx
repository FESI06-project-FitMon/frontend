// CalendarCell.tsx
import React, { memo } from 'react';

interface DayCellProps {
  date: Date;
}

export const DayCell = memo(function DayCell({ date }: DayCellProps) {
  return (
    <div className="flex items-center justify-center h-8">
      <span className="w-6 h-6 flex items-center justify-center text-white">
        {date.getDate()}
      </span>
    </div>
  );
});

interface DayHeaderProps {
  date: Date;
}

export const DayHeader = memo(function DayHeader({ date }: DayHeaderProps) {
  return (
    <span className="flex justify-center text-white">
      {date.toLocaleString('en-US', { weekday: 'short' })}
    </span>
  );
});
