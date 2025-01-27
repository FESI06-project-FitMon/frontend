import apiRequest from '@/utils/apiRequest';
import { GatheringList, CreateGatheringForm } from '@/types';

// API 호출 함수
export const fetchGatheringList = async (
  pageParam: number,
  pageSize: number,
  mainType: string = '전체',
  subType: string = '전체',
): Promise<GatheringList> => {
  const apiEndpoint = '/api/v1/gatherings';
  const queryParams = {
    sortBy: 'participants',
    sortDirection: 'ASC',
    page: String(pageParam),
    pageSize: String(pageSize),
    ...(mainType !== '전체' && { mainType }),
    ...(subType !== '전체' && { subType }),
  };

  const paramWithPage = `${apiEndpoint}?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GatheringList>({ param: paramWithPage });
};

export const postGathering = async (formData: CreateGatheringForm) => {
  return await apiRequest<CreateGatheringForm>({
    param: '/api/v1/gatherings',
    method: 'post',
    requestData: formData,
  });
};
