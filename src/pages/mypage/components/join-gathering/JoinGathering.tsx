import { useParticipatingGatherings, useCancelParticipation } from '@/pages/mypage/service/joinGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import Null from '@/components/common/Null';

export default function JoinGathering() {
  const { data: gatheringsData, isLoading } = useParticipatingGatherings();
  const { mutateAsync: cancelParticipation } = useCancelParticipation();

  if (isLoading) {
    console.log('Loading participating gatherings...');
    return <div>Loading...</div>;
  }

  if (!gatheringsData?.content?.length) {
    console.log('No participating gatherings found.');
    return <Null message="참여한 모임이 없습니다." />;
  }

  console.log('Participating gatherings data:', gatheringsData);

  return (
    <GatheringList
      gatherings={gatheringsData.content}
      gatheringStates={gatheringsData.content}
      gatheringChallenges={{}} // 챌린지 데이터가 필요한 경우 처리
      emptyMessage="참여한 모임이 없습니다."
      onCancelAction={cancelParticipation}
      cancelActionType="participation"
    />
  );
}
