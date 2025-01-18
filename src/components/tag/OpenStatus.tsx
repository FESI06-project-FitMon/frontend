import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OpenStatusProps {
  gatheringJoinedPeopleCount: number;
  className?: string;
}

export default function OpenStatus({
  gatheringJoinedPeopleCount,
  className = '',
}: OpenStatusProps) {
  // 5명 이상이면 개설확정
  const isConfirmed = gatheringJoinedPeopleCount >= 5;

  // 화면 크기에 따라 이미지 크기를 조정  이미지 때메 함수형 넣었어유ㅠㅅㅠ
  const [imageSize, setImageSize] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      setImageSize(window.innerWidth >= 768 ? 16 : 12);
    };

    handleResize(); // 초기 화면 크기에 따라 설정
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`text-left ${className}`}>
      <span
        className={`font-semibold ${
          isConfirmed ? 'text-primary' : 'text-dark-700'
        }`}
      >
        {isConfirmed ? (
          <div className="flex items-center text-xs md:text-base gap-[4px]">
            <span>개설확정</span>
            <Image
              src="/assets/image/open-check.svg"
              alt="확정"
              width={imageSize}
              height={imageSize}
              className="rounded-full bg-primary ml-[2px]"
            />
          </div>
        ) : (
          '개설대기'
        )}
      </span>
    </div>
  );
}
