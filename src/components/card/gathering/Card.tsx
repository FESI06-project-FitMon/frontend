import RingChart from '@/components/chart/RingChart';
import ZzimHeart from '@/components/common/ZzimHeart';
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

  return (
    <Link href={`/detail/${gatheringId}`} className="flex gap-5 items-center">
      <div className="relative min-w-[130px] h-[136px] md:min-w-[220px] md:h-[220px]">
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <StatusTag status={status} />
        </div>
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <ZzimHeart gatheringId={gatheringId} />
        </div>
        <Image src={imageUrl} fill alt="모임 사진" className="rounded-xl" />
      </div>
      <div className="flex flex-col gap-2 md:gap-2.5 w-full">
        <span className="text-primary font-normal text-xs md:text-base">
          {subType} | {mainLocation} {subLocation}
        </span>
        <h2 className="text-sm md:text-xl font-bold">{title}</h2>
        <span className="text-xs md:text-sm text-dark-700">{date}</span>
        <div className="flex gap-3">
          {tags.map((tag) => {
            return (
              <div key={tag} className="bg-dark-200 py-1 px-2 rounded-[5px]">
                #{tag}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          <div className="flex justify-start items-center gap-3">
            <RingChart total={totalCount} value={participantCount} />
            <span className="text-xs sm:text-base font-semibold">
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
