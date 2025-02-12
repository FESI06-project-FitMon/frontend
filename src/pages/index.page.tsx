import { useState, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import CardList from '@/components/card/gathering/CardList';
import Button from '@/components/common/Button';
import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import ListChallenge from '@/pages/main/components/ListChallenge';
import FilterModal from './main/components/FilterModal';
import CreateGathering from './main/components/CreateGatheringModal';
import Alert from '@/components/dialog/Alert';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
  DehydratedState,
} from '@tanstack/react-query';
import {
  prefetchGatheringList,
  useGatheringListQuery,
} from '@/pages/main/service/gatheringService';
import { GatheringListParams } from '@/types';
import useMemberStore from '@/stores/useMemberStore';
import Image from 'next/image';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';
import { Metadata } from '@/components/common/Metadata';

interface HomeProps {
  dehydratedState: DehydratedState;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await prefetchGatheringList(queryClient, {
    mainType: '',
    subType: '',
    mainLocation: '',
    subLocation: '',
    searchDate: '',
    sortBy: 'deadline',
    sortDirection: 'ASC',
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home({ dehydratedState }: HomeProps) {
  const [filters, setFilters] = useState<GatheringListParams>({
    mainType: '전체',
    subType: '전체',
    mainLocation: '',
    subLocation: '',
    searchDate: '',
    sortBy: 'deadline',
    sortDirection: 'ASC',
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { isLogin } = useMemberStore();
  const router = useRouter();

  const queryResults = useGatheringListQuery(filters);

  const handleApplyFilters = (newFilters: GatheringListParams) => {
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
        title="Home"
        description="모임에 가입하고, 챌린지에 참여해 성공률을 높여보세요!"
      />

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pt-[30px] md:pt-[50px] lg:pt-20 pb-20">
        <h2 className="text-xl md:text-[1.75rem] font-semibold pb-5 md:pb-[30px]">
          지금 핫한 챌린지 🔥
        </h2>

        <div className="overflow-hidden">
          <ListChallenge />
        </div>

        {/* 메인 탭 */}
        <div className="w-full mt-[30px] md:mt-[50px] lg:mt-20">
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
            rightElement={
              <div className="hidden lg:flex w-full justify-end">
                <Button
                  style="custom"
                  name="모임 만들기"
                  className="text-base my-2 -mt-2 h-9 w-[126px]"
                  handleButtonClick={() =>
                    isLogin ? setShowCreateModal(true) : setShowAlert(true)
                  }
                />
              </div>

            }
          />
        </div>
        {/* 두 컴포넌트 사이 간격을 제어하는 div 추가 */}
        <div className="h-5 lg:h-[35px]" />
        {/* 필터 영역 */}
        <div className="flex justify-end items-center mb-5 lg:mb-[35px]">
          {/* 전체 탭일 때도 같은 높이의 빈 div 유지 */}
          <div className="flex w-full">
            {filters.mainType !== '전체' ? (
              <SubTag
                tags={LISTPAGE_SUBTYPE[filters.mainType as MainType] ?? []}
                currentTag={filters.subType ?? ''}
                onTagChange={(newTag) =>
                  setFilters((prev) => ({ ...prev, subType: newTag }))
                }
                className="flex w-full justify-start"
              />
            ) : (
              // SubTag 버튼의 py-1 md:py-2 패딩값을 고려한 높이 설정
              <div className="h-[28px] md:h-[40px]" /> // 모바일: py-1(8px) * 2 + 텍스트(12px), 데스크톱: py-2(16px) * 2 + 텍스트(16px)
            )}
          </div>

          {isFilterChanged && (
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all whitespace-pre mr-6"
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

        {/* 모임 만들기 모달  */}
        {showCreateModal && (
          <CreateGathering
            setShowCreateModal={() => setShowCreateModal(false)}
          />
        )}

        {/* 카드 리스트 */}
        <div>
          <HydrationBoundary state={dehydratedState}>
            <CardList filters={filters} />
          </HydrationBoundary>
        </div>

        {/* 더 보기 버튼 */}
        <div className="text-center mt-5">
          {queryResults.hasNextPage && (
            <Button
              style="custom"
              name="더 보기"
              className="text-base h-9 w-[126px]"
              handleButtonClick={() => queryResults.fetchNextPage()}
            />
          )}
        </div>

        {/* 알럿 컴포넌트 */}
        {showAlert && (
          <Alert
            isOpen={showAlert}
            type="confirm"
            message="로그인이 필요합니다."
            onConfirm={() => {
              setShowAlert(false);
              router.push('/login');
            }}
            onCancel={() => setShowAlert(false)}
          />
        )}
      </div>
      {/* 모바일/태블릿용 고정 버튼 - 메인 컨테이너 밖으로 이동 */}
      <div className="lg:hidden fixed right-6 bottom-10 z-50">
        <Button
          style="custom"
          name="모임 만들기"
          className="text-base h-9 w-[126px]"
          handleButtonClick={() => isLogin ? setShowCreateModal(true) : setShowAlert(true)}
        />
      </div>
    </>
  );
}
