// hooks/useGatheringList.ts
import { useState } from 'react';
import { GatheringListItem, GatheringListParams, PageResponse } from '@/types';
import { useParticipatingGatherings, useMyHostedGatherings, useGatheringChallenges } from '@/pages/mypage/service/myGathering';

const sortGatherings = (data: PageResponse<GatheringListItem>, activeFilters: GatheringListParams) => {
  if (!data?.content) return data;

  const sortedContent = [...data.content].sort((a, b) => {
    if (activeFilters.sortBy === 'deadline') {
      return activeFilters.sortDirection === 'ASC'
        ? new Date(b.endDate).getTime() - new Date(a.endDate).getTime()  // 순서 변경
        : new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    if (activeFilters.sortBy === 'participants') {
      return activeFilters.sortDirection === 'ASC'
        ? a.totalCount - b.totalCount
        : b.totalCount - a.totalCount;
    }
    return 0;
  });

  return {
    ...data,
    content: sortedContent
  };
};

export function useGatheringList(type: 'hosted' | 'participating') {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState<GatheringListParams>({
    sortBy: 'deadline',
    sortDirection: 'ASC',
    mainLocation: '',
    subLocation: '',
    searchDate: ''
  });

  // 두 훅을 모두 호출하고 type에 따라 데이터 선택
  const hostedResult = useMyHostedGatherings(currentPage);
  const participatingResult = useParticipatingGatherings(currentPage);

  // type에 따라 적절한 데이터와 로딩 상태 선택
  const rawGatheringsData = type === 'hosted' ? hostedResult.data : participatingResult.data;
  const isLoading = type === 'hosted' ? hostedResult.isLoading : participatingResult.isLoading;

  const gatheringsData = rawGatheringsData ? sortGatherings(rawGatheringsData, activeFilters) : undefined;
  const { data: gatheringChallenges = {} } = useGatheringChallenges(gatheringsData, type === 'hosted');

  const handleFilterChange = (newFilters: GatheringListParams) => {
    setActiveFilters(newFilters);
  };

  return {
    currentPage,
    setCurrentPage,
    gatheringsData,
    isLoading,
    gatheringChallenges,
    handleFilterChange,
    activeFilters
  };
}