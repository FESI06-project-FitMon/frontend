import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { GatheringItem, GatheringStateType, GatheringChallengeType } from '@/types';
import {
  userGatherings,
  userGatheringStates,
  userGatheringChallenges
} from '@/pages/mypage/constants/constants';

interface JoinGatheringProps {
  onGatheringClick: (gatheringId: number) => void;
  onCancelParticipation: (gatheringId: number) => void;
}

export default function JoinGathering({ onCancelParticipation }: JoinGatheringProps) {
  return (
    <GatheringList
      gatherings={userGatherings as GatheringItem[]}
      gatheringStates={userGatheringStates as { [key: number]: GatheringStateType }}
      gatheringChallenges={userGatheringChallenges as { [key: number]: GatheringChallengeType }}
      emptyMessage="아직 참여한 모임이 없습니다."
      onCancelAction={onCancelParticipation}
      cancelActionType="participation"
    />
  );
}