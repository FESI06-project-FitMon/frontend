import apiRequest from '@/utils/apiRequest';
import { PageResponse, GatheringListItem, ChallengeType } from '@/types';

export const gatheringService = {
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
    console.log('Calling getMyHostedGatherings');
    const response = await apiRequest<PageResponse<GatheringListItem>>({
      param: `api/v1/my-page/gatherings/captain?page=${page}&pageSize=10`,
      method: 'get',
    });
    console.log('API Response:', response);
    if (!response || !response.content) {
      throw new Error('Invalid response structure');
    }
    return response;
  },

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

  getChallenges: async (gatheringId: number, status = 'IN_PROGRESS', page = 0): Promise<PageResponse<ChallengeType>> => {
    try {
      const response = await apiRequest<PageResponse<ChallengeType>>({
        param: `api/v1/gatherings/${gatheringId}/challenges?status=${status}&page=${page}&pageSize=5`,
        method: 'get',
      });
      return response;
    } catch (error) {
      console.error('챌린지 조회 실패:', error);
      throw error;
    }
  },
};