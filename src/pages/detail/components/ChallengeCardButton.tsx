import Button from '@/components/common/Button';
import Modal from '@/components/dialog/Modal';
import ChallengeCertificationModal from './ChallengeCertificationModal';
import useToastStore from '@/stores/useToastStore';
import { useState } from 'react';
import { AxiosError } from 'axios';
import useMemberStore from '@/stores/useMemberStore';
import { useRouter } from 'next/router';
import { participantChallenge } from '../api/challengeApi';

export default function ChallengeCardButton({
  inProgress,
  gatheringId,
  challengeId,
  participantStatus,
  verificationStatus,
  className,
}: {
  inProgress: boolean;
  gatheringId: number;
  challengeId: number;
  participantStatus: boolean;
  verificationStatus: boolean;
  className?: string;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [isParticipant, setIsParticipant] = useState(participantStatus);
  const [isVerificated, setIsVerificated] = useState(verificationStatus);
  const showToast = useToastStore((state) => state.show);

  const handleGatheringButtonClick = () => {
    setOpenModal(true);
  };

  const { isLogin } = useMemberStore();
  const router = useRouter();

  const handleParticipantChallengeButtonClick = async () => {
    if (!isLogin) {
      showToast('챌린지에 참여하려면 로그인 해주세요.', 'caution');
      router.push('/login');
      return;
    }

    try {
      await participantChallenge(challengeId);
      showToast('챌린지에 참가하였습니다.', 'check');
      setIsParticipant(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
  };

  if (!inProgress) {
    return (
      <Button
        style="disabled"
        name="마감된 챌린지"
        className={`${className} w-full h-[42px] md:w-[120px] md:h-9 lg:w-40 lg:h-10 font-semibold text-base`}
      />
    );
  }

  if (!isParticipant) {
    return (
      <Button
        style="custom"
        name="참여하기"
        className={`${className} w-full h-[42px] md:w-[120px] md:h-9 lg:w-40 lg:h-10 font-semibold text-base`}
        handleButtonClick={() => {
          handleParticipantChallengeButtonClick();
        }}
      />
    );
  }

  if (!isVerificated) {
    return (
      <>
        <Button
          style="cancel"
          name="인증하기"
          className={`w-full h-[42px] md:w-[120px] md:h-9 lg:w-40 lg:h-10 font-semibold text-base ${className}`}
          handleButtonClick={() => handleGatheringButtonClick()}
        />
        <>
          {openModal && (
            <Modal title="챌린지 인증" onClose={() => setOpenModal(false)}>
              <ChallengeCertificationModal
                gatheringId={gatheringId}
                challengeId={challengeId}
                setOpenModal={setOpenModal}
                setIsVerificated={setIsVerificated}
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
      className={`bg-dark-700 w-full h-[42px] md:w-[120px] md:h-9 lg:w-40 lg:h-10 font-semibold text-base ${className}`}
    />
  );
}
