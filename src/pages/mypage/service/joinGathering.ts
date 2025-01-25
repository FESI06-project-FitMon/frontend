import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringService } from '../api/gatheringService';

export const GATHERING_KEYS = {
  participants: () => ['gatherings', 'participants'] as const,
  challenges: (gatheringId: number) => [...GATHERING_KEYS.participants(), gatheringId, 'challenges'] as const,
};

export function useParticipatingGatherings(page = 0) {
  return useQuery({
    queryKey: [...GATHERING_KEYS.participants(), page],
    queryFn: () => gatheringService.getMyParticipatingGatherings(page),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useCancelParticipation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: gatheringService.cancelParticipation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GATHERING_KEYS.participants() });
    },
  });
}