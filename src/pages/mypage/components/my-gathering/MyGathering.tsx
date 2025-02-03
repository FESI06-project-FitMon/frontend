import { useMyHostedGatherings, useCancelGathering, useGatheringChallenges } from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';
import { useState } from 'react';

export default function MyGathering() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: gatheringsData, isLoading } = useMyHostedGatherings(currentPage);
  const { mutateAsync: cancelGathering } = useCancelGathering();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(gatheringsData);

  if (isLoading || !gatheringsData?.content?.length) {
    return (
      <StateData
        isLoading={isLoading}
        emptyMessage="아직 생성한 모임이 없습니다."
      />
    );
  }

  return (
    <GatheringList
      gatherings={gatheringsData}
      gatheringChallenges={gatheringChallenges}
      onCancelAction={cancelGathering}
      cancelActionType="gathering"
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}