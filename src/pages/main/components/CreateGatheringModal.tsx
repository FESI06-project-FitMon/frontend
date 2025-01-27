import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import Step from './Step';
import StepContent from './StepContent';
import { useCreateGatheringForm } from '@/pages/main/hooks/useCreateGatheringForm';
import { createGathering } from '@/pages/main/service/gatheringService';
import { isStepValid } from '@/utils/stepValidation';
import Image from 'next/image';

interface CreateGatheringProps {
  setShowModal: () => void;
}

export default function CreateGathering({
  setShowModal,
}: CreateGatheringProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    handleChallengeUpdate,
  } = useCreateGatheringForm();

  const handleNextStep = async () => {
    if (currentStep === 2) {
      try {
        await createGathering(formData);
        setCurrentStep((prev) => calculateNextStep(prev));
      } catch (error) {
        console.error('모임 생성 중 오류:', error);
      }
    } else if (currentStep === 3) {
      setShowModal();
    } else {
      setCurrentStep((prev) => calculateNextStep(prev));
    }
  };

  const calculateNextStep = (currentStep: 0 | 1 | 2 | 3): 0 | 1 | 2 | 3 => {
    const nextStep = Math.min(currentStep + 1, 3);
    if (nextStep === 0 || nextStep === 1 || nextStep === 2 || nextStep === 3) {
      return nextStep;
    }
    return 0;
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => {
      if (prev === 0) return 0;
      if (prev === 1) return 0;
      if (prev === 2) return 1;
      return 0;
    });
  };

  return (
    <Modal
      title={
        [
          '모임에 오신 걸 환영해요! 🎉',
          '모임 정보를 입력해주세요.',
          '챌린지를 선택해주세요.',
          '모임 생성이 완료됐어요!',
        ][currentStep]
      }
      onClose={setShowModal}
    >
      <div className="relative text-sm md:text-base">
        {/* 이전 버튼 */}
        {currentStep > 0 && (
          <div
            className="fixed left-4 top-9 md:absolute md:-top-10 md:-left-1 cursor-pointer"
            onClick={handlePreviousStep}
          >
            <Image
              src="/assets/image/arrow-left.svg"
              alt="이전"
              width={20}
              height={20}
            />
          </div>
        )}

        {/* Step 컴포넌트 조건부 렌더링 */}
        {currentStep < 3 && <Step currentStep={currentStep} />}

        <div className="mt-4 overflow-y-auto flex flex-col justify-center max-h-[65vh] md:h-auto md:overflow-visible ">
          <StepContent
            currentStep={currentStep}
            formData={formData}
            updateFormData={updateFormData}
            handleChallengeUpdate={handleChallengeUpdate}
          />
        </div>

        <Button
          name={currentStep < 3 ? '다음' : '완료'}
          handleButtonClick={handleNextStep}
          style={isStepValid(currentStep, formData) ? 'default' : 'disabled'}
          className="w-full h-[52px] block mt-6"
        />
      </div>
    </Modal>
  );
}
