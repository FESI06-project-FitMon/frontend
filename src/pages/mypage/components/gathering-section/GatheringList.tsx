import { useState } from 'react';
import { useRouter } from 'next/router'; // useRouter 추가
import ChallengeSection from '../gathering-section/ChallengeSection';
import MainCard from '../gathering-section/MainCard';
import CanceledGathering from '@/components/common/CanceledGathering';
import Null from '@/components/common/Null';
import { GatheringListItem, ChallengeType } from '@/types';
import Pagination from '@/components/common/Pagination';

interface GatheringListProps {
  gatherings: GatheringListItem[];
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
  const router = useRouter();
  const [page, setPage] = useState(0);
  const countPerPage = 10;

  const handleToggleChallenge = (gatheringId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setOpenChallenges((prev) => ({
      ...prev,
      [gatheringId]: !prev[gatheringId],
    }));
  };

  const handleCardClick = (gatheringId: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    // 참여 취소 버튼 클릭 시 리다이렉션 방지
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    router.push(`/detail/${gatheringId}`); // 상세 페이지로 이동
  };

  if (!gatherings || gatherings.length === 0) {
    return <Null message={emptyMessage} />;
  }

  const paginatedGatherings = gatherings.slice(
    page * countPerPage,
    (page + 1) * countPerPage
  );

  return (
    <>
      <div className="space-y-6 pb-[50px]">
        {paginatedGatherings.map((gathering) => {
          if (!gathering.gatheringId) return null;

          const challenges = gatheringChallenges[gathering.gatheringId] || null;
          const isOpen = openChallenges[gathering.gatheringId];
          const cancelProps = cancelActionType === 'gathering'
            ? { onCancelGathering: onCancelAction }
            : { onCancelParticipation: onCancelAction };

          return (
            <div
              key={gathering.gatheringId}
              className="relative rounded-lg overflow-hidden mb-[50px]"
            >
              <div className="cursor-pointer" onClick={(e) => handleCardClick(gathering.gatheringId, e)}>
                <MainCard gathering={gathering} cancelProps={cancelProps} />
              </div>

              {challenges && (
                <div onClick={(e) => e.stopPropagation()}>
                  <ChallengeSection
                    challenges={challenges}
                    gathering={gathering}
                    isOpen={isOpen}
                    onToggle={(e) => handleToggleChallenge(gathering.gatheringId, e)}
                  />
                </div>
              )}

              {gathering.status === '취소됨' && (
                <CanceledGathering
                  type="gathering"
                  gatheringStartDate={gathering.startDate}
                  gatheringJoinedPeopleCount={gathering.participantCount}
                  isReservationCancellable={true}
                  onOverlay={() => {
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
      <Pagination
        page={page}
        setPage={setPage}
        totalNumber={gatherings.length}
        countPerPage={countPerPage}
      />
    </>
  );
}