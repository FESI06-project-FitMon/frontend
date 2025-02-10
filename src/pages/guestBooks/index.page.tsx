import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import apiRequest from '@/utils/apiRequest';
import { GetServerSideProps } from 'next';
import GuestbooksList from './components/GuestbooksList';
import { GuestBooksList, GuestbooksListProps } from './api/getGuestBooks';
import ReviewScore from './components/ReviewScore';
import { Metadata } from '@/components/common/Metadata';
import Image from 'next/image';
import FilterModal from '../main/components/FilterModal';

interface GuestBooksProps {
  dehydratedState: DehydratedState;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const ROWS_PER_PAGE = 20;
  const apiEndpoint = '/api/v1/guestbooks';

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
    queryKey: ['guestbooks', '전체', '전체'],
    queryFn: async ({ pageParam = 0 }) => {
      const queryParamsWithPage = { ...queryParams, page: String(pageParam) };
      const paramWithPage = `${apiEndpoint}?${new URLSearchParams(
        queryParamsWithPage,
      ).toString()}`;
      return await apiRequest<GuestBooksList>({
        param: paramWithPage,
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

export default function GuestBooks({ dehydratedState }: GuestBooksProps) {
  const [filters, setFilters] = useState<GuestbooksListProps>({
    mainType: '전체',
    subType: '전체',
    mainLocation: '',
    subLocation: '',
    searchDate: '',
    sortBy: 'deadline',
    sortDirection: 'ASC',
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleApplyFilters = (newFilters: GuestbooksListProps) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      mainType: prev.mainType,
      subType: prev.subType,
      mainLocation: '',
      subLocation: '',
      searchDate: '',
      sortBy: 'deadline',
      sortDirection: 'ASC',
    }));
  };

  const isFilterChanged = useMemo(() => {
    return (
      filters.mainLocation !== '' ||
      filters.subLocation !== '' ||
      filters.searchDate !== '' ||
      filters.sortBy !== 'deadline' ||
      filters.sortDirection !== 'ASC'
    );
  }, [filters]);

  return (
    <>
      <Metadata
        title="모든 방명록"
        description="FitMon의 모임에 참여한 사람들의 후기를 확인해보세요."
      />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pt-[30px] md:pt-[50px] lg:pt-20">
        {/* 메인 타입 탭 */}
        <div>
          <Tab
            items={LISTPAGE_MAINTYPE}
            currentTab={filters.mainType ?? ''}
            className="w-full relative"
            onTabChange={(newTab) => {
              setFilters((prev) => ({
                ...prev,
                mainType: newTab,
                subType: '전체',
              }));
            }}
          />
        </div>

        <div className="flex justify-end items-center my-5 lg:my-[35px] ">
          {filters.mainType !== '전체' && (
            <SubTag
              tags={LISTPAGE_SUBTYPE[filters.mainType as MainType] ?? []}
              currentTag={filters.subType ?? ''}
              onTagChange={(newTag) =>
                setFilters((prev) => ({ ...prev, subType: newTag }))
              }
              className="flex w-full justify-start"
            />
          )}

          {isFilterChanged && (
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all whitespace-pre mr-6 "
              onClick={resetFilters}
            >
              초기화
              <Image
                src={'/assets/image/arrow-clockwise.svg'}
                aria-readonly
                alt="초기화 이미지"
                width={14}
                height={14}
              />
            </button>
          )}

          {/* 필터 버튼 */}
          <div
            className="min-w-[18px] lg:min-w-16 flex gap-2.5 text-right text-sm md:text-base justify-end items-center"
            onClick={() => setShowFilterModal(true)}
          >
            <span className="hidden lg:inline-block">필터</span>
            <Image
              src={'/assets/image/filter.svg'}
              alt="필터 아이콘"
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* 필터 모달 */}
        {showFilterModal && (
          <FilterModal
            setShowFilterModal={() => setShowFilterModal(false)}
            filters={filters}
            setFilters={handleApplyFilters}
          />
        )}

        {/* 방명록 점수 */}
        <div className="mt-5 lg:mt-[30px]">
          <ReviewScore
            mainType={filters.mainType as MainType}
            subType={filters.subType ?? ''}
          />
        </div>
        {/* 방명록 리스트 */}
        <div className="mt-5 lg:mt-10 pb-20">
          <HydrationBoundary state={dehydratedState}>
            <GuestbooksList {...filters} />
          </HydrationBoundary>
        </div>
      </div>
    </>
  );
}
