import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchGatheringList,
  postGathering,
} from '@/pages/main/api/gatheringApi';
import {
  GatheringList,
  CreateGatheringForm,
  GatheringListParams,
} from '@/types';

// Query Keys
export const queryKeys = {
  gatheringList: (filters: GatheringListParams) => ['gatheringList', filters],
};

// 서버사이드 prefetch 함수
export const prefetchGatheringList = async (
  queryClient: QueryClient,
  filters: GatheringListParams,
) => {
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.gatheringList(filters),
    queryFn: ({ pageParam = 0 }) =>
      fetchGatheringList({ ...filters, pageParam }),
    initialPageParam: 0,
  });
};

// 클라이언트용 React Query 훅
export const useGatheringListQuery = (filters: GatheringListParams) => {
  console.log('📌 현재 필터 값:', filters); // ✅ 필터 값 확인

  return useInfiniteQuery<GatheringList>({
    queryKey: ['gatheringList', filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchGatheringList({ ...filters, pageParam: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.content.length > 0 ? allPages.length : undefined,
    initialPageParam: 0,
  });
};

export const createGathering = async (formData: CreateGatheringForm) => {
  try {
    return await postGathering(formData);
  } catch (error) {
    throw error;
  }
};
