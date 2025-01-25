// import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
// import { GatheringItem, GatheringStateType, GatheringChallengeType } from '@/types';
// import {
//   userGatherings,
//   userGatheringStates,
//   userGatheringChallenges
// } from '@/pages/mypage/constants/constants';

// interface JoinGatheringProps {
//   onGatheringClick: (gatheringId: number) => void;
//   onCancelParticipation: (gatheringId: number) => void;
// }

// export default function JoinGathering({ onCancelParticipation }: JoinGatheringProps) {
//   return (
//     <GatheringList
//       gatherings={userGatherings as GatheringItem[]}
//       gatheringStates={userGatheringStates as { [key: number]: GatheringStateType }}
//       gatheringChallenges={userGatheringChallenges as { [key: number]: GatheringChallengeType }}
//       emptyMessage="아직 참여한 모임이 없습니다."
//       onCancelAction={onCancelParticipation}
//       cancelActionType="participation"
//     />
//   );
// }

// components/gathering/GatheringList.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringService } from '@/pages/mypage/api/gatheringService';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import Null from '@/components/common/Null';

export default function JoinGathering() {
  const queryClient = useQueryClient();
  
  const { data: gatheringsData, isLoading } = useQuery({
    queryKey: ['participating-gatherings'],
    queryFn: () => gatheringService.getMyParticipatingGatherings()
  });

  const { mutateAsync: cancelParticipation } = useMutation({
    mutationFn: gatheringService.cancelParticipation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participating-gatherings'] });
    }
  });

  const { data: challengesData } = useQuery({
    queryKey: ['gathering-challenges', gatheringsData?.content?.map(g => g.gatheringId)],
    queryFn: async () => {
      const challenges = {};
      if (!gatheringsData?.content) return challenges;
      
      for (const gathering of gatheringsData.content) {
        const response = await gatheringService.getGatheringChallenges(gathering.gatheringId, 'IN_PROGRESS');
        if (response?.content) {
          challenges[gathering.gatheringId] = {
            inProgressChallenges: response.content,
            doneChallenges: []
          };
        }
      }
      return challenges;
    },
    enabled: !!gatheringsData?.content?.length
  });

  if (isLoading) return null;
  if (!gatheringsData?.content?.length) return <Null message="참여한 모임이 없습니다." />;

  const hasNoChallenges = !challengesData || Object.keys(challengesData).length === 0;

  return (
    <>
      <GatheringList
        gatherings={gatheringsData.content}
        gatheringStates={gatheringsData.content}
        gatheringChallenges={challengesData || {}}
        emptyMessage="참여한 모임이 없습니다."
        onCancelAction={cancelParticipation}
        cancelActionType="participation"
      />
      {hasNoChallenges && <Null message="참여중인 챌린지 목록이 없습니다." />}
    </>
  );
}