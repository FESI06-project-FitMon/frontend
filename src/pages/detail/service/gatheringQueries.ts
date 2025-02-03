import {
  infiniteQueryOptions,
  QueryClient,
  QueryFunctionContext,
  queryOptions,
} from '@tanstack/react-query';
import {
  deleteGathering,
  fetchGathering,
  fetchGatheringGuestbooks,
  fetchGatheringStatus,
  updateGathering,
} from '../api/gatheringApi';
import { createChallenge, fetchGatheringChallenges } from '../api/challengeApi';
import {
  ChallengeCreateRequest,
  GatheringUpdateRequest,
} from '../dto/requestDto';
import { GatheringDetailType, GatheringStateType } from '@/types';

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

  updateGatheringQuery: (gatheringId: number, queryClient: QueryClient) => {
    return {
      mutationFn: ({
        newGathering,
      }: {
        newGathering: GatheringUpdateRequest;
      }) => updateGathering(newGathering, gatheringId),
      onMutate: async (newGathering: GatheringUpdateRequest) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.gathering(gatheringId),
        });

        await queryClient.cancelQueries({
          queryKey: queryKeys.gatheringStatus(gatheringId),
        });

        const previousGathering = queryClient.getQueryData<GatheringDetailType>(
          queryKeys.gathering(gatheringId),
        );

        const previousGatheringStatus =
          queryClient.getQueryData<GatheringStateType>(
            queryKeys.gatheringStatus(gatheringId),
          );

        if (previousGathering) {
          queryClient.setQueryData<GatheringDetailType>(
            queryKeys.gathering(gatheringId),
            {
              ...previousGathering,
              ...newGathering,
            },
          );
        }

        if (previousGatheringStatus) {
          queryClient.setQueryData<GatheringStateType>(
            queryKeys.gatheringStatus(gatheringId),
            {
              ...previousGatheringStatus,
              totalCount: newGathering.totalCount,
            },
          );
        }

        return { previousGathering, previousGatheringStatus };
      },

      onSuccess: (newGathering: GatheringUpdateRequest) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.gathering(gatheringId),
        });

        console.log('newGathering', newGathering);
      },

      onError: (error: Error, context: QueryFunctionContext) => {
        console.error(error);
        if (context) {
          queryClient.setQueryData(queryKeys.gathering(gatheringId), context);
        }
      },
    };
  },

  createChallengeQuery: (gatheringId: number, queryClient: QueryClient) => {
    return {
      mutationFn: (newChallenge: ChallengeCreateRequest) => {
        createChallenge(newChallenge, gatheringId);
      },
      onMutate: async (newChallenge: ChallengeCreateRequest) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.gatheringChallenges(gatheringId, 'IN_PROGRESS'),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previousGatheringChallenges: any = queryClient.getQueryData(
          queryKeys.gatheringChallenges(gatheringId, 'IN_PROGRESS'),
        )!;

        const challenge = {
          gatheringId: 0,
          challengeId: 0,
          participantCount: 0,
          successParticipantCount: 0,
          participantStatus: false,
          verificationStatus: false,
          ...newChallenge,
        };

        console.log(
          previousGatheringChallenges,
          typeof previousGatheringChallenges,
        );
        const newChallenges = {
          ...previousGatheringChallenges,
          pages: [
            {
              content: [
                challenge,
                ...previousGatheringChallenges.pages[0].content,
              ],
              hasNext: previousGatheringChallenges.pages[0].hasNext,
            },
          ],
        };
        console.log('newChallenges', newChallenges);
        console.log(
          'previousGatheringChallenges????',
          previousGatheringChallenges.pages?.length > 0 &&
            previousGatheringChallenges.pages[0]?.content,
        );
        if (previousGatheringChallenges) {
          queryClient.setQueryData(
            queryKeys.gatheringChallenges(gatheringId, 'IN_PROGRESS'),
            previousGatheringChallenges.pages?.length > 0
              ? {
                  ...previousGatheringChallenges,
                  pages: [
                    {
                      content: [
                        challenge,
                        ...previousGatheringChallenges.pages[0].content,
                      ],
                      hasNext: previousGatheringChallenges.pages[0].hasNext,
                    },
                  ],
                }
              : previousGatheringChallenges,
          );
        }

        return { challenge };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.gatheringChallenges(gatheringId, 'IN_PROGRESS'),
        });
      },

      onError: (error: Error) => {
        console.log(error);
      },
    };
  },

  deleteGatheringQuery: (gatheringId: number, queryClient: QueryClient) => {
    return {
      mutationFn: () => deleteGathering(gatheringId),
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.gathering(gatheringId),
        });
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.gathering(gatheringId),
        });
      },
    };
  },
};
