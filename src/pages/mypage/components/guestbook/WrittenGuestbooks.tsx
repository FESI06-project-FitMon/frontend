import { useState } from 'react';
import GuestbookCard from '@/components/card/guestbook/GuestbookCard';
import { GatheringListItem, GuestbookItem } from '@/types';
import Alert from '@/components/dialog/Alert';
import useToastStore from '@/stores/useToastStore';
import { useDeleteGuestbook } from '@/pages/mypage/service/myGuestbooks';

interface WrittenGuestbooksProps {
  guestbooks: GuestbookItem[];
  gatherings: GatheringListItem[];
  onEditClick: (guestbook: GuestbookItem) => void;
}
export default function WrittenGuestbooks({
  guestbooks,
  gatherings,
  onEditClick,
}: WrittenGuestbooksProps) {
  const [state, setState] = useState({
    showDeleteAlert: false,
    selectedGuestbook: null as GuestbookItem | null,
  });

  const showToast = useToastStore((state) => state.show);
  const deleteGuestbookMutation = useDeleteGuestbook();  // React Query mutation 사용

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleDeleteClick = (guestbook: GuestbookItem) => {
    console.log('Delete clicked:', guestbook);
    updateState({ selectedGuestbook: guestbook, showDeleteAlert: true });
  };

  const handleDeleteConfirm = async () => {
    if (state.selectedGuestbook) {
      console.log('Attempting to delete:', {
        gatheringId: state.selectedGuestbook.gatheringId,
        guestbookId: state.selectedGuestbook.guestbookId  // reviewId에서 변경
      });
      try {
        await deleteGuestbookMutation.mutateAsync({
          gatheringId: state.selectedGuestbook.gatheringId,
          guestbookId: state.selectedGuestbook.guestbookId  // reviewId에서 변경
        });
        console.log('Delete success');
        showToast('삭제가 완료되었습니다.', 'check');
      } catch (error) {
        console.error('Delete error:', error);
        showToast('삭제에 실패했습니다.', 'error');
      }
    }
  };


  const handleDeleteCancel = () => {
    setState((prev) => ({ ...prev, showDeleteAlert: false, selectedGuestbook: null }));
    showToast('삭제가 취소되었습니다.', 'caution');
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {guestbooks.map((guestbook) => (
        <GuestbookCard
          key={guestbook.guestbookId}
          guestbook={guestbook}
          gathering={gatherings.find((g) => g.gatheringId === guestbook.gatheringId) || null}
          showActions={true}
          onEdit={onEditClick}
          onDelete={() => handleDeleteClick(guestbook)}
        />
      ))}

      <Alert
        isOpen={state.showDeleteAlert}
        type="select"
        message="정말 삭제하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}