import {
  useMyHostedGatherings,
  useCancelGathering,
  useGatheringChallenges,
} from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';

export default function MyGathering() {
  const { data: hostedGatheringsData, isLoading } = useMyHostedGatherings();
  const { mutateAsync: cancelGathering } = useCancelGathering();
  const { data: gatheringChallenges = {} } =
    useGatheringChallenges(hostedGatheringsData);

  if (isLoading || !hostedGatheringsData?.content?.length) {
    return (
      <StateData
        isLoading={isLoading}
        emptyMessage="아직 생성한 모임이 없습니다."
      />
    );
  }

  return (
    <GatheringList
      gatherings={hostedGatheringsData.content}
      gatheringChallenges={gatheringChallenges}
      onCancelAction={cancelGathering}
      cancelActionType="gathering"
    />
  );
}
