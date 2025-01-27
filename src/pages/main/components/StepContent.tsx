import ChoiceMainTypeModal from './ChoiceMainTypeModal';
import GatheringInfomationModal from './GatheringInfomationModal';
import ChallengeInfomationModal from './ChallengeInfomationModal';
import Image from 'next/image';
import { CreateGatheringForm, CreateChallenge } from '@/types';

interface StepContentProps {
  currentStep: number;
  formData: CreateGatheringForm;
  updateFormData: <K extends keyof CreateGatheringForm>(
    key: K,
    value: CreateGatheringForm[K],
  ) => void;
  handleChallengeUpdate: (updatedChallenge: CreateChallenge) => void;
}

export default function StepContent({
  currentStep,
  formData,
  updateFormData,
  handleChallengeUpdate,
}: StepContentProps) {
  if (currentStep === 0) {
    return (
      <ChoiceMainTypeModal
        onSelect={(mainType, subType) => {
          updateFormData('mainType', mainType);
          updateFormData('subType', subType);
        }}
      />
    );
  }
  if (currentStep === 1) {
    return (
      <GatheringInfomationModal
        onChange={(updatedData: Partial<CreateGatheringForm>) => {
          Object.entries(updatedData).forEach(([key, value]) =>
            updateFormData(key as keyof CreateGatheringForm, value),
          );
        }}
      />
    );
  }
  if (currentStep === 2) {
    return (
      <ChallengeInfomationModal
        onChange={handleChallengeUpdate}
        gatheringEndDate={formData.endDate}
      />
    );
  }
  if (currentStep === 3) {
    return (
      <div className="text-center">
        <Image
          src="/assets/image/trophy.png"
          width={73}
          height={73}
          alt="트로피"
          className="mx-auto py-4"
        />
        <p className="text-lg pb-4">챌린지와 함께 모임 활동을 즐겨보세요!</p>
      </div>
    );
  }
  return null;
}
