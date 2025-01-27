import { useQuery } from '@tanstack/react-query';
import { fetchChallengeList } from '@/pages/main/api/challengeApi';
import { MainChallenge } from '@/types';

// React Query 훅: 챌린지 리스트 가져오기
export const useChallengeListQuery = () => {
  return useQuery<MainChallenge[]>({
    queryKey: ['mainChallengeList'],
    queryFn: fetchChallengeList, // API 호출 함수 사용
  });
};
