import { GatheringDetailType, GatheringStateType } from '@/types';
import apiRequest from '@/utils/apiRequest';
import { GatheringGuestbookResponse } from '../dto/responseDto';
import { GatheringUpdateRequest } from '../dto/requestDto';

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

// 모임 참가하기
export const participantGathering = async (gatheringId: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/gatherings/${gatheringId}/participants`,
      method: 'post',
    });
  } catch (error) {
    throw error;
  }
};

// 모임 참여 취소하기
export const cancelGathering = async (gatheringId: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/gatherings/${gatheringId}/cancel`,
      method: 'delete',
    });
  } catch (error) {
    throw error;
  }
};

// 모임 취소하기 (모임장)
export const deleteGathering = async (gatheringId: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/gatherings/${gatheringId}`,
      method: 'delete',
    });
  } catch (error) {
    throw error;
  }
};

// 모임 수정하기 API (모임장)
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

// 방명록 불러오기 API
export const fetchGatheringGuestbooks = async (
  gatheringId: number,
  page: number = 0,
  pageSize: number = 4,
): Promise<GatheringGuestbookResponse> => {
  try {
    return await apiRequest<GatheringGuestbookResponse>({
      param: `/api/v1/gatherings/${gatheringId}/guestbooks?page=${page}&pageSize=${pageSize}`,
      method: 'get',
    });
  } catch (error) {
    throw error;
  }
};
