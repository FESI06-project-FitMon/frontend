// CalendarCell.tsx
import React, { memo } from 'react';

interface DayCellProps {
  date: Date;
}

const DayCell = memo(({ date }: DayCellProps) => (
  <div className="flex items-center justify-center h-8">
    <span className="w-6 h-6 flex items-center justify-center text-white">
      {date.getDate()}
    </span>
  </div>
));

DayCell.displayName = 'DayCell';

interface DayHeaderProps {
  date: Date;
}

const DayHeader = memo(({ date }: DayHeaderProps) => (
  <span className="flex justify-center text-white">
    {date.toLocaleString('en-US', { weekday: 'short' })}
  </span>
));

DayHeader.displayName = 'DayHeader';

export { DayCell, DayHeader };