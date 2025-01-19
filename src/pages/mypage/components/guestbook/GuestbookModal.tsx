import { useState } from 'react';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import Heart from '@/components/common/Heart';
import ModalInput from '@/components/common/ModalInput';
import { GuestbookItem } from '@/types';
import useGuestbookStore from '@/stores/useGuestbookStore';
import Preparing from '@/components/common/Preparing';

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
  const { createGuestbook, updateGuestbook } = useGuestbookStore();

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
        await updateGuestbook(gatheringId, initialData.reviewId, requestData);
      } else {
        await createGuestbook(gatheringId, requestData);
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

  const handleContentChange = (value: string) => {
    console.log('Content changed:', value);
    setContent(value);
  };

  const handleRatingChange = (value: number) => {
    console.log('Rating changed:', value);
    setRating(value);
  };

  return (
    <Modal title={isEditMode ? '방명록 수정' : '방명록 작성'} onClose={onClose}>
      <div className="w-[500px] h-[340px] relative">
        <div className="absolute inset-0 z-10 bg-white/80">
          <Preparing isVisible={true} message="api 준비 중인 서비스입니다..." />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="my-[20px] flex items-center gap-4">
            <Heart rating={rating} onChange={handleRatingChange} />
          </div>

          <ModalInput
            type="description"
            value={content}
            onChange={handleContentChange}
            placeholder="방명록을 작성해주세요."
            maxLength={300}
            height="220px"
            onValidationFail={onValidationFail}
          />

          <div className="mt-[20px]">
            <Button 
              type="submit" 
              name={isEditMode ? "수정하기" : "작성하기"} 
              style="default" 
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
