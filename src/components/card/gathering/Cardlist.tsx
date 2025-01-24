import { useInfiniteQuery } from '@tanstack/react-query';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import Card from './Card';
import { useGatheringListQuery } from '@/pages/main/api/fetchGatheringList';
import { MainType } from '@/constants/MainList';

interface CardlistProps {
  mainType: MainType;
  subType: string;
}

export default function CardList({ mainType, subType }: CardlistProps) {
  const pageSize = 6;

  const { queryKey, queryFn, getNextPageParam } = useGatheringListQuery(
    mainType,
    subType,
    pageSize,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: 0,
  });

  const observerRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
  });

  if (isLoading) {
    return <Null message="로딩중입니다." />;
  }

  if (error) {
    return <Null message="데이터를 불러오는 중 오류가 발생했습니다." />;
  }

  if (data?.pages.every((page) => page.content.length === 0)) {
    return <Null message="모임 정보가 없습니다." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {data?.pages.flatMap((page) =>
          page.content.map((gathering) => (
            <Card key={gathering.gatheringId} data={gathering} />
          )),
        )}
      </div>
      {hasNextPage && <div ref={observerRef} className="h-[1px]" />}
    </>
  );
}
