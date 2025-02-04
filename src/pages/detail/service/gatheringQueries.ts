import {
  infiniteQueryOptions,
  QueryFunctionContext,
  queryOptions,
} from '@tanstack/react-query';
import {
  fetchGathering,
  fetchGatheringGuestbooks,
  fetchGatheringStatus,
} from '../api/gatheringApi';
import { fetchGatheringChallenges } from '../api/challengeApi';

export const queryKeys = {
  gathering: (gatheringId: number) => [`gathering`, gatheringId],
  gatheringStatus: (gatheringId: number) => [`gatheringStatus`, gatheringId],
  gatheringChallenges: (gatheringId: number, status: string) => [
    'gatheringChallenges',
    gatheringId,
    status,
  ],
  gatheringGuestbooks: (gatheringId: number, page: number) => [
    'gatheringGuestbooks',
    gatheringId,
    page,
  ],
};

export const GatheringQueries = {
  getGatheringQuery: (gatheringId: number) => {
    return queryOptions({
      queryKey: queryKeys.gathering(gatheringId),
      queryFn: () => fetchGathering(gatheringId),
      placeholderData: (prev) => prev,
      structuralSharing: true,
    });
  },

  getGatheringStatusQuery: (gatheringId: number) => {
    return queryOptions({
      queryKey: queryKeys.gatheringStatus(gatheringId),
      queryFn: () => fetchGatheringStatus(gatheringId),
      placeholderData: (prev) => prev,
      structuralSharing: true,
    });
  },

  getGatheringChallengesQuery: (gatheringId: number, status: string) => {
    return infiniteQueryOptions({
      queryKey: queryKeys.gatheringChallenges(gatheringId, status),
      queryFn: ({ pageParam = 0 }: QueryFunctionContext) =>
        fetchGatheringChallenges(gatheringId, pageParam! as number, 10, status),
      initialPageParam: void 1,
      getNextPageParam: (page, pageParam) => {
        if (page.hasNext) {
          return pageParam.indexOf(page) + 1;
        }
      },
    });
  },

  getGatheringGuestbooksQuery: (gatheringId: number, page: number) => {
    return queryOptions({
      queryKey: queryKeys.gatheringGuestbooks(gatheringId, page),
      queryFn: () => fetchGatheringGuestbooks(gatheringId, page, 4),
    });
  },
};
