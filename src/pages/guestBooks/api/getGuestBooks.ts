import apiRequest from '@/utils/apiRequest';
import { MainType } from '@/constants/MainList';
import { QueryFunctionContext } from '@tanstack/react-query';

export interface GuestbooksListProps {
  mainType: MainType;
  subType: string;
}

export interface GuestBooksList {
  content: GuestBooksListItem[];
  hasNext: boolean;
}

export interface GuestBooksListItem {
  guestbookId: number;
  guestbookScore: number;
  guestBookContent: string;
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
  { mainType, subType }: GuestbooksListProps,
  { pageParam = 0 }: QueryFunctionContext,
) {
  const queryParams = {
    sortBy: 'deadline',
    sortDirection: 'ASC',
    page: String(pageParam),
    pageSize: String(ROWS_PER_PAGE),
    ...(mainType !== '전체' && { mainType }),
    ...(subType !== '전체' && { subType }),
  };

  const param = `/api/v1/guestbooks?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GuestBooksList>({
    param,
  });
}
