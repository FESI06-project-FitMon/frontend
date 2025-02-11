import { ChallengeType, GuestbookWriter } from '@/types';

export interface GuestbookItem {
  guestbookId: number;
  content: string;
  rating: number;
  createDate: string;
  writer: GuestbookWriter;
  reviewOwnerStatus: boolean;
  gatheringId: number;
}

export interface GatheringGuestbookResponse {
  content: Array<GuestbookItem>;
  hasNext: boolean;
}

export interface GatheringChallengeResponse {
  content: Array<ChallengeType>;
  hasNext: boolean;
}

export interface ChallengeCreateResponse {
  challengeId: number;
}
