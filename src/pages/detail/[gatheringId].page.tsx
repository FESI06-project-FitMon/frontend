import { useEffect, useState } from 'react';
import GatheringInformation from './components/GatheringInformation';
import GatheringChallenge from './components/GatheringChallenge';
import GatheringGuestbook from './components/GatheringGuestbook';
import GatheringState from './components/GatheringState';
import Tab from '@/components/common/Tab';
import Modal from '@/components/dialog/Modal';
import ChallengeAddModal from './components/ChallengeAddModal';
import useGatheringStore from '@/stores/useGatheringStore';
import { usePathname } from 'next/navigation';

export default function GatheringDetail() {
  const { fetchGathering, gathering } = useGatheringStore();
  const pathname = usePathname();
  let gatheringId = pathname
    ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
    : 1;
  useEffect(() => {
    fetchGathering(gatheringId);
    gatheringId = pathname
      ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
      : 1;
  }, [gatheringId]);

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
  const [currentTab, setCurrentTab] = useState('challenge');

  const handleChallengeAddButtonClick = () => {
    setShowModal(true);
  };

  if (!gathering) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[1200px] flex flex-col place-self-center ">
      <GatheringInformation gathering={gathering} />
      <GatheringState gatheringId={gatheringId} />
      <div className="flex mt-[50px] w-full h-[49px] relative items-center justify-center">
        <Tab
          items={gatheringTabItems}
          currentTab={currentTab}
          onTabChange={(newTab) => setCurrentTab(newTab)}
          className="w-full absolute flex text-lg font-bold z-20"
          rightElement={
            gathering.captainStatus && (
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

      {currentTab === 'challenge' ? (
        <GatheringChallenge
          gatheringId={gatheringId}
          captainStatus={gathering.captainStatus ?? false}
        />
      ) : (
        <GatheringGuestbook
          gatheringId={gatheringId}
          gatheringGuestbookCount={gathering.guestBookCount}
        />
      )}
    </div>
  );
}
