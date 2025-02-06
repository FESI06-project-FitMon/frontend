import { useEffect, useState, useCallback } from 'react';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import Step from './Step';
import StepContent from './StepContent';
import { useCreateGatheringForm } from '@/pages/main/hooks/useCreateGatheringForm';
import { createGathering } from '@/pages/main/service/gatheringService';
import { isStepValid } from '@/utils/stepValidation';
import Image from 'next/image';
import useDebounce from '@/hooks/useDebounce';

interface CreateGatheringProps {
  setShowCreateModal: () => void;
}

const LOCAL_STORAGE_KEY = 'gatheringFormData';

export default function CreateGathering({
  setShowCreateModal,
}: CreateGatheringProps) {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    updateFormData,
    handleChallengeUpdate,
  } = useCreateGatheringForm();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const debouncedFormData = useDebounce(formData, 500);

  const loadFormData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('로컬스토리지 데이터 로드 중 오류:', error);
    }
    setIsDataLoaded(true);
  }, [setFormData]);

  useEffect(() => {
    if (!isDataLoaded) {
      loadFormData();
    }
  }, [isDataLoaded, loadFormData]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(debouncedFormData),
      );
    }
  }, [debouncedFormData, isDataLoaded]);

  const calculateNextStep = (currentStep: 0 | 1 | 2 | 3): 0 | 1 | 2 | 3 => {
    return Math.min(currentStep + 1, 3) as 0 | 1 | 2 | 3;
  };

  const handleNextStep = async () => {
    if (currentStep === 2) {
      try {
        await createGathering(formData);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCurrentStep((prev) => calculateNextStep(prev));
      } catch (error) {
        console.error('모임 생성 중 오류:', error);
      }
    } else if (currentStep === 3) {
      setShowCreateModal();
    } else {
      setCurrentStep((prev) => calculateNextStep(prev));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0) as 0 | 1 | 2 | 3);
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
      onClose={setShowCreateModal}
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

        {/* Step 컴포넌트 */}
        {currentStep < 3 && <Step currentStep={currentStep} />}

        <div className="mt-4 overflow-y-auto flex flex-col justify-center max-h-[65vh] md:h-auto md:overflow-visible">
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
