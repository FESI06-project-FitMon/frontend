import { PageResponse, GatheringListItem, ChallengeType, GatheringListParams } from "@/types";
import Pagination from "@/components/common/Pagination";
import { GatheringItem } from "./GatheringItem";
import { useMemo, useState } from "react";
import Image from 'next/image';

interface GatheringListProps {
  gatherings: PageResponse<GatheringListItem>;
  gatheringChallenges: {
    [key: number]: {
      inProgressChallenges: ChallengeType[];
      doneChallenges: ChallengeType[];
    }
  };
  onCancelAction?: (gatheringId: number) => void;
  cancelActionType: 'gathering' | 'participation';
  currentPage: number;
  onPageChange: (page: number) => void;
  FilterModal: React.ComponentType<{
    setShowFilterModal: () => void;
    filters: GatheringListParams;
    setFilters: (filters: GatheringListParams) => void;
    isMyPage?: boolean;  // 여기에 추가
  }>;
  onFilterChange: (filters: GatheringListParams) => void;
  isMyPage?: boolean;
}

export default function GatheringList({
  gatherings,
  gatheringChallenges,
  onCancelAction,
  cancelActionType,
  currentPage,
  onPageChange,
  FilterModal,
  onFilterChange,
  isMyPage,
}: GatheringListProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [localFilters, setLocalFilters] = useState<GatheringListParams>({
    sortBy: 'deadline',
    sortDirection: 'ASC',
    mainLocation: '',
    subLocation: '',
    searchDate: ''
  });

  const handleFilterChange = (newFilters: GatheringListParams) => {
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderGatheringItems = useMemo(() => {
    return gatherings.content.map((gathering) => (
      gathering.gatheringId ? (
        <GatheringItem
          key={gathering.gatheringId}
          gathering={gathering}
          challenges={gatheringChallenges[gathering.gatheringId] || null}
          onCancelAction={onCancelAction}
          cancelActionType={cancelActionType}
        />
      ) : null
    ));
  }, [gatherings.content, gatheringChallenges, onCancelAction, cancelActionType]);

  return (
    <>
      <div
        className="min-w-[18px] pb-1 md:pd-0 lg:min-w-16 flex gap-2.5 text-right text-sm md:text-base justify-end items-center cursor-pointer"
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

      <div className="space-y-6 pb-[50px]">
        {renderGatheringItems}
      </div>

      {gatherings.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={currentPage}
            setPage={onPageChange}
            totalNumber={gatherings.totalElements}
            countPerPage={10}
          />
        </div>
      )}

      {showFilterModal && (
        <FilterModal
          setShowFilterModal={() => setShowFilterModal(false)}
          filters={localFilters}
          setFilters={handleFilterChange}
          isMyPage={isMyPage}
        />
      )}
    </>
  );
}