import {
  useCancelGathering,
} from '@/pages/mypage/service/myGathering';
import GatheringList from '@/pages/mypage/components/gathering-section/GatheringList';
import { StateData } from '@/components/common/StateData';
import { Metadata } from '@/components/common/Metadata';
import FilterModal from '@/pages/main/components/FilterModal';
import { useGatheringList } from '../../hooks/useGatheringList';

export default function MyGathering() {
  const {
    currentPage,
    setCurrentPage,
    gatheringsData,
    isLoading,
    gatheringChallenges,
    handleFilterChange
  } = useGatheringList('hosted');

  const { mutateAsync: cancelGathering } = useCancelGathering();

  return (
    <>
      <Metadata
        title="내가 만든 모임"
        description="fitmon에서 내가 만든 모임을 확인하세요. 모임 관리와 현황을 한 눈에 볼 수 있습니다."
      />

      {isLoading || !gatheringsData?.content?.length ? (
        <StateData
          isLoading={isLoading}
          emptyMessage="아직 생성한 모임이 없습니다."
        />
      ) : (
        <GatheringList
          gatherings={gatheringsData}
          gatheringChallenges={gatheringChallenges}
          onCancelAction={cancelGathering}
          cancelActionType="gathering"
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          FilterModal={FilterModal}
          onFilterChange={handleFilterChange}
        />
      )}
    </>
  );
}    