import {
  useParticipatingGatherings,
  useCancelParticipation,
  useGatheringChallenges,
} from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';
import { useState } from 'react';
import { Metadata } from '@/components/common/Metadata';
import FilterModal from '@/pages/main/components/FilterModal';

export default function JoinGathering() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: gatheringsData, isLoading } = useParticipatingGatherings(currentPage);
  const { mutateAsync: cancelParticipation } = useCancelParticipation();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(
    gatheringsData,
    false,
  );

  return (
    <>
      <Metadata
        title="내가 참여한 모임"
        description="fitmon에서 내가 참여한 모임을 확인하세요. 나의 모임 정보를 제공합니다."
      />

      {isLoading || !gatheringsData?.content?.length ? (
        <StateData
          isLoading={isLoading}
          emptyMessage="참여한 모임이 없습니다."
        />
      ) : (
        <GatheringList
          gatherings={gatheringsData}
          gatheringChallenges={gatheringChallenges}
          onCancelAction={cancelParticipation}
          cancelActionType="participation"
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          FilterModal={FilterModal} 
        />
      )}
    </>
  );
}