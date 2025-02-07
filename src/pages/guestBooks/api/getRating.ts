import apiRequest from '@/utils/apiRequest';
import { useQuery } from '@tanstack/react-query';

export interface RatingCounts {
  '5점': number;
  '4점': number;
  '3점': number;
  '2점': number;
  '1점': number;
}

export interface getRatingResponse {
  averageRating: number;
  ratingCounts: RatingCounts;
  totalCounts: number;
}

export interface ReviewScoreProps {
  mainType: string;
  subType: string;
}

async function getRating({
  mainType,
  subType,
}: ReviewScoreProps): Promise<getRatingResponse> {
  const queryParams = {
    ...(mainType !== '전체' && { mainType }),
    ...(subType !== '전체' && { subType }),
  };

  const param = `/api/v1/guestbooks/scores?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<getRatingResponse>({
    param,
  });
}

export default function useGuestbookRating({
  mainType,
  subType,
}: ReviewScoreProps) {
  return useQuery<getRatingResponse>({
    queryKey: ['guestbookScores', mainType, subType],
    queryFn: () => getRating({ mainType, subType }),
  });
}
