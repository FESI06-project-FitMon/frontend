import React from 'react';
import Image from 'next/image';

interface PreparingProps {
  message?: string;
  isVisible: boolean;
}

export default function Preparing({
  message = '준비중입니다...',
  isVisible,
}: PreparingProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 w-full h-full bg-black/60 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <Image
          src="/assets/image/fitmon.png"
          alt="Loading animation"
          fill
          className="animate-bounce object-contain"
          priority
        />
      </div>
      <span className="text-white font-bold text-lg mt-4">{message}</span>
    </div>
  );
}
