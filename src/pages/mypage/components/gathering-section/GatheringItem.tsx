// GatheringItem.tsx
import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';
import ChallengeSection from './ChallengeSection';
import MainCard from './MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import { GatheringListItem, ChallengeType } from '@/types';

interface GatheringItemProps {
  gathering: GatheringListItem;
  challenges: {
    inProgressChallenges: ChallengeType[];
    doneChallenges: ChallengeType[];
  } | null;
  onCancelAction?: (gatheringId: number) => void;
  cancelActionType: 'gathering' | 'participation';
}

export const GatheringItem = memo(function GatheringItem({
  gathering,
  challenges,
  onCancelAction,
  cancelActionType
}: GatheringItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggleChallenge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    router.push(`/detail/${gathering.gatheringId}`);
  };

  const cancelProps = cancelActionType === 'gathering'
    ? { onCancelGathering: onCancelAction }
    : { onCancelParticipation: onCancelAction };

  return (
    <div className="relative rounded-lg overflow-hidden mb-[50px]">
      <div className="cursor-pointer" onClick={handleCardClick}>
        <MainCard gathering={gathering} cancelProps={cancelProps} />
      </div>

      {challenges && (
        <div onClick={(e) => e.stopPropagation()}>
          <ChallengeSection
            challenges={challenges}
            gathering={gathering}
            isOpen={isOpen}
            onToggle={handleToggleChallenge}
          />
        </div>
      )}

      {gathering.status === '취소됨' && (
        <CanceledGathering
          type="gathering"
          gatheringStartDate={gathering.startDate}
          gatheringJoinedPeopleCount={gathering.participantCount}
          isReservationCancellable={true}
          onOverlay={() => setIsOpen(false)}
        />
      )}
    </div>
  );
});
