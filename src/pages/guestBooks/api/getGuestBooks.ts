import apiRequest from '@/utils/apiRequest';
import { QueryFunctionContext } from '@tanstack/react-query';

export interface GuestbooksListProps {
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

export interface GuestBooksList {
  content: GuestBooksListItem[];
  hasNext: boolean;
}

export interface GuestBooksListItem {
  guestbookId: number;
  guestbookScore: number;
  guestBookContent: string;
  gatheringId: number;
  mainType: '유산소형' | '무산소형' | '경기형';
  subType: string;
  gatheringTitle: string;
  gatheringImageUrl: string;
  mainLocation: string;
  subLocation: string;
  nickName: string;
  guestbookCreatedDate: string;
  gatheringStartDate: string;
  gatheringEndDate: string;
  gatheringStatus: '시작전' | '진행중' | '종료됨' | '취소됨';
}

// 한 페이지당 모임 수
const ROWS_PER_PAGE = 20;

export default async function getGuestBooks(
  filters: GuestbooksListProps,
  { pageParam = 0 }: QueryFunctionContext,
) {
  const queryParams = {
    sortBy: filters.sortBy || 'deadline',
    sortDirection: filters.sortDirection || 'ASC',
    page: String(pageParam),
    pageSize: String(ROWS_PER_PAGE),
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

  const param = `/api/v1/guestbooks?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GuestBooksList>({
    param,
  });
}
