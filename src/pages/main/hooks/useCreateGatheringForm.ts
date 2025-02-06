import { useState } from 'react';
import { CreateChallenge, CreateGatheringForm } from '@/types';
import { DEFAULT_IMAGE } from '@/constants/imgConfig';

const initialState: CreateGatheringForm = {
  title: '',
  description: '',
  mainType: '유산소형',
  subType: '런닝',
  imageUrl: DEFAULT_IMAGE,
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
      imageUrl: DEFAULT_IMAGE,
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
    setFormData,
    updateFormData,
    handleChallengeUpdate,
  };
};
