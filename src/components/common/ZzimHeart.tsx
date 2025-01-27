import {
  gatheringIdInLikes,
  removeGatheringId,
  addGatheringId,
} from '@/utils/likesgathering';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ZzimHeartProps {
  gatheringId: number;
}

export default function ZzimHeart({ gatheringId }: ZzimHeartProps) {
  const [isClicked, setIsClicked] = useState(false);

  // 클라이언트에서만 초기값 설정
  useEffect(() => {
    const valid = gatheringIdInLikes(gatheringId);
    setIsClicked(valid);
  }, [gatheringId]);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    e.preventDefault(); // 부모의 기본 동작 방지 (링크 이동)
    setIsClicked((prev) => !prev);

    if (gatheringIdInLikes(gatheringId)) {
      removeGatheringId(gatheringId); // 찜한 모임 아이디 로컬스토리지에서 삭제
    } else {
      addGatheringId(gatheringId); // 찜한 모임 아이디 로컬스토리지에 추가
    }
  };

  return (
    <div className="w-[26px] h-[26px] md:w-[38px] md:h-[38px] rounded-full bg-white flex items-center justify-center z-20">
      {isClicked ? (
        <Image
          src="/assets/image/heart-fill.svg"
          alt="heart"
          width={22}
          height={22}
          onClick={handleClick}
          className="mt-0.5 z-30 cursor-pointer w-[15px] h-[15px] md:w-[22px] md:h-[22px]"
        />
      ) : (
        <Image
          src="/assets/image/heart-empty.svg"
          alt="heart"
          width={22}
          height={22}
          onClick={handleClick}
          className="mt-0.5 z-30 cursor-pointer w-[15px] h-[15px] md:w-[22px] md:h-[22px]"
        />
      )}
    </div>
  );
}
