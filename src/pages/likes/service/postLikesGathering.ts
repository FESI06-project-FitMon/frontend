import { GatheringList } from '@/types';
import apiRequest from '@/utils/apiRequest';
import { getLikes } from '@/utils/likesgathering';
import { MainType } from '@/constants/MainList';
import { QueryFunctionContext } from '@tanstack/react-query';

export interface likesGatheringsProps {
  mainType: MainType;
  subType: string;
}

interface RequestData {
  gatheringIds: number[];
}
// 한 페이지당 모임 수
const ROWS_PER_PAGE = 8;

export default async function postLikesGatherings(
  { mainType, subType }: likesGatheringsProps,
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

  const param = `/api/v1/gatherings/likes?${new URLSearchParams(queryParams).toString()}`;
  return await apiRequest<GatheringList, RequestData>({
    param,
    method: 'post',
    requestData: { gatheringIds: getLikes() },
  });
}
