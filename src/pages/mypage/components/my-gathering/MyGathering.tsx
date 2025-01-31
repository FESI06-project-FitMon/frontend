import { useMyHostedGatherings, useCancelGathering, useGatheringChallenges } from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import Null from '@/components/common/Null';
import Image from 'next/image';  

export default function MyGathering() {
  const { data: hostedGatheringsData, isLoading } = useMyHostedGatherings();
  const { mutateAsync: cancelGathering } = useCancelGathering();
  const { data: gatheringChallenges = {} } = useGatheringChallenges(hostedGatheringsData);

  if (isLoading) {
    return (
      <Null 
        message="로딩 중..." 
        svg={
          <Image 
            src="/assets/image/spinner.svg" 
            alt="로딩 스피너" 
            width={50} 
            height={50}
          />
        } 
      />
    );
  }
  
  if (!hostedGatheringsData?.content?.length) {
    return <Null message="아직 생성한 모임이 없습니다." />;
  }

  return (
    <GatheringList
      gatherings={hostedGatheringsData.content}
      gatheringChallenges={gatheringChallenges}
      emptyMessage="생성한 모임이 없습니다."
      onCancelAction={cancelGathering}
      cancelActionType="gathering"
    />
  );
}