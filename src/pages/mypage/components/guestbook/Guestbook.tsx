import { useState, useCallback, useEffect } from 'react';
import { GuestbookItem, TabItem } from '@/types';
import SubTag from '@/components/tag/SubTag';
import GuestbookModal from '../guestbook/GuestbookModal';
import WrittenGuestbooks from '../guestbook/WrittenGuestbooks';
import AvailableGuestbooks from '../guestbook/AvailableGuestbooks';
import useToastStore from '@/stores/useToastStore';
import useGuestbookStore from '@/stores/useGuestbookStore';
import { userGatheringChallenges, userGatherings, userGatheringStates } from '../../constants/constants';

const GUESTBOOK_TABS: TabItem[] = [
  { id: 'available', label: '작성 가능한 방명록' },
  { id: 'written', label: '작성한 방명록' },
];

export default function GuestbookTab() {
  const [showWritten, setShowWritten] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isEditMode: boolean;
    gatheringId?: number;
    guestbook?: GuestbookItem;
  }>({ isOpen: false, isEditMode: false });

  const showToast = useToastStore((state) => state.show);
  const { 
    guestbooks, 
    fetchGuestbooks,
    createGuestbook,
    updateGuestbook 
  } = useGuestbookStore();

  useEffect(() => {
    if (showWritten) {
      fetchGuestbooks();
    }
  }, [showWritten, fetchGuestbooks]);

  const handleModalSubmit = useCallback(async (data: { content: string; rating: number }) => {
    try {
      if (modalState.isEditMode && modalState.guestbook) {
        await updateGuestbook(
          modalState.guestbook.gatheringId,
          modalState.guestbook.reviewId,
          data
        );
        showToast('방명록이 수정되었습니다.', 'check');
      } else if (modalState.gatheringId) {
        await createGuestbook(modalState.gatheringId, data);
        showToast('방명록이 작성되었습니다.', 'check');
      }
      setModalState({ isOpen: false, isEditMode: false });
    } catch {
      showToast('오류가 발생했습니다.', 'error');
    }
  }, [modalState, updateGuestbook, createGuestbook, showToast]);

  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false, isEditMode: false });
    showToast(
      `방명록 ${modalState.isEditMode ? '수정' : '작성'}이 취소되었습니다.`,
      'caution'
    );
  }, [modalState.isEditMode, showToast]);

  const handleValidationFail = useCallback(() => {
    showToast('방명록 내용을 입력해주세요.', 'error');
  }, [showToast]);

  const handleWriteClick = useCallback((gatheringId: number) => {
    setModalState({
      isOpen: true,
      isEditMode: false,
      gatheringId,
    });
  }, []);

  const handleEditClick = useCallback((guestbook: GuestbookItem) => {
    setModalState({
      isOpen: true,
      isEditMode: true,
      guestbook,
    });
  }, []);

  const handleTabChange = useCallback((id: TabItem['id']) => setShowWritten(id === 'written'), []);

  const eligibleGatherings = useCallback(
    () =>
      userGatherings.filter((gathering) => {
        if (gathering.captainStatus) return false;
        const challenges = userGatheringChallenges[gathering.gatheringId];
        return challenges?.inProgressChallenges?.some(
          (challenge) => challenge.verificationStatus === true,
        );
      }),
    [],
  );

  return (
    <div className="pb-[50px]">
      <div className="flex justify-between items-center mb-[37px]">
        <SubTag
          tags={GUESTBOOK_TABS}
          currentTag={showWritten ? 'written' : 'available'}
          onTagChange={handleTabChange}
          className="flex"
        />
      </div>

      {showWritten ? (
        <WrittenGuestbooks
          guestbooks={guestbooks} 
          gatherings={userGatherings}
          onEditClick={handleEditClick}
        />
      ) : (
        <AvailableGuestbooks
          gatherings={eligibleGatherings()}
          gatheringStates={userGatheringStates}
          onWriteClick={handleWriteClick}
        />
      )}

      {modalState.isOpen && (
        <GuestbookModal
          isEditMode={modalState.isEditMode}
          gatheringId={modalState.gatheringId}
          initialData={modalState.guestbook}
          onSubmit={handleModalSubmit}
          onValidationFail={handleValidationFail}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}