import Button from "@/components/common/Button";
import Null from "@/components/common/Null";
import { GatheringItem, GatheringStateType } from "@/types";
import Image from 'next/image';

interface AvailableGuestbooksProps {
  gatherings: GatheringItem[];
  gatheringStates: { [key: number]: GatheringStateType };
  onWriteClick: (gatheringId: number) => void;
}

export default function AvailableGuestbooks({
  gatherings,
  gatheringStates,
  onWriteClick
}: AvailableGuestbooksProps) {
  if (gatherings.length === 0) {
    return <Null message="작성 가능한 방명록이 없습니다." />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {gatherings.map((gathering) => (
        <div 
          key={gathering.gatheringId} 
          className="flex flex-col justify-center md:justify-start md:flex-row md:w-[696px] lg:w-[906px] md:h-[200px] gap-[10px] md:gap-[24px] lg:gap-[30px]"
        >
          {/* 이미지 영역 */}
          <div className="relative w-full md:w-[228px] lg:w-[300px] h-[150px] sm:h-[200px] overflow-hidden rounded-[20px]">
            <Image
              src={gathering.gatheringImage === "null"
                ? '/assets/image/default_img.png'
                : gathering.gatheringImage}
              alt={gathering.gatheringTitle}
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

          {/* 정보 영역 */}
          <div className="flex flex-col flex-1 px-[4px] md:px-0 py-[4px] lg:py-[20px]">
            <h3 className="text-primary text-xs md:text-base font-normal mb-1 md:mb-3.5">
              {gathering.gatheringSubType} | {gathering.gatheringSi} {gathering.gatheringGu}
            </h3>
            <h2 className="text-sm md:text-xl font-bold mb-3.5">
              {gathering.gatheringTitle}
            </h2>
            <div className="flex text-xs md:text-base items-center gap-[13px] text-dark-700 mb-[10px] sm:mb-[15px] lg:mb-[20px]">
              <h4>{gathering.gatheringStartDate} ~ {gathering.gatheringEndDate}</h4>
              <div className="flex items-center font-normal gap-2 text-white">
                <Image
                  src="/assets/image/person.svg"
                  alt="참여자 아이콘"
                  width={18}
                  height={18}
                  className="w-4 h-4 md:w-[18px] md:h-[18px]"
                />
                <span>
                  {gatheringStates[gathering.gatheringId]?.gatheringJoinedPeopleCount}/
                  {gatheringStates[gathering.gatheringId]?.gatheringMaxPeopleCount}
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