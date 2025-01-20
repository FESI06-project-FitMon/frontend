import { useState } from 'react';
import Image from 'next/image';
import StatusTag from '@/components/tag/StatusTag';
import OpenStatus from '@/components/tag/OpenStatus';
import Button from '@/components/common/Button';
import Alert from '@/components/dialog/Alert';
import { GatheringItem, GatheringStateType } from '@/types';
import useToastStore from '@/stores/useToastStore';

interface MainCardProps {
  gathering: GatheringItem;
  state: GatheringStateType;
  onCancelGathering?: (gatheringId: number) => void;  // 모임장용
  onCancelParticipation?: (gatheringId: number) => void;
}

export default function MainCard({ gathering, state, onCancelGathering, onCancelParticipation }: MainCardProps) {
  const [showAlert, setShowAlert] = useState(false);
  const showToast = useToastStore((state) => state.show);
  // gathering 객체가 유효한지 확인
  if (!gathering || !gathering.gatheringImage) {
    return null; // 또는 기본 UI 렌더링
  }
  const handleCancelClick = () => {
    setShowAlert(true);
  };


  const handleCancelConfirm = () => {
    if (gathering.captainStatus) {
      onCancelGathering?.(gathering.gatheringId);
    } else {
      onCancelParticipation?.(gathering.gatheringId);
    }
    setShowAlert(false);
    showToast('취소되었습니다.', 'check');
  };
  const handleCancelDeny = () => {
    setShowAlert(false);
    showToast('취소가 중단되었습니다.', 'caution');
  };

  return (
    <div className="flex flex-col justify-center md:justify-start md:flex-row md:w-[696px] lg:w-[906px] md:h-[200px] gap-[10px] md:gap-[24px] lg:gap-[30px]">
      {/* 이미지 영역 */}
      <div className="relative w-full md:w-[228px] lg:w-[300px] h-[150px] sm:h-[200px] overflow-hidden rounded-[20px]">
        <Image
          src={
            gathering.gatheringImage === 'null' || !gathering.gatheringImage
              ? '/assets/image/default_img.png'
              : gathering.gatheringImage
          }
          alt={gathering.gatheringTitle || '기본 이미지'}
          width={300}
          height={200}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/assets/image/default_img.png';
          }}
        />
        <div className="absolute bottom-4 left-5">
          <StatusTag status={gathering.gatheringStatus} />
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col flex-1 px-[4px] md:px-0 py-[4px] lg:py-[20px] ">
        <h3 className="text-primary text-xs md:text-base font-normal mb-1 md:mb-3.5">
          {gathering.gatheringSubType} | {gathering.gatheringSi} {gathering.gatheringGu}
        </h3>
        <h2 className="text-sm md:text-xl font-bold mb-3.5">{gathering.gatheringTitle}</h2>
        <div className="flex text-xs md:text-base items-center gap-[13px] text-dark-700 mb-[10px] sm:mb-[15px] lg:mb-[20px]">
          <h4>{gathering.gatheringStartDate} ~ {gathering.gatheringEndDate}</h4>
          <div className="flex items-center font-normal gap-2 text-white">
            <Image
              src="/assets/image/person.svg"
              alt="참여자 아이콘"
              width={18}
              height={18}
            />
            <span>{state.gatheringJoinedPeopleCount}/{state.gatheringMaxPeopleCount}</span>
          </div>
          <OpenStatus gatheringJoinedPeopleCount={state.gatheringJoinedPeopleCount} />
        </div>
        <div className="w-[122px] h-[32px] md:w-[163px] md:h-[43px]">
          <Button
            name={gathering.captainStatus ? "모임 취소하기" : "참여 취소하기"}
            style={gathering.captainStatus ? "custom" : "cancel"}
            className={gathering.captainStatus
              ? "w-[122px] h-[32px] md:w-[163px] md:h-[43px]  text-sm md:text-base "
              : "w-[122px] h-[32px] md:w-[163px] md:h-[43px]  text-sm md:text-base text-primary font-semibold"}
            handleButtonClick={handleCancelClick}
          />
        </div>
      </div>

      <Alert
        isOpen={showAlert}
        type="select"
        message={gathering.captainStatus
          ? "모임을 취소하시겠습니까? 모임을 취소하면 모집된 인원들도 취소됩니다."
          : "참여를 취소하시겠습니까?"}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDeny}
      />

    </div>
  );
}