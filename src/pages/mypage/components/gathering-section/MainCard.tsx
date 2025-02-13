import { memo, useState } from 'react';
import Image from 'next/image';
import StatusTag from '@/components/tag/StatusTag';
import OpenStatus from '@/components/tag/OpenStatus';
import Button from '@/components/common/Button';
import Alert from '@/components/dialog/Alert';
import { GatheringListItem } from '@/types';
import useToastStore from '@/stores/useToastStore';
import getDatePart from '@/utils/getDatePart';
import { useGuestbooks } from '@/pages/mypage/service/myGuestbooks';
import { DEFAULT_IMAGE } from '@/constants/imgConfig';

interface MainCardProps {
  gathering: GatheringListItem;
  cancelProps: {
    onCancelGathering?: (gatheringId: number) => void;
    onCancelParticipation?: (gatheringId: number) => void;
  };
}

export default memo(function MainCard({
  gathering,
  cancelProps: { onCancelGathering, onCancelParticipation },
}: MainCardProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [, setIsLoading] = useState(false);
  const { show: showToast } = useToastStore(); // 수정: 객체 구조분해할당으로 변경

  // 방명록 데이터 가져오기
  const { data: guestbooksData } = useGuestbooks();

  // 해당 모임에 대한 방명록이 있는지 확인
  const hasGuestbook = guestbooksData?.content?.some(
    guestbook => guestbook.gatheringId === gathering.gatheringId
  );

  if (!gathering) {
    console.error('No gathering provided to MainCard');
    return null;
  }

  const handleCancelClick = () => {
    // 방명록이 있고 모임장이 아닌 경우
    if (hasGuestbook && !gathering.captainStatus) {
      showToast?.('방명록이 작성되어 참여취소가 불가능합니다.', 'caution');
      return;
    }
    setShowAlert(true);
  };

  const handleCancelConfirm = async () => {
    // 한번 더 체크 (안전장치)
    if (hasGuestbook && !gathering.captainStatus) {
      showToast?.('방명록이 작성되어 참여 취소가 불가능합니다.', 'caution');
      return;
    }

    setIsLoading(true);
    try {
      if (gathering.captainStatus) {
        await onCancelGathering?.(gathering.gatheringId);
      } else {
        await onCancelParticipation?.(gathering.gatheringId);
      }
      showToast?.('취소되었습니다.', 'check');
    } catch (error) {
      console.error('취소 실패:', error);
      showToast?.('취소에 실패했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsLoading(false);
      setShowAlert(false);
    }
  };

  const handleCancelDeny = () => {
    setShowAlert(false);
    showToast?.('취소가 중단되었습니다.', 'caution');
  };

  return (
    <div className="flex flex-col justify-center md:justify-start md:flex-row md:w-[696px] lg:w-[906px] md:h-[200px] gap-2.5 md:gap-6 lg:gap-[30px]">
      <div className="relative w-full md:w-[228px] lg:w-[300px] h-[150px] sm:h-[200px] overflow-hidden rounded-[20px]">
        <Image
          src={gathering.imageUrl || DEFAULT_IMAGE}
          alt={gathering.title || '기본 이미지'}
          width={300}
          height={200}
          priority //
          quality={75} 
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute bottom-4 left-5">
          <StatusTag status={gathering.status} />
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1 md:px-0 py-1 lg:py-5">
        <h3 className="text-primary text-xs md:text-base font-normal mb-2.5 md:mb-3.5">
          {gathering.subType} | {gathering.mainLocation} {gathering.subLocation}
        </h3>
        <h2 className="text-sm md:text-xl font-bold mb-3.5">{gathering.title}</h2>
        <div className="flex text-xs md:text-base items-center gap-[13px] text-dark-700 mb-2.5 sm:mb-[15px] lg:mb-5">
          <h4>
            {getDatePart(gathering.startDate)} ~ {getDatePart(gathering.endDate)}
          </h4>
          <div className="flex items-center font-normal gap-2 text-white">
            <Image
              src="/assets/image/person.svg"
              alt="참여자 아이콘"
              width={18}
              height={18}
            />
            <span>
              {gathering.participantCount}/{gathering.totalCount}
            </span>
          </div>
          <OpenStatus gatheringJoinedPeopleCount={gathering.participantCount} />
        </div>
        <div className="w-[122px] h-8 md:w-[163px] md:h-[43px]">
          <Button
            name={gathering.captainStatus ? '모임 취소하기' : '참여 취소하기'}
            style={gathering.captainStatus ? 'custom' : 'cancel'}
            className={`
              w-[122px] h-8 md:w-[163px] md:h-[43px] text-sm md:text-base
              ${gathering.captainStatus
                ? ''
                : (hasGuestbook
                  ? '!text-dark-700 !outline-dark-700 cursor-not-allowed'
                  : 'text-primary font-semibold')
              }
            `}
            handleButtonClick={handleCancelClick}
          />
        </div>
      </div>

      {showAlert && (
        <Alert
          isOpen={showAlert}
          type="select"
          message={
            gathering.captainStatus
              ? '모임을 취소하시겠습니까? 모임을 취소하면 모집된 인원들도 취소됩니다.'
              : '참여를 취소하시겠습니까?'
          }
          onConfirm={handleCancelConfirm}
          onCancel={handleCancelDeny}
        />
      )}
    </div>
  );
});