// MyGatheringTab.tsx
import { sortGatheringsByDate } from '@/utils/sortGatherings';
import ChallengeSection from '../gathering-section/ChallengeSection';
import MainCard from '../gathering-section/MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import Null from '@/components/common/Null';
import { useState } from 'react';
import {
  userGatherings,
  userGatheringStates,
  userGatheringChallenges
} from '@/pages/mypage/constants/constants';
import Preparing from '@/components/common/Preparing';

interface JoinGatheringProps {
  onGatheringClick: (gatheringId: number) => void;
  onCancelParticipation: (gatheringId: number) => void;
}

export default function JoinGathering({
  onCancelParticipation,
}: JoinGatheringProps) {
  const [openChallenges, setOpenChallenges] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggleChallenge = (gatheringId: number) => {
    setOpenChallenges((prev) => ({
      ...prev,
      [gatheringId]: !prev[gatheringId],
    }));
  };

  const validGatherings = userGatherings.filter(gathering => {
    const state = userGatheringStates[gathering?.gatheringId];
    return gathering && state;
  });

  if (validGatherings.length === 0) {
    return <Null message="아직 참여한 모임이 없습니다." />;
  }

  const sortedGatherings = sortGatheringsByDate(validGatherings);

  return (
    <div className="space-y-6 pb-[50px]">
      {sortedGatherings.map((gathering) => {
        const state = userGatheringStates[gathering.gatheringId];
        if (!state) return null;

        const challenges = userGatheringChallenges[gathering.gatheringId];
        const isOpen = openChallenges[gathering.gatheringId];

        return (
          <div
            key={gathering.gatheringId}
            className="relative rounded-lg overflow-hidden mb-[50px]"
          >
            <Preparing isVisible={true} message="api 준비 중인 서비스입니다..." />
            <MainCard
              gathering={gathering}
              state={state}
              onCancelParticipation={onCancelParticipation}
            />

            <ChallengeSection
              challenges={challenges}
              gathering={gathering}
              isOpen={isOpen}
              onToggle={() => handleToggleChallenge(gathering.gatheringId)}
            />

            <CanceledGathering
              type="gathering"
              gatheringStartDate={gathering.gatheringStartDate}
              gatheringJoinedPeopleCount={state.gatheringJoinedPeopleCount}
              isReservationCancellable={gathering.isReservationCancellable || false}
              onOverlay={() => {
                setOpenChallenges((prev) => ({
                  ...prev,
                  [gathering.gatheringId]: false,
                }));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}