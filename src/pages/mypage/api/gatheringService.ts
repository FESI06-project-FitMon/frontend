import apiRequest from '@/utils/apiRequest';
import { PageResponse, GatheringListItem } from '@/types';

export const gatheringService = {
  getMyParticipatingGatherings: async (page = 0) => {
    return await apiRequest<PageResponse<GatheringListItem>>({
      param: `api/v1/my-page/gatherings/participants?page=${page}&pageSize=10`,
      method: 'get',
    });
  },
  
  cancelParticipation: async (gatheringId: number) => {
    return await apiRequest({
      param: `api/v1/gatherings/${gatheringId}/cancel`,
      method: 'delete',
    });
  },

  getGatheringChallenges: async (gatheringId: number, status: 'IN_PROGRESS' | 'CLOSED', page = 0, pageSize = 5) => {
    return await apiRequest<ChallengeResponse>({
      param: `api/v1/gatherings/${gatheringId}/challenges?status=${status}&page=${page}&pageSize=${pageSize}`,
      method: 'get',
    });
  },
};

interface ChallengeResponse {
  content: ChallengeType[];
  hasNext: boolean;
}

interface ChallengeType {
  gatheringId: number;
  challengeId: number;
  title: string;
  description: string;
  imageUrl: string;
  participantCount: number;
  successParticipantCount: number;
  participantStatus: boolean;
  verificationStatus: boolean;
  startDate: string;
  endDate: string;
}