import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import Card from './Card';
import { GatheringList } from '@/types';
import apiRequest from '@/utils/apiRequest';
import { MainType } from '@/constants/MainList';

interface CardlistProps {
  mainType: MainType;
  subType: string;
}

export default function Cardlist({ mainType, subType }: CardlistProps) {
  const pageSize = 6; // 한 페이지당 아이템 수

  // 데이터 페치 함수
  const fetchGatherings = async ({ pageParam = 0 }: QueryFunctionContext) => {
    const apiEndpoint = '/api/v1/gatherings';
    const queryParams = {
      sortBy: 'deadline',
      sortDirection: 'ASC',
      page: String(pageParam),
      pageSize: String(pageSize),
      ...(mainType !== '전체' && { mainType }),
      ...(subType !== '전체' && { subType }),
    };

    const param = `${apiEndpoint}?${new URLSearchParams(queryParams).toString()}`;
    return await apiRequest<GatheringList>({ param });
  };

  // React Query를 사용한 무한 스크롤 데이터 처리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<GatheringList, Error>({
    queryKey: ['gatheringList', mainType, subType],
    queryFn: fetchGatherings,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.content.length > 0 ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  // 무한 스크롤 옵저버 연결
  const observerRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
  });

  // 로딩 상태 처리
  if (isLoading) {
    return <Null message="로딩중입니다." />;
  }

  // 오류 상태 처리
  if (error) {
    return <Null message="데이터를 불러오는 중 오류가 발생했습니다." />;
  }

  // 전체 데이터가 비어 있는 경우 처리
  if (data?.pages.every((page) => page.content.length === 0)) {
    return <Null message="모임 정보가 없습니다." />;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        {data?.pages.map((page, pageIndex) => {
          const isLastPage = pageIndex === data.pages.length - 1; // 현재 페이지가 마지막 페이지인지 확인

          return (
            <div key={`page-${pageIndex}`} className="col-span-2">
              {/* 데이터가 없고 마지막 페이지가 아닌 경우에만 Null 표시 */}
              {page.content.length === 0 && !isLastPage ? (
                <Null message="이 페이지에는 모임 정보가 없습니다." />
              ) : (
                <div className="grid grid-cols-2 gap-5">
                  {page.content.map((gathering) => (
                    <Card key={gathering.gatheringId} data={gathering} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* 무한 스크롤의 끝 감지용 요소 */}
      {hasNextPage && <div ref={observerRef} style={{ height: '1px' }} />}
    </>
  );
}
