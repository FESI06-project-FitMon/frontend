import { useMyHostedGatherings, useCancelGathering } from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import Null from '@/components/common/Null';

export default function MyGathering() {
  const { data: hostedGatheringsData, isLoading } = useMyHostedGatherings();

  if (isLoading) {
    console.log('Loading hosted gatherings...');
    return <div>Loading...</div>;
  }

  if (!hostedGatheringsData) {
    console.error('No data received for hosted gatherings');
  } else {
    console.log('Hosted gatherings data:', hostedGatheringsData);
  }

  if (!hostedGatheringsData?.content?.length) {
    return <Null message="아직 생성한 모임이 없습니다." />;
  }
  return (
    <GatheringList
      gatherings={hostedGatheringsData.content}
      gatheringStates={hostedGatheringsData.content}
      gatheringChallenges={{}} // 챌린지 데이터 처리 필요 시 추가
      emptyMessage="아직 생성한 모임이 없습니다."
      onCancelAction={(id) => console.log('취소할 모임 ID:', id)}
      cancelActionType="gathering"
    />
  );
}