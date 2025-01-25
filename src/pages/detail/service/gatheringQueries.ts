import {
  infiniteQueryOptions,
  QueryClient,
  QueryFunctionContext,
  queryOptions,
} from '@tanstack/react-query';
import {
  fetchGathering,
  fetchGatheringGuestbooks,
  fetchGatheringStatus,
  updateGathering,
} from '../api/gatheringApi';
import { fetchGatheringChallenges } from '../api/challengeApi';
import { GatheringUpdateRequest } from '../dto/requestDto';
import { GatheringDetailType } from '@/types';

export const GatheringQueries = {
  getGatheringQuery: (gatheringId: number) => {
    return queryOptions({
      queryKey: [`gathering`, gatheringId],
      queryFn: () => fetchGathering(gatheringId),
      placeholderData: (prev) => prev,
      structuralSharing: true,
    });
  },

  getGatheringStatusQuery: (gatheringId: number) => {
    return queryOptions({
      queryKey: ['gatheringStatus', gatheringId],
      queryFn: () => fetchGatheringStatus(gatheringId),
      placeholderData: (prev) => prev,
      structuralSharing: true,
    });
  },

  getGatheringChallengesQuery: (gatheringId: number, status: string) => {
    return infiniteQueryOptions({
      queryKey: ['gatheringChallenges', gatheringId, status],
      queryFn: ({ pageParam }) =>
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
      queryKey: ['gatheringGuestbooks', gatheringId, page],
      queryFn: ({ pageParam }) => {
        fetchGatheringGuestbooks(gatheringId, pageParam! as number, 4);
      },
    });
  },

  updateGatheringQuery: (gatheringId: number, queryClient: QueryClient) => {
    return queryOptions<GatheringDetailType, Error, GatheringUpdateRequest>({
      mutationFn: async (newGathering: GatheringUpdateRequest) => {
        return await updateGathering(newGathering, gatheringId);
      },
      onMutate: async (newGathering: GatheringUpdateRequest) => {
        await queryClient.cancelQueries({
          queryKey: [`gathering`, gatheringId],
        });

        const previousGathering = queryClient.getQueryData<GatheringDetailType>(
          [`gathering`, gatheringId],
        );

        console.log(previousGathering, queryClient);

        if (previousGathering) {
          queryClient.setQueryData<GatheringDetailType>(
            ['gathering', gatheringId],
            {
              ...previousGathering,
              ...newGathering,
            },
          );
        }

        return { previousGathering };
      },

      onSuccess: (newGathering: GatheringUpdateRequest) => {
        console.log(newGathering);
        queryClient.invalidateQueries({
          queryKey: ['gathering', gatheringId],
        });
      },

      onError: (error: Error, context: QueryFunctionContext) => {
        console.error(error);
        if (context) {
          queryClient.setQueryData(['gathering', gatheringId], context);
        }
      },
    });
  },
};
