import BarChart from '@/components/chart/BarChart';
import Button from '@/components/common/Button';
import Heart from '@/components/common/Heart';
import OpenStatus from '@/components/tag/OpenStatus';
import { GatheringStateType } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function GatheringState({
  state,
}: {
  state: GatheringStateType;
}) {
  const gatheringId = 1;
  const [heart, setHeart] = useState<boolean>(false);
  useEffect(() => {
    setHeart(
      localStorage.getItem('zzims') &&
        JSON.parse(localStorage.getItem('zzims')!).includes(gatheringId),
    );
  }, [gatheringId]);

  if (!state) {
    return <div>{'Loading..'}</div>;
  }

  const handleGatheringButtonClick = () => {};
  const handleZzimButtonClick = () => {
    setHeart(!heart);
    const zzims = localStorage.getItem('zzims');
    let zzimArray: Array<number> = zzims ? JSON.parse(zzims) : [];
    // 이미 로컬스토리지에 있다면,
    if (zzimArray.indexOf(gatheringId) !== -1) {
      zzimArray = zzimArray.filter((zzim: number) => zzim !== gatheringId);
      localStorage.setItem('zzims', JSON.stringify(zzimArray));
      return;
    }
    localStorage.setItem('zzims', JSON.stringify([...zzimArray, gatheringId]));
  };
  const handleShareButtonClick = () => {};

  return (
    <div
      id="gathering-state"
      className="flex items-center mt-[25px] justify-between"
    >
      {/* 모임 만족도와 평균 평점 */}
      <div id="rating">
        <h3 className="mb-[18px] font-bold">{'모임 만족도'}</h3>
        <div className="flex">
          <Heart rating={state.gatheringAverageRating} />
          <span className="ml-[10px]">{`${state.gatheringAverageRating} / 5.0`}</span>
        </div>
        <div className="text-sm mt-[18px]">{`총 ${state.gatheringGuestbookCount}개의 방명록`}</div>
      </div>
      <div className="flex">
        <div className="gap-[15px] w-[388px]">
          <div className="flex justify-between items-center">
            <div id="joined-people" className="flex items-center">
              {/* 참가자 5인 프로필 이미지 */}
              <div className="flex -space-x-[10px]">
                {state.gatheringJoinedFivePeopleImages?.map((image, index) => (
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
                {state.gatheringJoinedPeopleCount >= 5 && (
                  <div className="w-[29px] h-[29px] text-center content-center bg-white text-black text-sm font-extrabold rounded-full">
                    +{state.gatheringJoinedPeopleCount - 5}
                  </div>
                )}
              </div>

              {/* 참가자 수 안내 */}
              <div className="flex justify-center items-center ml-3">
                <p className="text-primary text-sm font-semibold">
                  {`${state.gatheringJoinedPeopleCount}명`}
                </p>
                <p className="text-sm font-semibold">{'이 참가하고 있어요'}</p>
              </div>
            </div>

            {/* 개설 상태 안내 */}
            <OpenStatus
              className="h-5"
              gatheringJoinedPeopleCount={state.gatheringJoinedPeopleCount}
            />
          </div>

          {/* 참가자 상태 바 */}
          <div className="my-[15px]">
            <BarChart
              total={state.gatheringMaxPeopleCount}
              value={state.gatheringJoinedPeopleCount}
            />
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-dark-700 mt-[15px]">{`최소 ${state.gatheringMinPeopleCount}명`}</p>
            <p className="text-sm text-dark-700 mt-[15px]">{`최대 ${state.gatheringMaxPeopleCount}명`}</p>
          </div>
        </div>
        <div className="flex mb-auto h-[56px]" id="buttons">
          <Button
            className="ml-[25px] w-[242px]"
            style="custom"
            height="100%"
            name="참여하기"
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
