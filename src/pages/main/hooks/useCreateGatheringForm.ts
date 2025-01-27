import { useState } from 'react';
import { CreateChallenge, CreateGatheringForm } from '@/types';

const initialState: CreateGatheringForm = {
  title: '',
  description: '',
  mainType: '유산소형',
  subType: '런닝',
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
      totalCount: 0,
      startDate: null,
      endDate: null,
    },
  ],
};

export const useCreateGatheringForm = () => {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);
  const [formData, setFormData] = useState<CreateGatheringForm>(initialState);

  const updateFormData = <K extends keyof CreateGatheringForm>(
    key: K,
    value: CreateGatheringForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChallengeUpdate = (updatedChallenge: CreateChallenge) => {
    setFormData((prev) => ({ ...prev, challenges: [updatedChallenge] }));
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    handleChallengeUpdate,
  };
};
