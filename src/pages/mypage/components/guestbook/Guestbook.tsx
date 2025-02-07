import { useState } from 'react';
import { GuestbookItem } from '@/types';
import SubTag from '@/components/tag/SubTag';
import GuestbookModal from './GuestbookModal';
import WrittenGuestbooks from './WrittenGuestbooks';
import AvailableGuestbooks from './AvailableGuestbooks';
import Pagination from '@/components/common/Pagination';
import useToastStore from '@/stores/useToastStore';
import { useGuestbooks, useCreateGuestbook, useUpdateGuestbook, useAvailableGuestbooks } from '@/pages/mypage/service/myGuestbooks';
import { useParticipatingGatherings } from '../../service/myGathering';;
import { StateData } from '@/components/common/StateData';
import { Metadata } from '@/components/common/Metadata';

export default function Guestbook() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    isEditMode: boolean;
    gatheringId?: number;
    guestbook?: GuestbookItem;
  }>({ isOpen: false, isEditMode: false });

  const [currentPage, setCurrentPage] = useState(1);
  const showToast = useToastStore((state) => state.show);

  const { data: participatingGatherings = { content: [] }, isLoading: isParticipatingLoading } = useParticipatingGatherings();
  const { data: availableGuestbooks = { content: [], totalPages: 0, totalElements: 0 }, isLoading: isAvailableLoading } = useAvailableGuestbooks({ page: currentPage - 1 });
  const { data: guestbooksData = { content: [], totalPages: 0, totalElements: 0 }, isLoading: isGuestbooksLoading } = useGuestbooks(currentPage - 1);

  const isLoading = isParticipatingLoading || isAvailableLoading || isGuestbooksLoading;
  const createGuestbookMutation = useCreateGuestbook();
  const updateGuestbookMutation = useUpdateGuestbook();
  const [showWritten, setShowWritten] = useState(false);

  const handleWriteClick = (gatheringId: number) => {
    setModalState({
      isOpen: true,
      isEditMode: false,
      gatheringId,
    });
  };

  const handleEditClick = (guestbook: GuestbookItem) => {
    setModalState({
      isOpen: true,
      isEditMode: true,
      guestbook,
    });
  };

  const handleModalSubmit = async (data: { content: string; rating: number }) => {
    try {
      if (modalState.isEditMode && modalState.guestbook) {
        await updateGuestbookMutation.mutateAsync({
          gatheringId: modalState.guestbook.gatheringId,
          guestbookId: modalState.guestbook.guestbookId,
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
    } catch (error) {
      console.error('Submit error:', error);
      showToast('오류가 발생했습니다.', 'error');
    }
  };

  const handleTabChange = (id: string) => {
    setShowWritten(id === 'written');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const isEmpty = showWritten
    ? !guestbooksData.content.length
    : !availableGuestbooks.content.length;

  return (
    <>
      <Metadata
        title="나의 방명록"
        description="fitmon 모임의 방명록을 작성하고 관리하세요. 모임에 대한 소중한 기억을 남겨보세요."
      />
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

        {isLoading || isEmpty ? (
          <StateData
            isLoading={isLoading}
            emptyMessage={showWritten
              ? "작성한 방명록이 없습니다."
              : "작성 가능한 방명록이 없습니다."
            }
          />
        ) : (
          <div className="space-y-6">
            {showWritten ? (
              <WrittenGuestbooks
                guestbooks={guestbooksData.content}
                gatherings={participatingGatherings?.content ?? []}
                onEditClick={handleEditClick}
              />
            ) : (
              <AvailableGuestbooks
                gatherings={availableGuestbooks.content}
                onWriteClick={handleWriteClick}
              />
            )}

            {/* 페이지네이션 */}
            {((showWritten && guestbooksData.totalPages > 1) ||
              (!showWritten && availableGuestbooks.totalPages > 1)) && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    page={currentPage}
                    setPage={handlePageChange}
                    totalNumber={showWritten
                      ? guestbooksData.totalElements
                      : availableGuestbooks.totalElements}
                    countPerPage={10}
                  />
                </div>
              )}
          </div>
        )}

        {modalState.isOpen && (
          <GuestbookModal
            isEditMode={modalState.isEditMode}
            gatheringId={modalState.isEditMode ? modalState.guestbook?.gatheringId : modalState.gatheringId}
            initialData={modalState.guestbook}
            onSubmit={handleModalSubmit}
            onValidationFail={() => showToast('방명록 내용을 입력해주세요.', 'error')}
            onClose={() => setModalState({ isOpen: false, isEditMode: false })}
          />
        )}
      </div>
    </>
  );
}
