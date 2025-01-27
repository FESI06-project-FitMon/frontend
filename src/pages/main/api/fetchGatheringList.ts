import { QueryClient } from '@tanstack/react-query';
import apiRequest from '@/utils/apiRequest';
import { GatheringList } from '@/types';

export const queryKeys = {
  gatheringList: (mainType: string, subType: string) => [
    'gatheringList',
    mainType,
    subType,
  ],
};

export const fetchGatheringList = async (
  pageParam: number,
  pageSize: number,
  mainType: string = '전체',
  subType: string = '전체',
): Promise<GatheringList> => {
  const apiEndpoint = '/api/v1/gatherings';
  const queryParams = {
    sortBy: 'deadline',
    sortDirection: 'ASC',
    page: String(pageParam),
    pageSize: String(pageSize),
    ...(mainType !== '전체' && { mainType }),
    ...(subType !== '전체' && { subType }),
  };

  const paramWithPage = `${apiEndpoint}?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GatheringList>({ param: paramWithPage });
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

// 클라이언트용 useInfiniteQuery 설정 함수
export const useGatheringListQuery = (
  mainType: string,
  subType: string,
  pageSize: number,
) => {
  const queryKey = queryKeys.gatheringList(mainType, subType);

  return {
    queryKey,
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
      fetchGatheringList(pageParam, pageSize, mainType, subType),
    getNextPageParam: (lastPage: GatheringList, allPages: GatheringList[]) =>
      lastPage.content.length > 0 ? allPages.length : undefined,
  };
};
