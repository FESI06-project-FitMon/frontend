import {
  QueryClient,
  QueryFunctionContext,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { fetchGatheringList } from '@/pages/main/api/gatheringApi';
import { GatheringList } from '@/types';

// Query Keys
export const queryKeys = {
  gatheringList: (mainType: string, subType: string) => [
    'gatheringList',
    mainType,
    subType,
  ],
};

// 서버사이드 prefetch 함수
export const prefetchGatheringList = async (
  queryClient: QueryClient,
  mainType: string,
  subType: string,
  pageSize: number,
) => {
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.gatheringList(mainType, subType),
    queryFn: ({ pageParam = 0 }) =>
      fetchGatheringList(pageParam, pageSize, mainType, subType),
    initialPageParam: 0,
  });
};

// 클라이언트용 React Query 훅
export const useGatheringListQuery = (
  mainType: string,
  subType: string,
  pageSize: number,
) => {
  const queryKey = queryKeys.gatheringList(mainType, subType);

  return useInfiniteQuery<GatheringList>({
    queryKey,
    queryFn: ({ pageParam = 0 }: QueryFunctionContext) =>
      fetchGatheringList(pageParam as number, pageSize, mainType, subType),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.content.length > 0 ? allPages.length : undefined,
    initialPageParam: 0, // 초기 페이지 설정
  });
};
