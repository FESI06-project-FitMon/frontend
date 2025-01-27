import { CreateGatheringForm } from '@/types';

export const isStepValid = (
  step: 0 | 1 | 2 | 3,
  formData: CreateGatheringForm,
) => {
  const validations: Record<0 | 1 | 2 | 3, () => boolean> = {
    0: () => formData.mainType !== '',
    1: () =>
      formData.title.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.startDate !== null &&
      formData.endDate !== null &&
      formData.mainLocation !== '' &&
      formData.subLocation !== '',
    2: () => {
      const challenge = formData.challenges[0];
      return (
        challenge?.title.trim() !== '' &&
        challenge?.description.trim() !== '' &&
        challenge?.startDate !== null &&
        challenge?.endDate !== null
      );
    },
    3: () => formData.mainType !== '',
  };

  return validations[step] ? validations[step]() : true;
};
