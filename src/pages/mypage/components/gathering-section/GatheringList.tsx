import React, { useState } from 'react';
import { GatheringItem } from './GatheringItem';
import Pagination from '@/components/common/Pagination';
import { GatheringListItem, ChallengeType } from '@/types';

interface GatheringListProps {
  gatherings: GatheringListItem[];
  gatheringChallenges: {
    [key: number]: {
      inProgressChallenges: ChallengeType[];
      doneChallenges: ChallengeType[];
    }
  };
  onCancelAction?: (gatheringId: number) => void;
  cancelActionType: 'gathering' | 'participation';
}

export default function GatheringList({
  gatherings,
  gatheringChallenges,
  onCancelAction,
  cancelActionType,
}: GatheringListProps) {
  const [page, setPage] = useState(0);
  const countPerPage = 10;

  const paginatedGatherings = gatherings.slice(
    page * countPerPage,
    (page + 1) * countPerPage
  );

  return (
    <>
      <div className="space-y-6 pb-[50px]">
        {paginatedGatherings.map((gathering) => (
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
      <Pagination
        page={page}
        setPage={setPage}
        totalNumber={gatherings.length}
        countPerPage={countPerPage}
      />
    </>
  );
}