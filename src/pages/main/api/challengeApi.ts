import apiRequest from '@/utils/apiRequest';
import { MainChallenge } from '@/types';

export const fetchChallengeList = async (): Promise<MainChallenge[]> => {
  return await apiRequest<MainChallenge[]>({
    param: '/api/v1/challenges',
  });
};
