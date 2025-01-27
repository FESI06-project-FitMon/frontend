import { useParticipatingGatherings, useCancelParticipation, useGatheringChallenges } from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import Null from '@/components/common/Null';

export default function JoinGathering() {
  const { data: gatheringsData, isLoading } = useParticipatingGatherings();
  const { mutateAsync: cancelParticipation } = useCancelParticipation();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(gatheringsData, false);

  if (isLoading) return <div>Loading...</div>;
  if (!gatheringsData?.content?.length) return <Null message="참여한 모임이 없습니다." />;

  return (
    <GatheringList
      gatherings={gatheringsData.content}
      gatheringChallenges={gatheringChallenges}
      emptyMessage="참여한 모임이 없습니다."
      onCancelAction={cancelParticipation}
      cancelActionType="participation"
    />
  );
}