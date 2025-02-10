import apiRequest from '@/utils/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { GuestbooksListProps } from './getGuestBooks';

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

async function getRating(
  filters: GuestbooksListProps,
): Promise<getRatingResponse> {
  const queryParams = {
    ...(filters.mainType && filters.mainType !== '전체'
      ? { mainType: filters.mainType }
      : {}),
    ...(filters.subType && filters.subType !== '전체'
      ? { subType: filters.subType }
      : {}),
    ...(filters.mainLocation && { mainLocation: filters.mainLocation }),
    ...(filters.subLocation && { subLocation: filters.subLocation }),
    ...(filters.searchDate && { searchDate: filters.searchDate }),
  };

  const param = `/api/v1/guestbooks/scores?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<getRatingResponse>({
    param,
  });
}

export default function useGuestbookRating(filters: GuestbooksListProps) {
  return useQuery<getRatingResponse>({
    queryKey: ['guestbookScores', filters],
    queryFn: () => getRating(filters),
  });
}
