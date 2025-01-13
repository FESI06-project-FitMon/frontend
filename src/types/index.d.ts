import { GatheringChallegeProps } from './index.d';
export interface TabItem {
  id: string;
  label: string;
}
export interface UserProfile {
  memberId: string;
  email: string;
  nickname: string;
  profileImage: string | null;
}
export interface GatheringItem {
  gatheringId: number;
  gatheringTitle: string;
  gatheringImage: string;
  gatheringStatus: '모집중' | '진행중' | '완료';
  gatheringMainType: string;
  gatheringSubType: string;
  gatheringStartDate: string;
  gatheringEndDate: string;
  gatheringSi: string;
  gatheringGu: string;
  gatheringDescription: string;
  gatheringTags: string[];
  captainStatus: boolean | undefined;
  isReservationCancellable: boolean?;
}

export interface GatheringStateType {
  gatheringJoinedFivePeopleImages: string[]?;
  gatheringAverageRating: double;
  gatheringGuestbookCount: number;
  gatheringMaxPeopleCount: number;
  gatheringMinPeopleCount: number;
  gatheringJoinedPeopleCount: number;
  gatheringStatus: string;
}

export interface GatheringChallengeType {
  inProgressChallenges: Array<ChallengeType>?;
  doneChallenges: Array<ChallengeType>?;
}

export interface GatheringChallegeProps {
  challenges: GatheringChallengeType;
  captainStatus: boolean;
}
export interface ChallengeType {
  gatheringId: number;
  challengeId: number;
  imageUrl: string;
  title: string;
  description: string;
  participantCount: number;
  successParticipantCount: number;
  participantStatus: boolean;
  verificationStatus: boolean;
  startDate: string;
  endDate: string;
}
export interface GuestbookItem {
  reviewId: number;
  content: string;
  rating: number;
  createDate: string;
  writer: GuestbookWriter;
  reviewOwnerStatus: boolean;
  gatheringId: number; 
}

export interface GuestbookWriter {
  memberId: number;
  nickName: string;
  profileImageUrl: string;
}

export interface MainChallenge {
  gatheringId: number;
  challengeId: number;
  title: string;
  description: string;
  imageUrl: string;
  participantCount: number;
  successParticipantCount: number;
  startDate: string;
  endDate: string;
}

export interface GatheringList {
  content: GatheringListItem[];
  hasNext: boolean;
}

export interface GatheringListItem {
  gatheringId: number;
  title: string;
  description: string;
  mainType: '전체' | '유산소형' | '무산소형' | '경기형';
  subType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  mainLocation: string;
  subLocation: string;
  minCount: number;
  totalCount: number;
  participantCount: number;
  status: '시작전' | '진행중' | '종료됨' | '취소됨';
  tags: string[];
}
