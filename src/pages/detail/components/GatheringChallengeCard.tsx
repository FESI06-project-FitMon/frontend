import Button from '@/components/common/Button';
import Modal from '@/components/dialog/Modal';
import useGatheringStore from '@/stores/useGatheringStore';
import useToastStore from '@/stores/useToastStore';
import { AxiosError } from 'axios';
import { useState } from 'react';
import ChallengeCertificationModal from './ChallengeCertificationModal';
import Popover from '@/components/common/Popover';
import Image from 'next/image';
import BarChart from '@/components/chart/BarChart';
import { ChallengeProps } from '@/types';

export default function GatheringChallengeCard({
  challenge,
  inProgress,
}: {
  challenge: ChallengeProps;
  inProgress: boolean;
}) {
  const [openModal, setOpenModal] = useState(false);
  const { participantChallenge } = useGatheringStore();
  const showToast = useToastStore((state) => state.show);

  const handleGatheringButtonClick = () => {
    setOpenModal(true);
  };

  const handleParticipantChallengeButtonClick = async () => {
    try {
      await participantChallenge(challenge.challengeId);
      showToast('챌린지에 참가하였습니다.', 'check');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
  };

  const handleChallengeDeleteButtonClick = () => {};

  const button = () => {
    if (!inProgress) {
      return (
        <Button
          style="disabled"
          name="마감된 챌린지"
          className="w-40 h-10 font-semibold text-base"
        />
      );
    }
    if (!challenge.participantStatus) {
      return (
        <Button
          style="custom"
          name="참여하기"
          className="w-40 h-10 font-semibold text-base"
          handleButtonClick={() => {
            handleParticipantChallengeButtonClick();
          }}
        />
      );
    }

    if (!challenge.verificationStatus) {
      return (
        <>
          <Button
            style="custom"
            name="인증하기"
            className="w-40 h-10 font-semibold text-base"
            handleButtonClick={() => handleGatheringButtonClick()}
          />
          <>
            {openModal && (
              <Modal title="챌린지 인증" onClose={() => setOpenModal(false)}>
                <ChallengeCertificationModal
                  challengeId={challenge.challengeId}
                  setOpenModal={setOpenModal}
                />
              </Modal>
            )}
          </>
        </>
      );
    }

    return (
      <Button
        style="disabled"
        name="인증완료"
        className="bg-dark-700 w-40 h-10 font-semibold text-base "
      />
    );
  };

  if (!challenge) return;

  return (
    <div className="w-full h-[250px] bg-dark-200 rounded-[10px]">
      <div className="flex">
        {/* 좌측 사진 */}
        <Image
          className="rounded-bl-[10px] rounded-tl-[10px] "
          src={
            challenge.imageUrl
              ? challenge.imageUrl
              : 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
          }
          alt="alt"
          width={258}
          height={250}
        />
        {/* 우측 설명 */}
        <div className="w-full ml-[50px] mr-[30px]">
          <div className="flex flex-col mt-[30px] mb-[20px] gap-[10px]">
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
            <div className="w-[608px]">
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
            {button()}
          </div>
        </div>
      </div>
    </div>
  );
}
