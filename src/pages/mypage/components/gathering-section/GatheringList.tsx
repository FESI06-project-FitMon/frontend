import { PageResponse, GatheringListItem, ChallengeType } from "@/types";
import Pagination from "@/components/common/Pagination";
import { GatheringItem } from "./GatheringItem";
import { useMemo } from "react";

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
}
export default function GatheringList({
  gatherings,
  gatheringChallenges,
  onCancelAction,
  cancelActionType,
  currentPage,
  onPageChange,
}: GatheringListProps) {

  // 리스트 아이템 최적화
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
      <div className="space-y-6 pb-[50px]">
        {renderGatheringItems}
      </div>
      {gatherings.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={currentPage}
            setPage={onPageChange}
            totalNumber={gatherings.totalElements}
            countPerPage={10}
          />
        </div>
      )}
    </>
  );
}