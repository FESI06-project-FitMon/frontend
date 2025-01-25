import { useState } from 'react';
import { sortGatheringsByDate } from '@/utils/sortGatherings';
import ChallengeSection from '../gathering-section/ChallengeSection';
import MainCard from '../gathering-section/MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import Null from '@/components/common/Null';
import { GatheringListItem, ChallengeType } from '@/types';

interface GatheringListProps {
  gatherings: GatheringListItem[];
  gatheringStates: GatheringListItem[];
  gatheringChallenges: { [key: number]: { inProgressChallenges: ChallengeType[], doneChallenges: ChallengeType[] } };
  emptyMessage: string;
  onCancelAction?: (gatheringId: number) => void;
  cancelActionType: 'gathering' | 'participation';
}

export default function GatheringList({
  gatherings,
  gatheringStates,
  gatheringChallenges,
  emptyMessage,
  onCancelAction,
  cancelActionType,
}: GatheringListProps) {
  const [openChallenges, setOpenChallenges] = useState<{ [key: number]: boolean }>({});

  const handleToggleChallenge = (gatheringId: number) => {
    setOpenChallenges(prev => ({
      ...prev,
      [gatheringId]: !prev[gatheringId]
    }));
  };

  if (!gatherings.length) {
    return <Null message={emptyMessage} />;
  }

  const sortedGatherings = sortGatheringsByDate(gatherings);

  return (
    <div className="space-y-6 pb-[50px]">
      {sortedGatherings.map((gathering) => {
        const challenges = gatheringChallenges[gathering.gatheringId];
        const isOpen = openChallenges[gathering.gatheringId];

        const cancelProps = cancelActionType === 'gathering'
          ? { onCancelGathering: onCancelAction }
          : { onCancelParticipation: onCancelAction };

        return (
          <div key={gathering.gatheringId} className="relative rounded-lg overflow-hidden mb-[50px]">
            <MainCard
              gathering={gathering}
              cancelProps={cancelProps}
            />

            {challenges && (
              <ChallengeSection
                challenges={challenges}
                gathering={gathering}
                isOpen={isOpen}
                onToggle={() => handleToggleChallenge(gathering.gatheringId)}
              />
            )}

            {gathering.status === "취소됨" && (
              <CanceledGathering
                type="gathering"
                gatheringStartDate={gathering.startDate}
                gatheringJoinedPeopleCount={gathering.participantCount}
                isReservationCancellable={true}
                onOverlay={() => {
                  setOpenChallenges(prev => ({
                    ...prev,
                    [gathering.gatheringId]: false
                  }));
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}