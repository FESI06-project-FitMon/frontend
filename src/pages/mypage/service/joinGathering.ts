import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringService } from '@/pages/mypage/api/gatheringService';

export const GATHERING_KEYS = {
  participants: () => ['gatherings', 'participants'] as const,
  challenges: (gatheringId: number) => [...GATHERING_KEYS.participants(), gatheringId, 'challenges'] as const,
};

export function useParticipatingGatherings(page = 0) {
  return useQuery({
    queryKey: [...GATHERING_KEYS.participants(), page],
    queryFn: () => gatheringService.getMyParticipatingGatherings(page),
    staleTime: 0, // 항상 최신 데이터를 가져오기 위해 staleTime 설정
    refetchOnWindowFocus: true, // 창이 포커스될 때 데이터를 다시 가져옴
    retry: 3, // 최대 3번 재시도
    retryDelay: 1000, // 재시도 간격 (1초)
  });
}
export function useCancelParticipation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gatheringId: number) => {
      if (!gatheringId) {
        throw new Error('모임 ID가 제공되지 않았습니다.');
      }
      await gatheringService.cancelParticipation(gatheringId);
    },
    onSuccess: (_, variables) => {
      console.log('참여 취소 성공:', variables); // 취소된 모임 ID 출력
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.participants() }); // 데이터 무효화
    },
    onError: (error: any) => {
      console.error('참여 취소 실패:', error.message || error);
      alert('참여 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
