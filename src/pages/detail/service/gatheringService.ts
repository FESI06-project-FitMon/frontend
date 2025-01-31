import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { GatheringQueries } from './gatheringQueries';

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
  const queryOptions = GatheringQueries.updateGatheringQuery(
    gatheringId,
    queryClient,
  );
  return useMutation(queryOptions);
};

export const useChallengeCreate = (
  gatheringId: number,
  queryClient: QueryClient,
) => {
  const queryOptions = GatheringQueries.createChallengeQuery(
    gatheringId,
    queryClient,
  );
  return useMutation(queryOptions);
};

export const useGatheringDelete = (
  gatheringId: number,
  queryClient: QueryClient,
) => {
  const queryOptions = GatheringQueries.deleteGatheringQuery(
    gatheringId,
    queryClient,
  );
  return useMutation(queryOptions);
};
