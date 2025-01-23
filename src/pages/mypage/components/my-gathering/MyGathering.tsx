import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { GatheringItem, GatheringStateType, GatheringChallengeType } from '@/types';
import {
  hostedGatherings,
  hostedGatheringStates,
  hostedGatheringChallenges
} from '@/pages/mypage/constants/constants';

interface MyGatheringProps {
  onGatheringClick: (gatheringId: number) => void;
  onCancelGathering: (gatheringId: number) => void;
}

export default function MyGathering({ onCancelGathering }: MyGatheringProps) {
  return (
    <GatheringList
      gatherings={hostedGatherings as GatheringItem[]}
      gatheringStates={hostedGatheringStates as { [key: number]: GatheringStateType }}
      gatheringChallenges={hostedGatheringChallenges as { [key: number]: GatheringChallengeType }}
      emptyMessage="아직 생성한 모임이 없습니다."
      onCancelAction={onCancelGathering}
      cancelActionType="gathering"
    />
  );
}
