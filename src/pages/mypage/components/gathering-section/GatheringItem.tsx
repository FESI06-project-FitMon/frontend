import React, { memo, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
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

  // 이벤트 버블링 방지
  const handleContentClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement &&
      (e.target.tagName === 'BUTTON' || e.target.closest('button'))) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 챌린지 섹션 열기/닫기
  const handleToggleChallenge = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // 취소 액션 Props 설정
  const cancelProps =
    cancelActionType === 'gathering'
      ? { onCancelGathering: onCancelAction }
      : { onCancelParticipation: onCancelAction };

  return (
    <div className="relative rounded-lg overflow-hidden mb-[50px]">
      <Link href={`/detail/${gathering.gatheringId}`}>
        <div className="cursor-pointer" onClick={handleContentClick}>
          <MainCard gathering={gathering} cancelProps={cancelProps} />
        </div>

        {challenges && (
          <div onClick={handleToggleChallenge}>
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
      </Link>
    </div>
  );
});