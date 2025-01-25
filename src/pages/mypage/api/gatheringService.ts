import apiRequest from '@/utils/apiRequest';
import { PageResponse, GatheringListItem } from '@/types';

export const gatheringService = {
  // 내가 참여한 모임 조회
  getMyParticipatingGatherings: async (page = 0): Promise<PageResponse<GatheringListItem>> => {
    try {
      const response = await apiRequest<PageResponse<GatheringListItem>>({
        param: `api/v1/my-page/gatherings/participants?page=${page}&pageSize=10`,
        method: 'get',
      });
      if (!response || !response.content) {
        throw new Error('응답 데이터가 잘못되었습니다.');
      }
      return response;
    } catch (error) {
      console.error('참여 모임 조회 API 호출 실패:', error);
      throw error;
    }
  },
  getMyHostedGatherings: async (page = 0): Promise<PageResponse<GatheringListItem>> => {
    try {
      const response = await apiRequest<PageResponse<GatheringListItem>>({
        param: `api/v1/my-page/gatherings/captain?page=${page}&pageSize=10`,
        method: 'get',
      });
  
      console.log('API 응답 데이터:', response); // 응답 데이터 확인
      if (!response?.content) {
        throw new Error('응답 데이터가 잘못되었습니다.');
      }
      return response;
    } catch (error) {
      console.error('주최한 모임 조회 API 호출 실패:', error);
      throw error;
    }
  },

  // 모임 참여 취소
  cancelParticipation: async (gatheringId: number): Promise<void> => {
    try {
      await apiRequest({
        param: `api/v1/gatherings/${gatheringId}/cancel`,
        method: 'delete',
      });
    } catch (error) {
      console.error('참여 취소 API 호출 실패:', error);
      throw error;
    }
  },

  // 모임 취소
  cancelGathering: async (gatheringId: number): Promise<void> => {
    try {
      await apiRequest({
        param: `api/v1/gatherings/${gatheringId}`,
        method: 'delete',
      });
    } catch (error) {
      console.error('모임 취소 API 호출 실패:', error);
      throw error;
    }
  },
};
