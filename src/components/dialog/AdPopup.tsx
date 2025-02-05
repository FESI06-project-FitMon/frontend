import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Position {
  x: number;
  y: number;
}

const AdPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hideForPeriod, setHideForPeriod] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const adImages = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    src: `/assets/image/abv${i + 1}.jpg`,
    caption: [
      "우리집 강아지 귀여운거 실화..? 😍",
      "이런 귀여움은 공유해야 합니다! 🐕",
      "오늘의 필수 힐링, 우리 강아지 구경하기 🎀",
      "귀여움이 터져나가요! 💝",
      "이 미모 실화...? 우리집 강아지 보고 가세요 ✨",
      "잠시만요! 이 귀여움을 보고 가세요 🌟"
    ][i]
  }));

  const HIDE_POPUP_TIMESTAMP_KEY = 'hidePopupUntil';

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // localStorage 체크
  useEffect(() => {
    setIsMounted(true);
    setTimeout(() => {
      try {
        const hideUntil = localStorage.getItem(HIDE_POPUP_TIMESTAMP_KEY);
        if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error checking localStorage:', error);
        setIsOpen(true);
      }
    }, 0);
  }, []);

  // 이미지 자동 슬라이드
  useEffect(() => {
    if (!isOpen || !isMounted || isDragging) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prev) => (prev + 1) % adImages.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, isMounted, isDragging, adImages.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.clickable')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragOffset.y))
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const handleClose = () => {
    if (hideForPeriod) {
      try {
        const hideUntil = new Date().getTime() + (24 * 60 * 60 * 1000); // 24시간
        localStorage.setItem(HIDE_POPUP_TIMESTAMP_KEY, hideUntil.toString());
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    }
    setIsOpen(false);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
    >
      <div
        className={`relative bg-dark-200 rounded-lg shadow-xl ${
          isMobile ? 'w-36 sm:w-48' : 'w-72 sm:w-80'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* 상단 바 */}
        <div className="flex items-center justify-between p-2">
          <p className="text-xs sm:text-sm font-medium line-clamp-1">
            {adImages[currentImageIndex].caption}
          </p>
          <button onClick={handleClose} className="p-0.5 rounded-full z-20 ml-1 flex-shrink-0 clickable">
            <Image src="/assets/image/close.svg" alt="닫기" width={16} height={16} />
          </button>
        </div>

        {/* 광고 이미지 컨테이너 */}
        <div
          className="relative w-full aspect-[3/4] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full h-full">
            <Image
              src={adImages[currentImageIndex].src}
              alt={`귀여운 강아지 ${currentImageIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-500"
              sizes={isMobile ? "144px" : "320px"}
              loading="lazy"
              quality={75}
            />
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-2 bg-dark-200 rounded-b-lg">
          <div className="flex items-center justify-between gap-1">
            <label className="flex items-center gap-1 text-[10px] sm:text-xs clickable">
              <input
                type="checkbox"
                checked={hideForPeriod}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHideForPeriod(e.target.checked)}
                className="w-3 h-3 rounded border-dark-600 text-dark-600 focus:ring-dark-500 clickable"
              />
              <span className="whitespace-nowrap">하루 동안 보지 않기</span>
            </label>
            <button onClick={handleClose} className="px-1.5 py-0.5 text-white rounded text-[10px] sm:text-xs hover:bg-dark-700 transition-colors whitespace-nowrap clickable">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
