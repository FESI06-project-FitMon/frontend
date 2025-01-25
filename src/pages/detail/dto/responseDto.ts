import { ChallengeType, GuestbookItem } from '@/types';

export interface GatheringGuestbookResponse {
  content: Array<GuestbookItem>;
  hasNext: boolean;
}

export interface GatheringChallengeResponse {
  content: Array<ChallengeType>;
  hasNext: boolean;
}
