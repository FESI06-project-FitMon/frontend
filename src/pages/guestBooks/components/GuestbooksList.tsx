import GuestbookCard from '@/components/card/guestbook/GuestbookCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import getGuestBooks, {
  GuestBooksList,
  GuestbooksListProps,
} from '../api/getGuestBooks';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import normalizeGuestbook from '../utils/normalizeGuestbook';

export default function GuestbooksList(filters: GuestbooksListProps) {
  // React Query를 사용한 무한 스크롤 데이터 처리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<GuestBooksList, Error>({
    queryKey: ['guestBooks', filters],
    queryFn: (context) => getGuestBooks(filters, context),
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
    return <Null message="방명록 정보가 없습니다." />;
  }

  return (
    <>
      {data?.pages.map((page, pageIndex) => {
        const isLastPage = pageIndex === data.pages.length - 1; // 현재 페이지가 마지막 페이지인지 확인

        return (
          <div key={`page-${pageIndex}`}>
            {/* 데이터가 없고 마지막 페이지가 아닌 경우에만 Null 표시 */}
            {page.content.length === 0 && !isLastPage ? (
              <Null message="이 페이지에는 방명록 정보가 없습니다." />
            ) : (
              <div className="grid gap-6">
                {page.content.map((guestbook) => {
                  const { guestbookData, gatheringData } =
                    normalizeGuestbook(guestbook);
                  return (
                    <GuestbookCard
                      key={guestbookData.guestbookId}
                      guestbook={guestbookData}
                      gathering={gatheringData}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* 무한 스크롤의 끝 감지용 요소 */}
      {hasNextPage && <div ref={observerRef} style={{ height: '1px' }} />}
    </>
  );
}
