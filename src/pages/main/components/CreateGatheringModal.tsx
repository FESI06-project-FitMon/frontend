import apiRequest from '@/utils/apiRequest';
import Modal from '@/components/dialog/Modal';
import { useState } from 'react';
import Step from './Step';
import ChoiceMainTypeModal from './ChoiceMainTypeModal';
import { CreateChallenge, CreateGatheringForm } from '@/types';
import Button from '@/components/common/Button';
import Image from 'next/image';
import GatheringInfomationModal from './GatheringInfomationModal';
import ChallengeInfomationModal from './ChallengeInfomationModal';

interface CreateGatheringProps {
  setShowModal: () => void;
}

const initialState: CreateGatheringForm = {
  title: '',
  description: '',
  mainType: '유산소형',
  subType: '',
  imageUrl: null,
  startDate: null,
  endDate: null,
  mainLocation: '',
  subLocation: '',
  totalCount: 0,
  minCount: 5,
  tags: [],
  challenges: [
    {
      title: '',
      description: '',
      imageUrl: null,
      maxPeopleCount: 0,
      startDate: null,
      endDate: null,
    },
  ],
};

export default function CreateGathering({
  setShowModal,
}: CreateGatheringProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateGatheringForm>(initialState);

  console.log(formData);

  const stepTitles = [
    '모임에 오신 걸 환영해요! 🎉',
    '모임 정보를 입력해주세요.',
    '챌린지를 선택해주세요.',
    '모임 생성을 완료했어요!',
  ];

  const updateFormData = <K extends keyof CreateGatheringForm>(
    key: K,
    value: CreateGatheringForm[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChallengeUpdate = (updatedChallenge: CreateChallenge) => {
    setFormData((prev) => ({
      ...prev,
      challenges: [updatedChallenge],
    }));
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.mainType !== '';
    }
    if (currentStep === 1) {
      return (
        formData.title.trim() !== '' &&
        formData.description.trim() !== '' &&
        formData.startDate !== null &&
        formData.endDate !== null
      );
    }
    if (currentStep === 2) {
      const challenge = formData.challenges[0];
      return (
        challenge?.title.trim() !== '' &&
        challenge?.description.trim() !== '' &&
        challenge?.startDate !== null &&
        challenge?.endDate !== null
      );
    }
    return true;
  };

  const handlePostGathering = async () => {
    try {
      const response = await apiRequest<CreateGatheringForm>({
        param: '/api/v1/gatherings',
        method: 'post',
        requestData: formData,
      });
      console.log('POST 성공:', response);
      setCurrentStep((prev) => Math.min(prev + 1, 3)); // 3단계로 이동
    } catch (error) {
      console.error('POST 실패:', error);
      alert('모임 생성을 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      // 2단계에서 POST 요청
      handlePostGathering();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  return (
    <Modal title={stepTitles[currentStep]} onClose={setShowModal}>
      <div className="relative">
        {/* 이전 버튼 */}
        {currentStep > 0 && (
          <div
            className="absolute -top-10 -left-1 cursor-pointer"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          >
            <Image
              src="/assets/image/arrow-left.svg"
              alt="이전"
              width={20}
              height={20}
            />
          </div>
        )}

        {currentStep < 3 && <Step currentStep={currentStep} />}

        <div className="mt-4">
          {currentStep === 0 && (
            <ChoiceMainTypeModal
              onSelect={(mainType, subType) => {
                console.log('메인 타입:', mainType);
                console.log('서브 타입:', subType);
                updateFormData('mainType', mainType);
                updateFormData('subType', subType);
              }}
            />
          )}
          {currentStep === 1 && (
            <GatheringInfomationModal
              onChange={(updatedData) =>
                setFormData((prev) => ({
                  ...prev,
                  ...updatedData,
                }))
              }
            />
          )}
          {currentStep === 2 && (
            <ChallengeInfomationModal onChange={handleChallengeUpdate} />
          )}
          {currentStep === 3 && (
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                모임이 성공적으로 생성되었습니다!
              </h1>
              <p>모임과 관련된 추가 정보를 확인하거나 수정할 수 있습니다.</p>
            </div>
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <div className="flex w-full mt-6">
              <Button
                name="다음"
                handleButtonClick={handleNextStep}
                style={isStepValid() ? 'default' : 'disabled'}
                className="w-full h-[52px]"
              />
            </div>
          ) : (
            <div className="text-center mt-4">완료~</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
