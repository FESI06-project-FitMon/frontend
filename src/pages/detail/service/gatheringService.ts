import {
  QueryClient,
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { GatheringQueries } from './gatheringQueries';
import { GatheringUpdateRequest } from '../dto/requestDto';
import { GatheringDetailType } from '@/types';
import { updateGathering } from '../api/gatheringApi';

export const useGatheringDetail = (gatheringId: number) => {
  const queryOptions = GatheringQueries.getGatheringQuery(gatheringId);
  return useQuery(queryOptions);
};

export const useGatheringStatus = (gatheringId: number) => {
  const queryOptions = GatheringQueries.getGatheringStatusQuery(gatheringId);
  return useQuery(queryOptions);
};

export const useGatheringChallenges = (gatheringId: number, status: string) => {
  const queryOptions = GatheringQueries.getGatheringChallengesQuery(
    gatheringId,
    status,
  );
  return useInfiniteQuery(queryOptions);
};

export const useGatheringGuestbooks = (gatheringId: number, page: number) => {
  const queryOptions = GatheringQueries.getGatheringGuestbooksQuery(
    gatheringId,
    page,
  );
  return useQuery(queryOptions);
};

export const useGatheringUpdate = (
  gatheringId: number,
  queryClient: QueryClient,
) => {
  // const queryOptions = GatheringQueries.updateGatheringQuery(
  //   gatheringId,
  //   queryClient,
  // );
  return useMutation({
    mutationFn: (newGathering: GatheringUpdateRequest) => {
      return updateGathering(newGathering, gatheringId);
    },
    onMutate: (newGathering: GatheringUpdateRequest) => {
      queryClient.cancelQueries({
        queryKey: [`gathering`, gatheringId],
      });

      const previousGathering = queryClient.getQueryData<GatheringDetailType>([
        `gathering`,
        gatheringId,
      ]);

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
};
