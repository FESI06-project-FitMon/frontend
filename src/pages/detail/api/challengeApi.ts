import { ChallengeType } from '@/types';
import apiRequest from '@/utils/apiRequest';

interface GatheringChallengeResponse {
  content: Array<ChallengeType>;
  hasNext: boolean;
}

interface ChallengeCreateRequest {
  title: string;
  description: string;
  imageUrl: string;
  totalCount: number;
  startDate: string;
  endDate: string;
}

// 챌린지 불러오기 API
export const fetchGatheringChallenges = async (
  gatheringId: number,
  page: number = 0,
  pageSize: number = 10,
  status: string = 'IN_PROGRESS',
) => {
  try {
    return await apiRequest<GatheringChallengeResponse>({
      param: `/api/v1/gatherings/${gatheringId}/challenges?page=${page}&pageSize=${pageSize}&status=${status}`,
      method: 'get',
    });
  } catch (error) {
    throw error;
  }
};

// 챌린지 생성하기 API
export const createChallenge = async (
  challengeCreateRequest: ChallengeCreateRequest,
  gatheringId: number,
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/gatherings/${gatheringId}/challenges`,
      method: 'post',
      requestData: challengeCreateRequest,
    });
  } catch (error) {
    throw error;
  }
};

// 챌린지 참여하기 API
export const participantChallenge = async (challengeId: number) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/challenges/${challengeId}/participants`,
      method: 'post',
    });
  } catch (error) {
    throw error;
  }
};

// 챌린지 인증하기 API
export const verificationChallenge = async (
  challengeId: number,
  imageUrl: string,
) => {
  try {
    if (!imageUrl) throw new Error('imageUrl cannot be empty');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `/api/v1/challenges/${challengeId}/verification`,
      method: 'post',
      requestData: { imageUrl: imageUrl },
    });
  } catch (error) {
    throw error;
  }
};
