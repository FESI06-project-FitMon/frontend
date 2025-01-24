import apiRequest from '@/utils/apiRequest';
import { GatheringList } from '@/types';

export const fetchGatheringList = async (
  pageParam: number,
  pageSize: number,
) => {
  const apiEndpoint = '/api/v1/gatherings';
  const queryParams = {
    sortBy: 'deadline',
    sortDirection: 'DASC',
    page: String(pageParam),
    pageSize: String(pageSize),
  };

  const paramWithPage = `${apiEndpoint}?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GatheringList>({ param: paramWithPage });
};
