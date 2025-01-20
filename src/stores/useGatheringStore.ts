import GatheringDetail from '@/pages/detail/[gatheringId].page';
import { ChallengeType, GuestbookItem } from '@/types';
import apiRequest from '@/utils/apiRequest';
import { create } from 'zustand';
import instance from '@/utils/axios';

export interface GatheringDetail {
  gatheringId: number;
  captainStatus: boolean;
  title: string;
  description: string;
  mainType: string;
  subType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  mainLocation: string;
  subLocation: string;
  minCount: number;
  totalCount: number;
  participantCount: number;
  status: string;
  tags: Array<string>;
  participants: Array<GatheringParticipants>;
  averageRating: number;
  guestBookCount: number;
}

interface GatheringUpdateRequest {
  title: string;
  description: string;
  imageFile: File;
  startDate: string;
  endDate: string;
  mainLocation: string;
  subLocation: string;
  tags: Array<string>;
}

interface ChallengeCreateRequest {
  title: string;
  description: string;
  imageUrl: string;
  // maxPeopleCount: number;
  startDate: string;
  endDate: string;
}

interface GatheringParticipants {
  memberId: number;
  nickName: string;
  profileImageUrl: string;
}

export interface GatheringStatus {
  participants: Array<GatheringParticipants>;
  minCount: number;
  totalCount: number;
  participantCount: number;
  status: string;
  averageRating: number;
  guestBookCount: number;
}

interface GatheringState {
  gathering?: GatheringDetail;
  gatheringStatus?: GatheringStatus;
  challenges?: Array<ChallengeType>;
  guestbooks?: Array<GuestbookItem>;
  fetchGathering: (gatheringId: number) => void;
  fetchGatheringStatus: (gatheringId: number) => void;
  fetchGatheringChallenges: (
    gatheringId: number,
    page: number,
    pageSize: number,
    status: string,
  ) => void;
  fetchGatheringGuestbooks: (
    gatheringId: number,
    page: number,
    pageSize: number,
  ) => void;
  updateGathering: (
    request: GatheringUpdateRequest,
    gatheringId: number,
  ) => void;
  createChallenge: (
    challengeCreateRequest: ChallengeCreateRequest,
    gatheringId: number,
  ) => void;
  deleteGathering: (gatheringId: number) => void;
  participantGathering: (gatheringId: number) => void;
}

interface GatheringChallengeResponse {
  content: Array<ChallengeType>;
  hasNext: boolean;
}
const useGatheringStore = create<GatheringState>((set, get) => ({
  gathering: undefined,

  fetchGathering: async (gatheringId: number) => {
    try {
      const response = await apiRequest<GatheringDetail>({
        param: '/api/v1/gatherings/' + gatheringId,
        method: 'get',
      });
      console.log('response', response);
      set({ gathering: response });
    } catch (error) {
      throw error;
    }
  },

  fetchGatheringStatus: async (gatheringId: number) => {
    try {
      const response = await apiRequest<GatheringStatus>({
        param: '/api/v1/gatherings/' + gatheringId + '/status',
        method: 'get',
      });
      console.log('status response', response);
      set({ gatheringStatus: response });
    } catch (error) {
      throw error;
    }
  },

  fetchGatheringChallenges: async (
    gatheringId,
    page = 0,
    pageSize = 10,
    status = 'IN_PROGRESS',
  ) => {
    try {
      const response = await apiRequest<GatheringChallengeResponse>({
        param: `/api/v1/gatherings/${gatheringId}/challenges?page=${page}&pageSize=${pageSize}&status=${status}`,
        method: 'get',
      });
      set({ challenges: response.content });
    } catch (error) {
      throw error;
    }
  },

  fetchGatheringGuestbooks: async (gatheringId, page = 0, pageSize = 10) => {
    try {
      const response = await apiRequest<GatheringChallengeResponse>({
        param: `/api/v1/gatherings/${gatheringId}/guestbooks?page=${page}&pageSize=${pageSize}`,
        method: 'get',
      });
      set({ challenges: response.content });
    } catch (error) {
      throw error;
    }
  },

  updateGathering: async (gatheringUpdateRequest, gatheringId) => {
    try {
      const formData = new FormData();
      formData.append('file', gatheringUpdateRequest.imageFile);
      console.log('파일 확인:', formData.get('file')); // 디버깅용 로그 추가

      // // 파일 업로드
      const url = await instance.request<{ imageUrl: string }>({
        url: 'api/v1/images?type=GATHERING',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const filteredData = JSON.parse(
        JSON.stringify({
          ...gatheringUpdateRequest,
          imageUrl: url.data.imageUrl,
        }),
      );
      delete filteredData.imageFile;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiRequest<any>({
        param: '/api/v1/gatherings/' + gatheringId,
        method: 'patch',
        requestData: filteredData,
      });
      console.log(response);
      set({
        gathering: {
          ...get().gathering,
          ...Object.fromEntries(
            Object.entries(gatheringUpdateRequest).filter(
              ([key, value]) =>
                value !== get().gathering?.[key as keyof GatheringDetail],
            ),
          ),
        },
      });
    } catch (error) {
      throw error;
    }
  },

  createChallenge: async (challengeCreateRequest, gatheringId) => {
    try {
      const response = await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}/challenges`,
        method: 'post',
        requestData: challengeCreateRequest,
      });

      set({
        challenges: [
          ...get().challenges!,
          {
            gatheringId,
            ...challengeCreateRequest,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  deleteGathering: async (gatheringId) => {
    try {
      const response = await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}`,
        method: 'delete',
      });
      console.log('delete response', response);
    } catch (error) {
      throw error;
    }
  },

  participantGathering: async (gatheringId) => {
    try {
      const response = await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}/participants`,
        method: 'post',
      });
      console.log('participant response', response);
    } catch (error) {
      throw error;
    }
  },
}));

export default useGatheringStore;
