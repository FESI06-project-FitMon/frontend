import { useState } from 'react';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import Heart from '@/components/common/Heart';
import ModalInput from '@/components/common/ModalInput';
import { GuestbookItem } from '@/types';
import { useCreateGuestbook, useUpdateGuestbook } from '@/pages/mypage/service/myGuestbooks';


interface GuestbookModalProps {
  isEditMode: boolean;
  initialData?: GuestbookItem | null;
  gatheringId?: number;
  onSubmit: (data: { content: string; rating: number }) => void;
  onValidationFail: () => void;
  onClose: () => void;
}

export default function GuestbookModal({
  isEditMode,
  initialData,
  gatheringId,
  onSubmit,
  onValidationFail,
  onClose,
}: GuestbookModalProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [content, setContent] = useState(initialData?.content || '');
  
  const createGuestbookMutation = useCreateGuestbook();
  const updateGuestbookMutation = useUpdateGuestbook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submission started with:', {
      gatheringId,
      content,
      rating,
      isEditMode,
      initialData
    });

    if (!content.trim()) {
      console.log('Validation failed: empty content');
      onValidationFail();
      return;
    }

    if (!gatheringId) {
      console.error('Missing gatheringId');
      return;
    }

    try {
      const requestData = {
        content: content.trim(),
        rating: Number(rating)
      };

      console.log('Sending request with data:', requestData);

      if (isEditMode && initialData) {
        await updateGuestbookMutation.mutateAsync({
          gatheringId,
          guestbookId: initialData.reviewId,
          data: requestData
        });
      } else {
        await createGuestbookMutation.mutateAsync({
          gatheringId,
          data: requestData
        });
      }

      console.log('Request successful');
      onSubmit(requestData);
    } catch (err) {
      console.error('Error details:', {
        error: err,
        response: err instanceof Error ? err.message : 'Unknown error'
      });
      onValidationFail();
    }
  };

  return (
    <Modal title={isEditMode ? '방명록 수정' : '방명록 작성'} onClose={onClose}>
      <div className="h-full md:h-[340px] flex flex-col justify-center md:justify-start">
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center md:items-start">
          <div className="mb-3 md:my-4 flex items-center justify-center md:justify-start w-full">
            <Heart rating={rating} onChange={(value) => setRating(value)} />
          </div>

          <div className="w-full">
            <ModalInput
              type="description"
              value={content}
              onChange={(value) => setContent(value)}
              placeholder="방명록을 작성해주세요."
              maxLength={300}
              height="220px"
              onValidationFail={onValidationFail}
            />
          </div>

          <div className="w-full mt-4">
            <Button
              type="submit"
              name={isEditMode ? "수정하기" : "작성하기"}
              style="default"
              className="w-full h-[52px]"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

