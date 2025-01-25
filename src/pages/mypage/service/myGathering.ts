import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringService } from '@/pages/mypage/api/gatheringService';

export const GATHERING_KEYS = {
  participants: () => ['gatherings', 'participants'] as const,
  hosted: () => ['gatherings', 'hosted'] as const,
  challenges: (gatheringId: number) => [...GATHERING_KEYS.participants(), gatheringId, 'challenges'] as const,
};

export function useParticipatingGatherings(page = 0) {
  return useQuery({
    queryKey: [...GATHERING_KEYS.participants(), page],
    queryFn: () => gatheringService.getMyParticipatingGatherings(page),
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
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
      console.log('참여 취소 성공:', variables);
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.participants() });
    },
    onError: (error: any) => {
      console.error('참여 취소 실패:', error.message || error);
      alert('참여 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
}

export function useMyHostedGatherings(page = 0) {
  return useQuery({
    queryKey: ['gatherings', 'hosted', page],
    queryFn: () => gatheringService.getMyHostedGatherings(page),
    staleTime: 0, // 항상 최신 데이터
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
    // onSuccess: (data) => {
    //   console.log('주최한 모임 데이터 로드 성공:', data); // 성공 시 로깅
    // },
    // onError: (error) => {
    //   console.error('주최한 모임 조회 오류:', error); // 오류 로깅
    // },
  });
}

export function useCancelGathering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => gatheringService.cancelGathering(gatheringId),
    onSuccess: (_, variables) => {
      console.log('모임 취소 성공:', variables);
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.hosted() });
    },
    onError: (error) => {
      console.error('모임 취소 실패:', error);
    },
  });
}
