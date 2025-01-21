import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import LikesGatheringsList from './components/LikesGatheringsList';
import apiRequest from '@/utils/apiRequest';
import { GetServerSideProps } from 'next';
import { getLikes } from '@/utils/likesgathering';
import { GatheringList } from '@/types';

interface RequestData {
  gatheringIds: number[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const ROWS_PER_PAGE = 8;
  const apiEndpoint = '/api/v1/gatherings/likes';

  // 서버 전용 QueryClient 생성
  const queryClient = new QueryClient();

  // 쿼리 파라미터 설정
  const queryParams = {
    sortBy: 'deadline',
    sortDirection: 'ASC',
    page: '0',
    pageSize: String(ROWS_PER_PAGE),
  };

  // 무한스크롤에 사용할 데이터 미리 가져오기
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['likesGatherings', '전체', '전체'],
    queryFn: async ({ pageParam = 0 }) => {
      const queryParamsWithPage = { ...queryParams, page: String(pageParam) };
      const paramWithPage = `${apiEndpoint}?${new URLSearchParams(
        queryParamsWithPage,
      ).toString()}`;
      return await apiRequest<GatheringList, RequestData>({
        param: paramWithPage,
        method: 'post',
        requestData: { gatheringIds: getLikes() },
      });
    },
    initialPageParam: 0,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function LikesGatherings() {
  const [mainType, setMainType] = useState<MainType>('전체'); // 메인 타입 상태
  const [subType, setSubType] = useState('전체'); // 서브 타입 상태

  return (
    <div className="max-w-screen-xl mx-auto px-8">
      {/* 메인 타입 탭 */}
      <div className="mt-20">
        <Tab
          items={LISTPAGE_MAINTYPE}
          currentTab={mainType}
          onTabChange={(newTab) => {
            setMainType(newTab as MainType);
            setSubType('전체'); // 메인 타입 변경 시 서브 타입 초기화
          }}
        />
      </div>

      {/* 서브 타입 태그 */}
      <div className="mt-7">
        {mainType !== '전체' && (
          <SubTag
            tags={LISTPAGE_SUBTYPE[mainType]}
            currentTag={subType}
            onTagChange={(newTag) => setSubType(newTag)}
          />
        )}
      </div>

      {/* 모임 카드 리스트 */}
      <div className="mt-7 pb-20">
        <HydrationBoundary>
          <LikesGatheringsList mainType={mainType} subType={subType} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
