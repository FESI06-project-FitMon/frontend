import Popover from '@/components/common/Popover';
import Image from 'next/image';
import BarChart from '@/components/chart/BarChart';
import { ChallengeProps } from '@/types';
import ChallengeCardButton from './ChallengeCardButton';
import useToastStore from '@/stores/useToastStore';
import { deleteChallenge } from '../api/challengeApi';
import { AxiosError } from 'axios';

export default function GatheringChallengeCard({
  challenge,
  inProgress,
}: {
  challenge: ChallengeProps;
  inProgress: boolean;
}) {
  const showToast = useToastStore((state) => state.show);

  const handleChallengeDeleteButtonClick = async () => {
    try {
      await deleteChallenge(challenge.challengeId);
      showToast('챌린지 삭제를 완료했습니다.', 'check');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.message, 'error');
      }
    }
  };

  if (!challenge) return;

  console.log(challenge);
  return (
    <div className="w-full h-[250px] bg-dark-200 rounded-[10px]">
      <div className="flex ">
        {/* 좌측 사진 */}
        <div className="w-[258px]  h-[250px] relative ">
          <Image
            className="rounded-bl-[10px] rounded-tl-[10px] l w-full h-full"
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
        <div className="ml-[50px] mr-[30px] ">
          <div className="flex flex-col mt-[30px] mb-[20px] gap-[10px] w-full">
            <div className="flex justify-between">
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
            <p className="text-2xl font-semibold">{challenge.title}</p>
            <p className="text-dark-700 h-[50px]">{challenge.description}</p>
          </div>
          <div className="w-full flex justify-between">
            <div className="w-[608px] mr-[92px]">
              <div className="flex justify-between">
                {/* 인원 수 정보 */}
                <div className="flex items-center justify-center gap-[6px] mb-[15px]">
                  <Image
                    src="/assets/image/person.svg"
                    alt="참여자 아이콘"
                    width={28}
                    height={28}
                  />
                  <p>{`${challenge.successParticipantCount}/${challenge.participantCount}`}</p>
                </div>
                {/* 퍼센트 */}
                <p className="text-2xl text-primary font-bold">
                  챌린지 성공률&nbsp;
                  {challenge.successParticipantCount === 0
                    ? 0
                    : (challenge.successParticipantCount /
                        challenge.participantCount) *
                      100}
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
              challengeId={challenge.challengeId}
              participantStatus={challenge.participantStatus}
              verificationStatus={challenge.verificationStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
