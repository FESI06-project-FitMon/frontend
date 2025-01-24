import { useQuery } from '@tanstack/react-query';
import apiRequest from '@/utils/apiRequest';
import { MainChallenge } from '@/types/index';

export const useChallengeListQuery = () => {
  return useQuery<MainChallenge[]>({
    queryKey: ['mainChallengeList'],
    queryFn: async () =>
      await apiRequest<MainChallenge[]>({
        param: '/api/v1/challenges',
      }),
  });
};
