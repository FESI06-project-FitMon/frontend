// components/gathering/GatheringList.tsx
import { useState } from 'react';
import { sortGatheringsByDate } from '@/utils/sortGatherings';
import ChallengeSection from '../gathering-section/ChallengeSection';
import MainCard from '../gathering-section/MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import Null from '@/components/common/Null';
import Preparing from '@/components/common/Preparing';
import { GatheringItem, GatheringStateType, GatheringChallengeType } from '@/types';

interface GatheringListProps {
  gatherings: GatheringItem[];
  gatheringStates: { [key: number]: GatheringStateType };
  gatheringChallenges: { [key: number]: GatheringChallengeType };
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

  const validGatherings = gatherings.filter(gathering => {
    const state = gatheringStates[gathering?.gatheringId];
    return gathering && state;
  });

  if (validGatherings.length === 0) {
    return <Null message={emptyMessage} />;
  }

  const sortedGatherings = sortGatheringsByDate(validGatherings);

  return (
    <div className="space-y-6 pb-[50px]">
      {sortedGatherings.map((gathering) => {
        const state = gatheringStates[gathering.gatheringId];
        if (!state) return null;

        const challenges = gatheringChallenges[gathering.gatheringId];
        const isOpen = openChallenges[gathering.gatheringId];

        const cancelProps = cancelActionType === 'gathering'
          ? { onCancelGathering: onCancelAction }
          : { onCancelParticipation: onCancelAction };

        return (
          <div
            key={gathering.gatheringId}
            className="relative rounded-lg overflow-hidden mb-[50px]"
          >
            <Preparing isVisible={true} message="api 준비 중인 서비스입니다..." />

            <MainCard
              gathering={{
                ...gathering,
                gatheringMainType: gathering.gatheringMainType,
                gatheringSubType: gathering.gatheringSubType,
                gatheringSi: gathering.gatheringSi,
                gatheringGu: gathering.gatheringGu,
                captainStatus: gathering.captainStatus,
                isReservationCancellable: gathering.isReservationCancellable
              }}
              state={{
                ...state,
                gatheringJoinedFivePeopleImages: state.gatheringJoinedFivePeopleImages || [],
                gatheringAverageRating: state.gatheringAverageRating,
                gatheringGuestbookCount: state.gatheringGuestbookCount,
                gatheringMaxPeopleCount: state.gatheringMaxPeopleCount,
                gatheringMinPeopleCount: state.gatheringMinPeopleCount
              }}
              {...cancelProps}
            />

            {challenges && (
              <ChallengeSection
                challenges={{
                  inProgressChallenges: challenges.inProgressChallenges || [],
                  doneChallenges: challenges.doneChallenges || []
                }}
                gathering={gathering}
                isOpen={isOpen}
                onToggle={() => handleToggleChallenge(gathering.gatheringId)}
              />
            )}

            <CanceledGathering
              type="gathering"
              gatheringStartDate={gathering.gatheringStartDate}
              gatheringJoinedPeopleCount={state.gatheringJoinedPeopleCount}
              isReservationCancellable={gathering.isReservationCancellable || false}
              onOverlay={() => {
                setOpenChallenges(prev => ({
                  ...prev,
                  [gathering.gatheringId]: false
                }));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}