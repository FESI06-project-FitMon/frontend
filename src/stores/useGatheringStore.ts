import {
  ChallengeType,
  GatheringDetailType,
  GatheringStateType,
  GuestbookItem,
} from '@/types';
import apiRequest from '@/utils/apiRequest';
import { create } from 'zustand';

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

interface ChallengeCreateRequest {
  title: string;
  description: string;
  imageUrl: string;
  totalCount: number;
  startDate: string;
  endDate: string;
}

interface GatheringState {
  gathering?: GatheringDetailType;
  gatheringStatus?: GatheringStateType;
  challenges?: Array<ChallengeType>;
  guestbooks?: Array<GuestbookItem>;
  hasNextPage: boolean;
  isStatusChanged: boolean;
  currentChallengePage: number;
  setCurrentChallengePage: (page: number) => void;
  setIsStatusChanged: (status: boolean) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  fetchGatheringInformation: (gatheringId: number) => void;
  fetchGatheringStatus: (gatheringId: number) => void;
  fetchGatheringChallenges: (
    gatheringId: number,
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
  participantChallenge: (challengeId: number) => void;
  verificationChallenge: (challengeId: number, imageUrl: string) => void;
}

interface GatheringChallengeResponse {
  content: Array<ChallengeType>;
  hasNext: boolean;
}

interface GatheringGuestbookResponse {
  content: Array<GuestbookItem>;
  hasNext: boolean;
}
const useGatheringStore = create<GatheringState>((set, get) => ({
  hasNextPage: false,
  isStatusChanged: false,
  currentChallengePage: 0,
  setCurrentChallengePage: (page: number) =>
    set({ currentChallengePage: page }),
  setIsStatusChanged: (status: boolean) => set({ isStatusChanged: status }),
  setHasNextPage: (hasNextPage: boolean) => set({ hasNextPage: hasNextPage }),
  // 모임 정보 불러오기 API
  fetchGatheringInformation: async (gatheringId: number) => {
    try {
      const response = await apiRequest<GatheringDetailType>({
        param: '/api/v1/gatherings/' + gatheringId,
        method: 'get',
      });
      set({ gathering: response });
    } catch (error) {
      throw error;
    }
  },

  // 모임 상태 불러오기 API
  fetchGatheringStatus: async (gatheringId: number) => {
    try {
      const response = await apiRequest<GatheringStateType>({
        param: '/api/v1/gatherings/' + gatheringId + '/status',
        method: 'get',
      });
      console.log('status response', response);
      set({ gatheringStatus: response });
    } catch (error) {
      throw error;
    }
  },

  // 챌린지 불러오기 API
  fetchGatheringChallenges: async (
    gatheringId,
    pageSize = 10,
    status = 'IN_PROGRESS',
  ) => {
    try {
      if (get().isStatusChanged) {
        set({ currentChallengePage: 0 });
      }
      const response = await apiRequest<GatheringChallengeResponse>({
        param: `/api/v1/gatherings/${gatheringId}/challenges?page=${get().currentChallengePage}&pageSize=${pageSize}&status=${status}`,
        method: 'get',
      });
      const prevChallenges = get().challenges ?? [];
      set({
        challenges: get().isStatusChanged
          ? response.content
          : [...prevChallenges, ...response.content],
        hasNextPage: response.hasNext,
      });
      set({ currentChallengePage: get().currentChallengePage + 1 });
    } catch (error) {
      throw error;
    }
  },

  // 방명록 불러오기 API
  fetchGatheringGuestbooks: async (gatheringId, page = 0, pageSize = 4) => {
    try {
      const response = await apiRequest<GatheringGuestbookResponse>({
        param: `/api/v1/gatherings/${gatheringId}/guestbooks?page=${page}&pageSize=${pageSize}`,
        method: 'get',
      });
      set({ guestbooks: response.content });
    } catch (error) {
      throw error;
    }
  },

  // 모임 수정하기 API
  updateGathering: async (gatheringUpdateRequest, gatheringId) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await apiRequest<any>({
        param: '/api/v1/gatherings/' + gatheringId,
        method: 'patch',
        requestData: gatheringUpdateRequest,
      });

      set({
        gathering: {
          gatheringId: get().gathering?.gatheringId ?? 0,
          captainStatus: get().gathering?.captainStatus ?? false,
          participantStatus: get().gathering?.participantStatus ?? false,
          title: gatheringUpdateRequest.title,
          description: gatheringUpdateRequest.description,
          mainType: get().gathering?.mainType ?? '',
          subType: get().gathering?.subType ?? '',
          imageUrl: gatheringUpdateRequest.imageUrl,
          startDate: gatheringUpdateRequest.startDate,
          endDate: gatheringUpdateRequest.endDate,
          mainLocation: gatheringUpdateRequest.mainLocation,
          subLocation: gatheringUpdateRequest.subLocation,
          minCount: get().gathering?.minCount ?? 0,
          totalCount: gatheringUpdateRequest.totalCount,
          participantCount: get().gathering?.participantCount ?? 0,
          status: get().gathering?.status ?? '',
          tags: gatheringUpdateRequest.tags,
          participants: get().gathering?.participants ?? [],
          averageRating: get().gathering?.averageRating ?? 0,
          guestBookCount: get().gathering?.guestBookCount ?? 0,
        },
      });

      set({
        gatheringStatus: {
          ...get().gatheringStatus!,
          totalCount: gatheringUpdateRequest.totalCount,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // 챌린지 생성하기 API
  createChallenge: async (challengeCreateRequest, gatheringId) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}/challenges`,
        method: 'post',
        requestData: challengeCreateRequest,
      });
    } catch (error) {
      throw error;
    }
  },

  // 모임 취소하기 API
  deleteGathering: async (gatheringId) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}`,
        method: 'delete',
      });
      console.log('delete response', response);
    } catch (error) {
      throw error;
    }
  },

  // 모임 참여하기 API
  participantGathering: async (gatheringId) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiRequest<any>({
        param: `/api/v1/gatherings/${gatheringId}/participants`,
        method: 'post',
      });
      console.log('participant response', response);
      set({
        gathering: {
          ...get().gathering!,
          participantStatus: true,
        },
        gatheringStatus: {
          ...get().gatheringStatus!,
          participantCount: get().gatheringStatus!.participantCount + 1,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // 챌린지 참여하기 API
  participantChallenge: async (challengeId) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await apiRequest<any>({
        param: `/api/v1/challenges/${challengeId}/participants`,
        method: 'post',
      });

      set({
        challenges: get().challenges?.map((challenge) =>
          challenge.challengeId === challengeId
            ? { ...challenge, participantStatus: true }
            : challenge,
        ),
      });
    } catch (error) {
      throw error;
    }
  },

  // 챌린지 인증하기 API
  verificationChallenge: async (challengeId, imageUrl) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await apiRequest<any>({
        param: `/api/v1/challenges/${challengeId}/verification`,
        method: 'post',
        requestData: { imageUrl: imageUrl },
      });

      // 챌린지 인증 상태 변경
      set({
        challenges: get().challenges?.map((challenge) =>
          challenge.challengeId === challengeId
            ? { ...challenge, verificationStatus: true }
            : challenge,
        ),
      });
    } catch (error) {
      throw error;
    }
  },
}));

export default useGatheringStore;
