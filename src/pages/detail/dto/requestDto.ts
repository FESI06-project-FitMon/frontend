export interface GatheringUpdateRequest {
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

export interface ChallengeCreateRequest {
  title: string;
  description: string;
  imageUrl: string;
  totalCount: number;
  startDate: string;
  endDate: string;
}
