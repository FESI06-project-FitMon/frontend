import Button from '@/components/common/Button';
import { GatheringListItem } from '@/types';
import Image from 'next/image';
import getDatePart from '@/utils/getDatePart';

interface AvailableGuestbooksProps {
  gatherings: GatheringListItem[];
  onWriteClick: (gatheringId: number) => void;
  isLoading?: boolean;
}

export default function AvailableGuestbooks({
  gatherings,
  onWriteClick,
}: AvailableGuestbooksProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {gatherings.map((gathering) => (
        <div
          key={gathering.gatheringId}
          className="flex flex-col justify-center md:justify-start md:flex-row md:w-[696px] lg:w-[906px] md:h-[200px] gap-[10px] md:gap-[24px] lg:gap-[30px]"
        >
          <div className="relative w-full md:w-[228px] lg:w-[300px] h-[150px] sm:h-[200px] overflow-hidden rounded-[20px]">
            <Image
              src={gathering.imageUrl || '/assets/image/default_img.png'}
              alt={gathering.title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/image/default_img.png';
              }}
            />
          </div>

          <div className="flex flex-col flex-1 px-[4px] md:px-0 py-[4px] lg:py-[20px]">
            <h3 className="text-primary text-xs md:text-base font-normal mb-1 md:mb-3.5">
              {gathering.subType} | {gathering.mainLocation}{' '}
              {gathering.subLocation}
            </h3>
            <h2 className="text-sm md:text-xl font-bold mb-3.5">
              {gathering.title}
            </h2>
            <div className="flex text-xs md:text-base items-center gap-[13px] text-dark-700 mb-[10px] sm:mb-[15px] lg:mb-[20px]">
              <h4>
                {getDatePart(gathering.startDate)} ~{' '}
                {getDatePart(gathering.endDate)}
              </h4>
              <div className="flex items-center font-normal gap-2 text-white">
                <Image
                  src="/assets/image/person.svg"
                  alt="참여자 아이콘"
                  width={18}
                  height={18}
                  className="w-4 h-4 md:w-[18px] md:h-[18px]"
                />
                <span>
                  {gathering.participantCount}/{gathering.totalCount}
                </span>
              </div>
            </div>
            <div className="w-[122px] h-[32px] md:w-[163px] md:h-[43px]">
              <Button
                name="방명록 작성하기"
                style="custom"
                className="w-[122px] h-[32px] md:w-[163px] md:h-[43px] text-sm md:text-base"
                handleButtonClick={() => onWriteClick(gathering.gatheringId)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
