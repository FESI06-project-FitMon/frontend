import { useState } from 'react';
import { useRouter } from 'next/router'; // useRouter 추가
import ChallengeSection from '../gathering-section/ChallengeSection';
import MainCard from '../gathering-section/MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import Null from '@/components/common/Null';
import { GatheringListItem, ChallengeType } from '@/types';

interface GatheringListProps {
  gatherings: GatheringListItem[];
  gatheringStates: GatheringListItem[];
  gatheringChallenges: { [key: number]: { inProgressChallenges: ChallengeType[]; doneChallenges: ChallengeType[] } };
  emptyMessage: string;
  onCancelAction?: (gatheringId: number) => void;
  cancelActionType: 'gathering' | 'participation';
}

export default function GatheringList({
  gatherings,
  gatheringChallenges,
  emptyMessage,
  onCancelAction,
  cancelActionType,
}: GatheringListProps) {
  const [openChallenges, setOpenChallenges] = useState<{ [key: number]: boolean }>({});
  const router = useRouter(); // useRouter 추가

  const handleToggleChallenge = (gatheringId: number) => {
    console.log(`Toggling challenges for gatheringId: ${gatheringId}`);
    setOpenChallenges((prev) => ({
      ...prev,
      [gatheringId]: !prev[gatheringId],
    }));
  };

  const handleCardClick = (gatheringId: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // 참여 취소 버튼 클릭 시 리다이렉션 방지
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      console.log(`Button clicked inside card of gatheringId: ${gatheringId}, preventing redirection.`);
      return;
    }
    console.log(`Navigating to details page for gatheringId: ${gatheringId}`);
    router.push(`/detail/${gatheringId}`); // 상세 페이지로 이동
  };

  if (!gatherings || gatherings.length === 0) {
    console.log('No gatherings available:', gatherings);
    return <Null message={emptyMessage} />;
  }

  console.log('Gatherings data received:', gatherings);

  return (
    <div className="space-y-6 pb-[50px]">
      {gatherings.map((gathering) => {
        if (!gathering.gatheringId) {
          console.error('Invalid gathering object:', gathering);
          return null;
        }

        const challenges = gatheringChallenges[gathering.gatheringId] || null;
        const isOpen = openChallenges[gathering.gatheringId];

        console.log('Rendering gathering:', gathering);
        console.log(`Challenges for gatheringId ${gathering.gatheringId}:`, challenges);

        const cancelProps =
          cancelActionType === 'gathering'
            ? { onCancelGathering: onCancelAction }
            : { onCancelParticipation: onCancelAction };

        return (
          <div
            key={gathering.gatheringId}
            className="relative rounded-lg overflow-hidden mb-[50px] cursor-pointer"
            onClick={(e) => handleCardClick(gathering.gatheringId, e)} // 카드 클릭 이벤트 추가
          >
            <MainCard gathering={gathering} cancelProps={cancelProps} />

            {/* 챌린지 섹션 렌더링 조건 */}
            {challenges && (
              <ChallengeSection
                challenges={challenges}
                gathering={gathering}
                isOpen={isOpen}
                onToggle={() => handleToggleChallenge(gathering.gatheringId)}
              />
            )}

            {/* 취소된 모임 처리 */}
            {gathering.status === '취소됨' && (
              <CanceledGathering
                type="gathering"
                gatheringStartDate={gathering.startDate}
                gatheringJoinedPeopleCount={gathering.participantCount}
                isReservationCancellable={true}
                onOverlay={() => {
                  console.log(`Closing challenges for canceled gatheringId: ${gathering.gatheringId}`);
                  setOpenChallenges((prev) => ({
                    ...prev,
                    [gathering.gatheringId]: false,
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
