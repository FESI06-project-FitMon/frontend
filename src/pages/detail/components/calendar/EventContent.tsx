// EventContent.tsx
import React, { memo } from 'react';
import Image from 'next/image';
import { EventApi } from '@fullcalendar/core';

interface EventContentProps {
  event: EventApi;
}
export const EventContent = memo(function EventContent({ event }: EventContentProps) {

  return (
    <div className="event-container flex items-center justify-between px-2">
      <div
        className="flex-1"
        style={{
          height: '2px',
          backgroundColor: event.backgroundColor,
        }}
      />
      <div
        className="flex items-center justify-center gap-1 px-2 whitespace-nowrap"
        style={{
          fontSize: '0.75rem',
          fontWeight: 'bold',
          color: '#FFFFFF', // 모든 텍스트 흰색으로 통일
          textShadow: `
            -1.5px 0 rgb(62,62,64),
            0 1.5px rgb(62,62,64),
            1.5px 0 rgb(62,62,64),
            0 -1.5px rgb(62,62,64)
          ` //(dark-400)텍스트 쉐도우 설정
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
        className="flex-1"
        style={{
          height: '2px',
          backgroundColor: event.backgroundColor,
        }}
      />
    </div>
  );
});