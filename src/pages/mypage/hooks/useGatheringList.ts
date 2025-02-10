// hooks/useGatheringList.ts
import { useState } from 'react';
import { GatheringListItem, GatheringListParams, PageResponse } from '@/types';
import { useParticipatingGatherings, useMyHostedGatherings, useGatheringChallenges } from '@/pages/mypage/service/myGathering';

const sortGatherings = (data: PageResponse<GatheringListItem>, activeFilters: GatheringListParams) => {
  if (!data?.content) return data;

  const sortedContent = [...data.content].sort((a, b) => {
    if (activeFilters.sortBy === 'deadline') {
      return activeFilters.sortDirection === 'ASC'
        ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
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

  // type에 따라 다른 query hook 사용
  const { data: rawGatheringsData, isLoading } = type === 'hosted'
    ? useMyHostedGatherings(currentPage)
    : useParticipatingGatherings(currentPage);

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