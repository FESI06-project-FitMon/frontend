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
    <div className="space-y-6">
      {gatherings.map((gathering) => (
        <div key={gathering.gatheringId} className="flex gap-[30px]">
          <div className="relative w-[300px] h-[200px]">
            <Image
              src={gathering.gatheringImage === "null"
                ? '/assets/image/default_img.png'
                : gathering.gatheringImage}
              alt={gathering.gatheringTitle}
              width={300}
              height={200}
              className="rounded-[20px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/image/default_img.png';
              }}
            />
          </div>

          <div className="flex flex-col flex-1 py-[19px]">
            <h3 className="text-primary font-normal mb-3.5">
              {gathering.gatheringSubType} | {gathering.gatheringSi} {gathering.gatheringGu}
            </h3>
            <h2 className="text-xl font-bold mb-3.5">{gathering.gatheringTitle}</h2>
            <div className="flex items-center gap-[13px] text-dark-700 mb-[21px]">
              <h4>{gathering.gatheringStartDate} ~ {gathering.gatheringEndDate}</h4>
              <div className="flex items-center font-normal gap-2 text-white">
                <Image
                  src="/assets/image/person.svg"
                  alt="참여자 아이콘"
                  width={18}
                  height={18}
                />
                <span>
                  {gatheringStates[gathering.gatheringId]?.gatheringJoinedPeopleCount}/
                  {gatheringStates[gathering.gatheringId]?.gatheringMaxPeopleCount}
                </span>
              </div>
            </div>
            <Button
              name="방명록 작성하기"
              style="custom"
              className="w-[163px] h-[43px] text-base"
              handleButtonClick={() => onWriteClick(gathering.gatheringId)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}