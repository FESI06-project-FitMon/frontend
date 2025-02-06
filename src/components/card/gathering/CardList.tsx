import React from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import Card from './Card';
import { useGatheringListQuery } from '@/pages/main/service/gatheringService';
import { GatheringListParams } from '@/types';
import Image from 'next/image';

interface CardListProps {
  filters: GatheringListParams;
}

export default function CardList({ filters }: CardListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGatheringListQuery(filters);

  const observerRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
  });

  if (isLoading) {
    return (
      <Null
        svg={
          <Image
            src={'/assets/image/spinner.svg'}
            alt="로딩 스피너"
            width={50}
            height={50}
          />
        }
      />
    );
  }

  if (error) {
    return <Null message="데이터를 불러오는 중 오류가 발생했습니다." />;
  }

  if (data?.pages.every((page) => page.content.length === 0)) {
    return <Null message="모임 정보가 없습니다." />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-[20px] lg:gap-5">
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
