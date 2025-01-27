import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringService } from '@/pages/mypage/api/gatheringService';
import { PageResponse, GatheringListItem, ChallengeType } from '@/types';

export const GATHERING_KEYS = {
  participants: () => ['gatherings', 'participants'] as const,
  hosted: () => ['gatherings', 'hosted'] as const,
  challenges: () => ['gatherings', 'challenges'] as const  // gatheringId 제거
};

export function useParticipatingGatherings(page = 0) {
  return useQuery<PageResponse<GatheringListItem>>({
    //gatheringService.getMyHostedGatherings에서 데이터를 받아온 후, 데이터를 가공하거나 추가적인 로직을 수행할 필요가 있을 경우 async 함수가 적합
    queryKey: [...GATHERING_KEYS.participants(), page],
    queryFn: async () => {
      const data = await gatheringService.getMyParticipatingGatherings(page)
      return data;
    },
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
      if (!gatheringId) throw new Error('모임 ID가 제공되지 않았습니다.');
      await gatheringService.cancelParticipation(gatheringId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.participants() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('참여 취소 실패:', error.message || error);
      alert('참여 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
}

export function useMyHostedGatherings(page = 0) {
  return useQuery({
    queryKey: GATHERING_KEYS.hosted(),
    queryFn: async () => {
      const data = await gatheringService.getMyHostedGatherings(page); // 내가 주최한 모임 조회 API 호출
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCancelGathering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gatheringId: number) => gatheringService.cancelGathering(gatheringId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.hosted() });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('모임 취소 실패:', error);
      alert('모임 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
}

export function useGatheringChallenges(gatheringsData: PageResponse<GatheringListItem> | undefined, isCaptain: boolean = true) {
  return useQuery({
    queryKey: [...GATHERING_KEYS.challenges(), isCaptain],
    queryFn: async () => {
      if (!gatheringsData?.content) return {};

      const challengesMap: Record<number, {
        inProgressChallenges: ChallengeType[];
        doneChallenges: ChallengeType[];
      }> = {};

      await Promise.all(
        gatheringsData.content.map(async ({ gatheringId }) => {
          const inProgressResponse = await gatheringService.getChallenges(gatheringId, 'IN_PROGRESS');
          const closedResponse = await gatheringService.getChallenges(gatheringId, 'CLOSED');

          // 내가 참여한 모임일 경우 참여한 챌린지만 필터링
          if (!isCaptain) {
            challengesMap[gatheringId] = {
              inProgressChallenges: inProgressResponse.content.filter(c => c.participantStatus),
              doneChallenges: closedResponse.content.filter(c => c.participantStatus)
            };
          } else {
            challengesMap[gatheringId] = {
              inProgressChallenges: inProgressResponse.content,
              doneChallenges: closedResponse.content
            };
          }
        })
      );
      return challengesMap;
    },
    enabled: !!gatheringsData?.content
  });
}
