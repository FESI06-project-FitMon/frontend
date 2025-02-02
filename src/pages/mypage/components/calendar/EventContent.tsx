// EventContent.tsx
import React, { memo } from 'react';
import Image from 'next/image';
import { EventApi } from '@fullcalendar/core';

interface EventContentProps {
  event: EventApi;
}

export const EventContent = memo(function EventContent({ event }: EventContentProps) {
  return (
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
  );
});
