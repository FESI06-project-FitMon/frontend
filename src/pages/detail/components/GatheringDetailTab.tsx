import Tab from '@/components/common/Tab';
import Modal from '@/components/dialog/Modal';
import ChallengeAddModal from './ChallengeAddModal';
import { useState } from 'react';

interface GatheringDetailTabProps {
  gatheringId: number;
  captainStatus: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}
export default function GatheringDetailTab({
  gatheringId,
  captainStatus,
  currentTab,
  setCurrentTab,
}: GatheringDetailTabProps) {
  const [showModal, setShowModal] = useState(false);
  const gatheringTabItems = [
    {
      id: 'challenge',
      label: '챌린지',
    },
    {
      id: 'guestbook',
      label: '방명록',
    },
  ];

  // 챌린지 추가 버튼
  const handleChallengeAddButtonClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="flex mt-[50px] w-full h-[49px] relative items-center justify-center">
        <Tab
          items={gatheringTabItems}
          currentTab={currentTab}
          onTabChange={(newTab) => setCurrentTab(newTab)}
          className="w-full absolute flex text-lg font-bold z-20"
          rightElement={
            captainStatus && (
              <button
                onClick={() => handleChallengeAddButtonClick()}
                className="text-lg hover:cursor-pointer"
              >
                {'+ 챌린지 추가하기'}
              </button>
            )
          }
        />
      </div>
      {/* 모달 */}
      {showModal && (
        <Modal
          title="챌린지 정보를 입력해주세요."
          onClose={() => setShowModal(false)}
        >
          <ChallengeAddModal
            onClose={() => setShowModal(false)}
            gatheringId={gatheringId}
          />
        </Modal>
      )}
    </>
  );
}
