import { useState } from 'react';
import { CreateChallenge, CreateGatheringForm } from '@/types';

const initialState: CreateGatheringForm = {
  title: '',
  description: '',
  mainType: '유산소형',
  subType: '런닝',
  imageUrl:
    'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png',
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
      imageUrl:
        'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png',
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
