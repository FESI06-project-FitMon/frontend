import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export interface ToastProps {
  isOpen: boolean;
  type: 'error' | 'check' | 'caution' | 'info';
  message: string;
  duration?: number;
  setIsOpen: (isOpen: boolean) => void; // 부모의 상태를 변경하기 위한 prop
}

export default function Toast({
  isOpen,
  type = 'info',
  message,
  duration = 3000, //기본 3초 후 메세지 사라짐
  setIsOpen,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  // isOpen prop이 변경될 때마다 내부 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsOpen(false); // 토스트가 사라질 때 부모 상태도 초기화
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, setIsOpen]);

  if (!isVisible) return null;

  const toastIcons = {
    error: '/assets/image/toast_error.svg',
    check: '/assets/image/toast_check.svg',
    caution: '/assets/image/toast_caution.svg',
    info: '/assets/image/toast_info.svg',
  };

  return (
    <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 z-[10010] transition-opacity duration-300 opacity-100">
      <div className="flex items-center px-3 py-2 md:px-6 md:py-4 rounded-[10px] bg-dark-300">
        <div className="w-4 h-4 md:w-6 md:h-6 relative flex-shrink-0">
          <Image
            src={toastIcons[type]}
            alt={`${type} icon`}
            fill
            className="object-contain"
          />
        </div>
        <span className="ml-1 md:ml-2.5 text-white text-xs md:text-base">
          {message}
        </span>
      </div>
    </div>
  );
}

// const [showToast, setShowToast] = useState(false);
// const [toastType, setToastType] = useState<'error' | 'check' | 'caution' | 'info'>('info');
// <button
// onClick={() => {
//   setShowToast(true);
//   setToastType('info');
// }}
// className="rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
// >
// Info Toast
// </button>

// <Toast
// setIsOpen={setShowToast} 초기화를 위함함
// isOpen={showToast}
// type={toastType} 
// message={`${toastType} ddddddddd토스트 메시지입니다.`}
// />