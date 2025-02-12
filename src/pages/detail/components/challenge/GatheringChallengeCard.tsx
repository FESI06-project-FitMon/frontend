import Popover from '@/components/common/Popover';
import Image from 'next/image';
import BarChart from '@/components/chart/BarChart';
import { ChallengeProps } from '@/types';
import ChallengeCardButton from './ChallengeCardButton';
import useToastStore from '@/stores/useToastStore';
import { AxiosError } from 'axios';
import { useChallengeDelete } from '../../service/gatheringService';
import { useQueryClient } from '@tanstack/react-query';

export default function GatheringChallengeCard({
  gatheringId,
  challenge,
  inProgress,
}: {
  gatheringId: number;
  challenge: ChallengeProps;
  inProgress: boolean;
}) {
  const showToast = useToastStore((state) => state.show);

  const queryClient = useQueryClient();
  const { mutate } = useChallengeDelete(
    gatheringId,
    challenge.challengeId,
    queryClient,
    inProgress,
  );

  const handleChallengeDeleteButtonClick = async () => {
    try {
      mutate();
      showToast('챌린지 삭제를 완료했습니다.', 'check');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.message, 'error');
      }
    }
  };

  if (!challenge) return;
  return (
    <div className="w-full h-[463px] md:h-[188px] lg:h-[250px] bg-dark-200 rounded-[10px]">
      <div className="w-full flex flex-col md:flex-row ">
        {/* 좌측 사진 */}
        <div className="h-[188px] md:w-[200px] lg:w-[258px] lg:h-[250px] relative md:absolute ">
          <Image
            className="rounded-bl-[10px] rounded-tl-[10px] w-full h-full"
            src={
              challenge.imageUrl
                ? challenge.imageUrl
                : 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
            }
            alt="alt"
            fill
          />
        </div>
        {/* 우측 설명 */}
        <div className="px-[20px] md:ml-[220px] lg:ml-[308px] mr-[30px] w-full">
          <div className="flex flex-col mt-5 lg:mt-[30px] lg:mb-[20px] gap-[10px] w-full">
            <div className="w-full flex justify-between">
              {/* 날짜 */}
              <p className="text-sm text-dark-700">
                {`${challenge.startDate.substring(0, 10)} ~ ${challenge.endDate.substring(0, 10)}`}
              </p>
              {/* 모임장만 보이는 설정 버튼 */}
              {challenge.captainStatus && (
                <Popover
                  items={[
                    {
                      id: 'delete',
                      label: '삭제하기',
                      onClick: () => handleChallengeDeleteButtonClick(),
                    },
                  ]}
                  type="dot"
                />
              )}
            </div>
            {/* 제목, 설명 */}
            <p className="text-base lg:text-2xl font-semibold">
              {challenge.title}
            </p>
            <p className="text-sm lg:text-base text-dark-700 h-[42px] lg:h-[50px]">
              {challenge.description}
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-[70%] lg:w-[608px] md:mr-8 mr-[92px]">
              <div className="flex justify-between">
                {/* 인원 수 정보 */}
                <div className="flex items-center justify-center gap-[6px] mb-[15px]">
                  <Image
                    src="/assets/image/person.svg"
                    alt="참여자 아이콘"
                    width={28}
                    height={28}
                    className="w-[22px] h-[22px] lg:w-[28px] lg:h-[28px]"
                  />
                  <p className="text-sm lg:text-base">{`${challenge.successParticipantCount}/${challenge.participantCount}`}</p>
                </div>
                {/* 퍼센트 */}
                <p className="text-xl lg:text-2xl text-primary font-bold">
                  챌린지 성공률&nbsp;
                  {challenge.successParticipantCount === 0
                    ? 0
                    : parseFloat(
                        (
                          (challenge.successParticipantCount /
                            challenge.participantCount) *
                          100
                        ).toFixed(2),
                      )}
                  %
                </p>
              </div>
              <BarChart
                total={challenge.participantCount}
                value={challenge.successParticipantCount}
              />
            </div>
            {/* 참여했다면 인증하기 버튼, 참여하지 않았다면 참여하기 버튼 */}
            <ChallengeCardButton
              inProgress={inProgress}
              gatheringId={gatheringId}
              challengeId={challenge.challengeId}
              participantStatus={challenge.participantStatus}
              verificationStatus={challenge.verificationStatus}
              className={'mt-5 md:mt-0'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
