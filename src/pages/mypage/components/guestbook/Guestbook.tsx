import { useState, useCallback } from 'react';
import { GuestbookItem, GatheringListItem } from '@/types';
import SubTag from '@/components/tag/SubTag';
import GuestbookModal from '../guestbook/GuestbookModal';
import WrittenGuestbooks from '../guestbook/WrittenGuestbooks';
import AvailableGuestbooks from '../guestbook/AvailableGuestbooks';
import useToastStore from '@/stores/useToastStore';
import { useGuestbooks, useCreateGuestbook, useUpdateGuestbook, useAvailableGuestbooks } from '@/pages/mypage/service/myGuestbooks';

export default function GuestbookTab() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isEditMode: boolean;
    gatheringId?: number;
    guestbook?: GuestbookItem;
  }>({ isOpen: false, isEditMode: false });

  const showToast = useToastStore((state) => state.show);
  const { data: availableGuestbooks = [] } = useAvailableGuestbooks();
  const { data: guestbooksData = { content: [] } } = useGuestbooks();
  const [showWritten, setShowWritten] = useState(false);

  const createGuestbookMutation = useCreateGuestbook();
  const updateGuestbookMutation = useUpdateGuestbook();

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

  const handleModalSubmit = useCallback(async (data: { content: string; rating: number }) => {
    try {
      if (modalState.isEditMode && modalState.guestbook) {
        await updateGuestbookMutation.mutateAsync({
          gatheringId: modalState.guestbook.gatheringId,
          guestbookId: modalState.guestbook.reviewId,
          data,
        });
        showToast('방명록이 수정되었습니다.', 'check');
      } else if (modalState.gatheringId) {
        await createGuestbookMutation.mutateAsync({
          gatheringId: modalState.gatheringId,
          data,
        });
        showToast('방명록이 작성되었습니다.', 'check');
      }
      setModalState({ isOpen: false, isEditMode: false });
    } catch {
      showToast('오류가 발생했습니다.', 'error');
    }
  }, [modalState, updateGuestbookMutation, createGuestbookMutation, showToast]);

  const handleTabChange = (id: string) => setShowWritten(id === 'written');

  return (
    <div className="pb-[30px] md:pb-[50px] xl:pb-20">
      <div className="flex justify-between items-center mb-6 lg:mb-[37px]">

        <SubTag
          tags={[
            { id: 'available', label: '작성 가능한 방명록' },
            { id: 'written', label: '작성한 방명록' },
          ]}
          currentTag={showWritten ? 'written' : 'available'}
          onTagChange={handleTabChange}
        />
      </div>
      {showWritten ? (
        <WrittenGuestbooks
          guestbooks={guestbooksData.content}
          gatherings={availableGuestbooks as GatheringListItem[]}
          onEditClick={handleEditClick}
        />
      ) : (
        <AvailableGuestbooks
          gatherings={availableGuestbooks as GatheringListItem[]}
          onWriteClick={handleWriteClick}
        />
      )}
      {modalState.isOpen && (
        <GuestbookModal
          isEditMode={modalState.isEditMode}
          gatheringId={modalState.gatheringId ?? 0}
          initialData={modalState.guestbook || null}
          onSubmit={handleModalSubmit}
          onValidationFail={() => showToast('방명록 내용을 입력해주세요.', 'error')}
          onClose={() => setModalState({ isOpen: false, isEditMode: false })}
        />
      )}
    </div>
  );
}
