import RingChart from '@/components/chart/RingChart';
import ZzimHeart from '@/components/common/ZzimHeart';
import OpenStatus from '@/components/tag/OpenStatus';
import StatusTag from '@/components/tag/StatusTag';
import { GatheringListItem } from '@/types';
import getDatePart from '@/utils/getDatePart';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  data: GatheringListItem;
}

export default function Card({ data }: CardProps) {
  const {
    gatheringId,
    title,
    imageUrl,
    subType,
    startDate,
    endDate,
    totalCount,
    participantCount,
    status,
    tags,
    mainLocation,
    subLocation,
  } = data;

  const date = `${getDatePart(startDate)} ~ ${getDatePart(endDate)}`;

  const today = new Date();
  const endDateTime = new Date(endDate);

  let timeLeftText = '';
  if (
    getDatePart(today.toISOString()) === getDatePart(endDateTime.toISOString())
  ) {
    const diffInMs = endDateTime.getTime() - today.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (diffInHours > 0) {
      timeLeftText = `${diffInHours}시간 남음`;
    } else if (diffInMinutes > 0) {
      timeLeftText = `${diffInMinutes}분 남음`;
    } else {
      timeLeftText = '마감됨';
    }
  }

  return (
    <Link href={`/detail/${gatheringId}`} className="flex gap-5 items-center">
      <div className="relative min-w-[130px] object-cover h-[136px] md:min-w-[266px] lg:min-w-[220px] md:h-[220px]">
        {timeLeftText && (
          <div className="absolute flex gap-1 top-1.5 right-1 bg-primary py-1 px-2 rounded-full text-xs md:text-sm z-10">
            <Image
              src={'/assets/image/alarm.svg'}
              width={14}
              height={14}
              alt="알림"
            />
            {timeLeftText}
          </div>
        )}
        <div className="absolute bottom-2.5 left-1.5 md:left-2.5 z-10">
          <StatusTag status={status} />
        </div>
        <div className="absolute bottom-2.5 right-1.5 md:right-2.5 z-10">
          <ZzimHeart gatheringId={gatheringId} />
        </div>
        <div className="relative min-w-[130px] h-[136px] md:min-w-[266px] lg:min-w-[220px] md:h-[220px]">
          {/* 나머지 코드는 동일 */}
          <Image
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 130px, (max-width: 1024px) 266px, 220px"
            alt="모임 사진"
            className="rounded-[20px] object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-2.5 w-full relative">
        <OpenStatus
          gatheringJoinedPeopleCount={participantCount}
          className="absolute right-0 top-0 text-sm md:text-base"
        />
        <span className="text-primary font-normal text-xs md:text-base">
          {subType} | {mainLocation} {subLocation}
        </span>
        <h2 className="text-sm md:text-xl font-bold">{title}</h2>
        <span className="text-xs md:text-sm text-dark-700">{date}</span>
        <div className="flex gap-3">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-dark-200 text-[10px] md:text-sm md:py-1 md:px-2 rounded-[5px]"
            >
              #{tag}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start items-center gap-3">
            <RingChart total={totalCount} value={participantCount} />
            <span className="text-xs md:text-base font-semibold">
              {participantCount}/{totalCount}
            </span>
          </div>
          <span className="text-xs md:text-base font-semibold">
            모임 참여하기 →
          </span>
        </div>
      </div>
    </Link>
  );
}
