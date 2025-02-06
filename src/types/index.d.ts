import { GatheringChallegeProps, CreateGatheringForm } from './index.d';
export interface TabItem {
  id: string;
  label: string;
}
export interface UserProfile {
  memberId: number;
  nickName: string;
  email: string;
  profileImageUrl: string;
}

export interface GatheringStateType {
  participants: Array<GatheringParticipants>;
  minCount: number;
  totalCount: number;
  participantCount: number;
  status: string;
  averageRating: number;
  guestBookCount: number;
}

interface GatheringParticipants {
  memberId: number;
  nickName: string;
  profileImageUrl: string;
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

interface ChallengeProps {
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
  captainStatus: boolean;
}

export interface GuestbookItem {
  guestbookId: number;
  content: string;
  rating: number;
  createdAt: string;
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

export interface GatheringDetailType {
  gatheringId: number;
  captainStatus: boolean;
  participantStatus: boolean;
  title: string;
  description: string;
  mainType: '유산소형' | '무산소형' | '경기형';
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
  participants: Participant[];
  averageRating: number;
  guestBookCount: number;
}

export interface GatheringListItem {
  gatheringId: number;
  captainStatus: boolean;
  participantStatus: boolean;
  title: string;
  description: string;
  mainType: '유산소형' | '무산소형' | '경기형';
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
  participants: Participant[];
  averageRating: number;
  guestBookCount: number;
}

export interface Participant {
  memberId: number;
  nickName: string;
  profileImageUrl: string;
}

export interface CreateChallenge {
  title: string;
  description: string;
  imageUrl: string | null;
  totalCount: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface CreateGatheringForm {
  title: string;
  description: string;
  mainType: string;
  subType: string;
  imageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  mainLocation: string;
  subLocation: string;
  totalCount: number;
  minCount: number;
  tags: string[];
  challenges: CreateChallenge[];
}

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

interface GuestbookRequest {
  rating: number;
  content: string;
}

interface CalendarGathering {
  gatheringId: number;
  captainStatus: boolean;
  participantStatus: boolean;
  title: string;
  description: string;
  mainType: string;
  subType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface GatheringListParams {
  pageParam?: number;
  pageSize?: number;
  mainType?: string;
  subType?: string;
  mainLocation?: string;
  subLocation?: string;
  searchDate?: string;
  sortBy?: 'deadline' | 'participants';
  sortDirection?: 'ASC' | 'DESC';
}

export interface GatheringDetailType {
  gatheringId: number;
  captainStatus: boolean;
  participantStatus: boolean;
  title: string;
  description: string;
  mainType: '유산소형' | '무산소형' | '경기형';
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
  participants: Participant[];
  averageRating: number;
  guestBookCount: number;
}
