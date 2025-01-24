import { QueryClient } from '@tanstack/react-query';
import { queryKeys, queryFunctions } from './queryConfig';

export const prefetchGatheringList = async (
  queryClient: QueryClient,
  mainType: string = '전체',
  subType: string = '전체',
  pageSize: number = 6,
) => {
  const queryKey = queryKeys.gatheringList(mainType, subType);
  const { queryFn, initialPageParam } = queryFunctions.gatheringList(pageSize);

  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam,
  });
};
