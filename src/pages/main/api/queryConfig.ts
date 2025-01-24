import { fetchGatheringList } from '@/pages/main/api/fetchGatheringList';

const queryKeys = {
  gatheringList: (mainType: string, subType: string) => [
    'gatheringList',
    mainType,
    subType,
  ],
};

const queryFunctions = {
  gatheringList: (pageSize: number) => ({
    queryFn: ({ pageParam = 0 }) => fetchGatheringList(pageParam, pageSize),
    initialPageParam: 0,
  }),
};

export { queryKeys, queryFunctions };
