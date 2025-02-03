import { useParticipatingGatherings, useCancelParticipation, useGatheringChallenges } from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';
import { useState } from 'react';

export default function JoinGathering() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: gatheringsData, isLoading } = useParticipatingGatherings(currentPage);
  const { mutateAsync: cancelParticipation } = useCancelParticipation();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(gatheringsData, false);

  if (isLoading || !gatheringsData?.content?.length) {
    return (
      <StateData
        isLoading={isLoading}
        emptyMessage="참여한 모임이 없습니다."
      />
    );
  }

  return (
    <GatheringList
      gatherings={gatheringsData}
      gatheringChallenges={gatheringChallenges}
      onCancelAction={cancelParticipation}
      cancelActionType="participation"
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}