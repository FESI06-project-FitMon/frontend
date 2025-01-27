import React from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import Card from './Card';
import { useGatheringListQuery } from '@/pages/main/service/gatheringService';
import { MainType } from '@/constants/MainList';
import Image from 'next/image';

interface CardListProps {
  mainType: MainType;
  subType: string;
}

export default function CardList({ mainType, subType }: CardListProps) {
  // React Query 훅 사용
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGatheringListQuery(mainType, subType, 6);

  // 무한 스크롤 설정
  const observerRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
  });

  // 로딩 상태 처리
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

  // 에러 처리
  if (error) {
    return <Null message="데이터를 불러오는 중 오류가 발생했습니다." />;
  }

  // 데이터 없을 때 처리
  if (data?.pages.every((page) => page.content.length === 0)) {
    return <Null message="모임 정보가 없습니다." />;
  }

  // 데이터 렌더링
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
