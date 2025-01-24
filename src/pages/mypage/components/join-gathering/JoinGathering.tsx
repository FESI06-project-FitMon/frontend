import {
  useParticipatingGatherings,
  useCancelParticipation,
  useGatheringChallenges,
} from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';

export default function JoinGathering() {
  const { data: gatheringsData, isLoading } = useParticipatingGatherings();
  const { mutateAsync: cancelParticipation } = useCancelParticipation();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(
    gatheringsData,
    false,
  );

  if (isLoading || !gatheringsData?.content?.length) {
    return (
      <StateData isLoading={isLoading} emptyMessage="참여한 모임이 없습니다." />
    );
  }

  return (
    <GatheringList
      gatherings={gatheringsData.content}
      gatheringChallenges={gatheringChallenges}
      onCancelAction={cancelParticipation}
      cancelActionType="participation"
    />
  );
}
