import apiRequest from '@/utils/apiRequest';
import {
  GatheringList,
  CreateGatheringForm,
  GatheringListParams,
} from '@/types';

// API 호출 함수
export const fetchGatheringList = async (
  params: GatheringListParams,
): Promise<GatheringList> => {
  const apiEndpoint = '/api/v1/gatherings';

  const queryParams = new URLSearchParams({
    sortBy: params.sortBy || 'deadline',
    sortDirection: params.sortDirection || 'ASC',
    page: String(params.pageParam || 0),
    pageSize: String(params.pageSize || 6),
    ...(params.mainType && params.mainType !== '전체'
      ? { mainType: params.mainType }
      : {}),
    ...(params.subType && params.subType !== '전체'
      ? { subType: params.subType }
      : {}),
    ...(params.mainLocation ? { mainLocation: params.mainLocation } : {}),
    ...(params.subLocation ? { subLocation: params.subLocation } : {}),
    ...(params.searchDate ? { searchDate: params.searchDate } : {}),
  });

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
