import apiRequest from '@/utils/apiRequest';
import { GatheringListItem, PageResponse } from '@/types';

export const gatheringService = {
  getMyParticipatingGatherings: async (page = 0) => {
    return await apiRequest<PageResponse<GatheringListItem>>({
      param: `api/v1/my-page/gatherings/participants?page=${page}&pageSize=10`,
      method: 'get',
    });
  },
  
  cancelParticipation: async (gatheringId: number) => {
    return await apiRequest({
      param: `api/v1/gatherings/${gatheringId}/participation`,
      method: 'delete',
    });
  }
};
