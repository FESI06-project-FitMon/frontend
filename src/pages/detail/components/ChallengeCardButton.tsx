import Button from '@/components/common/Button';
import Modal from '@/components/dialog/Modal';
import ChallengeCertificationModal from './ChallengeCertificationModal';
import useToastStore from '@/stores/useToastStore';
import { useState } from 'react';
import { participantChallenge } from '../api/challengeApi';
import { AxiosError } from 'axios';

export default function ChallengeCardButton({
  inProgress,
  challengeId,
  participantStatus,
  verificationStatus,
}: {
  inProgress: boolean;
  challengeId: number;
  participantStatus: boolean;
  verificationStatus: boolean;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [isParticipant, setIsParticipant] = useState(participantStatus);
  const [isVerificated, setIsVerificated] = useState(verificationStatus);
  const showToast = useToastStore((state) => state.show);

  const handleGatheringButtonClick = () => {
    setOpenModal(true);
  };

  const handleParticipantChallengeButtonClick = async () => {
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
        className="w-40 h-10 font-semibold text-base"
      />
    );
  }

  if (!isParticipant) {
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

  if (!isVerificated) {
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
      className="bg-dark-700 w-40 h-10 font-semibold text-base "
    />
  );
}
