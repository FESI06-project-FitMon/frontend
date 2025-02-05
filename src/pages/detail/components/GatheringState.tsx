import BarChart from '@/components/chart/BarChart';
import Button from '@/components/common/Button';
import Heart from '@/components/common/Heart';
import OpenStatus from '@/components/tag/OpenStatus';
import useToastStore from '@/stores/useToastStore';
import {
  addGatheringId,
  gatheringIdInLikes,
  removeGatheringId,
} from '@/utils/likesgathering';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useGatheringStatus } from '../service/gatheringService';
import Null from '@/components/common/Null';
import { cancelGathering, participantGathering } from '../api/gatheringApi';

export default function GatheringState({
  gatheringId,
  participantStatus,
}: {
  gatheringId: number;
  participantStatus: boolean;
}) {
  const showToast = useToastStore((state) => state.show);
  const [heart, setHeart] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState(participantStatus);
  const {
    data: gatheringStatus,
    isLoading,
    error,
  } = useGatheringStatus(gatheringId);

  // 좋아요 초기 상태 세팅
  useEffect(() => {
    setHeart(gatheringIdInLikes(gatheringId));
  }, [gatheringId]);

  // 참여하기 버튼 클릭 핸들러
  const handleGatheringButtonClick = async () => {
    try {
      if (isParticipant) {
        await cancelGathering(gatheringId);
        showToast('참여취소 완료되었습니다.', 'check');
        setIsParticipant(false);
      } else {
        await participantGathering(gatheringId);
        showToast('참여하기 완료되었습니다.', 'check');
        setIsParticipant(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
  };

  // 찜 버튼 클릭 핸들러
  const handleZzimButtonClick = () => {
    setHeart(!heart);

    if (gatheringIdInLikes(gatheringId)) {
      removeGatheringId(gatheringId);
      return;
    }

    addGatheringId(gatheringId);
  };

  // 공유 버튼 클릭 핸들러
  const handleShareButtonClick = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => showToast('클립보드에 URL이 복사되었습니다.', 'check'))
      .catch(() => showToast('URL 복사를 실패했습니다.', 'error'));
  };

  if (isLoading || !gatheringStatus) {
    return <Null message="로딩중입니다." />;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <div
      id="gathering-state"
      className="flex items-center mt-[25px] justify-between"
    >
      {/* 모임 만족도와 평균 평점 */}
      <div id="rating">
        <h3 className="mb-[18px] font-bold">{'모임 만족도'}</h3>
        <div className="flex">
          <Heart rating={gatheringStatus.averageRating} />
          <span className="ml-[10px]">{`${gatheringStatus.averageRating.toFixed(1)} / 5.0`}</span>
        </div>
        <div className="text-sm mt-[18px]">{`총 ${gatheringStatus.guestBookCount}개의 방명록`}</div>
      </div>
      <div className="flex">
        <div className="gap-[15px] w-[388px]">
          <div className="flex justify-between items-center">
            <div id="joined-people" className="flex items-center">
              {/* 참가자 5인 프로필 이미지 */}
              <div className="flex -space-x-[10px]">
                {gatheringStatus.participants?.map((image, index) => (
                  <Image
                    key={index}
                    src="/assets/image/fitmon.png"
                    width={29}
                    height={29}
                    alt="profile"
                    className="rounded-full"
                  />
                ))}

                {/* 추가 인원 */}
                {gatheringStatus.participantCount >= 5 && (
                  <div className="w-[29px] h-[29px] text-center content-center bg-white text-black text-sm font-extrabold rounded-full">
                    +{gatheringStatus.participantCount - 5}
                  </div>
                )}
              </div>

              {/* 참가자 수 안내 */}
              <div className="flex justify-center items-center ml-3">
                <p className="text-primary text-sm font-semibold">
                  {`${gatheringStatus.participantCount}명`}
                </p>
                <p className="text-sm font-semibold">{'이 참가하고 있어요'}</p>
              </div>
            </div>

            {/* 개설 상태 안내 */}
            <OpenStatus
              className="h-5"
              gatheringJoinedPeopleCount={gatheringStatus.participantCount}
            />
          </div>

          {/* 참가자 상태 바 */}
          <div className="my-[15px]">
            <BarChart
              total={gatheringStatus.totalCount}
              value={gatheringStatus.participantCount}
            />
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-dark-700 mt-[15px]">{`최소 ${gatheringStatus.minCount}명`}</p>
            <p className="text-sm text-dark-700 mt-[15px]">{`최대 ${gatheringStatus.totalCount}명`}</p>
          </div>
        </div>
        <div className="flex mb-auto h-[56px]" id="buttons">
          <Button
            className="ml-[25px] w-[242px]"
            style="custom"
            height="100%"
            name={isParticipant ? '참여 취소' : '참여하기'}
            handleButtonClick={() => handleGatheringButtonClick()}
          />
          <div className="flex flex-col items-center justify-center ml-[20px]">
            <Image
              src={
                heart
                  ? '/assets/image/heart-fill.svg'
                  : '/assets/image/heart-zzim.svg'
              }
              width={28}
              height={28}
              alt="heart-zzim"
              onClick={() => handleZzimButtonClick()}
              className="hover:cursor-pointer"
            />
            <p className="text-sm mt-1">{'찜하기'}</p>
          </div>
          <div className="flex flex-col items-center justify-center ml-[21px]">
            <Image
              src="/assets/image/share.svg"
              width={28}
              height={28}
              alt="share"
              onClick={() => handleShareButtonClick()}
              className="hover:cursor-pointer"
            />
            <p className="text-sm mt-1">{'공유하기'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
