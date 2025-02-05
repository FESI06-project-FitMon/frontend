import { PageResponse, GatheringListItem, ChallengeType } from "@/types";
import  Pagination  from "@/components/common/Pagination";
import { GatheringItem } from "./GatheringItem";

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
  return (
    <>
      <div className="space-y-6 pb-[50px]">
        {gatherings.content.map((gathering) => (
          gathering.gatheringId ? (
            <GatheringItem
              key={gathering.gatheringId}
              gathering={gathering}
              challenges={gatheringChallenges[gathering.gatheringId] || null}
              onCancelAction={onCancelAction}
              cancelActionType={cancelActionType}
            />
          ) : null
        ))}
      </div>
      {gatherings.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            page={currentPage}
            setPage={onPageChange}
            totalNumber={gatherings.totalElements}
            countPerPage={10}  // API의 pageSize와 동일하게 설정
          />
        </div>
      )}
    </>
  );
}