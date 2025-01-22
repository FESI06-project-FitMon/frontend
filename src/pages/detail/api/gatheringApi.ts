import {
  GatheringDetailType,
  GatheringStateType,
  GuestbookItem,
} from '@/types';
import apiRequest from '@/utils/apiRequest';

interface GatheringGuestbookResponse {
  content: Array<GuestbookItem>;
  hasNext: boolean;
}

interface GatheringUpdateRequest {
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  mainLocation: string;
  subLocation: string;
  tags: Array<string>;
  totalCount: number;
}

// 모임 정보 불러오기 API
export const fetchGathering = async (gatheringId: number) => {
  try {
    return await apiRequest<GatheringDetailType>({
      param: '/api/v1/gatherings/' + gatheringId,
      method: 'get',
    });
  } catch (error) {
    throw error;
  }
};

// 모임 상태 불러오기 API
export const fetchGatheringStatus = async (gatheringId: number) => {
  try {
    return await apiRequest<GatheringStateType>({
      param: '/api/v1/gatherings/' + gatheringId + '/status',
      method: 'get',
    });
  } catch (error) {
    throw error;
  }
};

// 방명록 불러오기 API
export const fetchGatheringGuestbooks = async (
  gatheringId: number,
  page: number = 0,
  pageSize: number = 4,
) => {
  try {
    return await apiRequest<GatheringGuestbookResponse>({
      param: `/api/v1/gatherings/${gatheringId}/guestbooks?page=${page}&pageSize=${pageSize}`,
      method: 'get',
    });
  } catch (error) {
    throw error;
  }
};

// 모임 수정하기 API
export const updateGathering = async (
  gatheringUpdateRequest: GatheringUpdateRequest,
  gatheringId: number,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: '/api/v1/gatherings/' + gatheringId,
      method: 'patch',
      requestData: gatheringUpdateRequest,
    });
  } catch (error) {
    throw error;
  }
};
