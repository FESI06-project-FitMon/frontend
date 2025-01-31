import { useRef, useState, useEffect } from 'react';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import ModalInput from '@/components/common/ModalInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import useToastStore from '@/stores/useToastStore';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';
import { ProfileImage } from './ProfileImage';
import { profileEdit } from '@/pages/mypage/service/profileEdit';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNickname: string;
  initialImage: string | null;
  onUpdate: (nickname: string, imageUrl: string | null) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  initialNickname,
  initialImage,
  onUpdate
}: ProfileEditModalProps) {
  const [formState, setFormState] = useState({
    nickname: '',
    imageUrl: null as string | null,
    isValid: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.show);

  const updateProfileMutation = profileEdit.useProfileUpdate((nickname, imageUrl) => {
    onUpdate(nickname, imageUrl);
    onClose();
  });

  useEffect(() => {
    if (isOpen) {
      setFormState({
        nickname: initialNickname,
        imageUrl: initialImage,
        isValid: true
      });
    }
  }, [isOpen, initialNickname, initialImage]);

  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'MEMBER',
    onUploadSuccess: (imageUrl) => {
      setFormState(prev => ({ ...prev, imageUrl }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileEdit.validateNickname(formState.nickname)) {
      showToast('닉네임은 2글자에서 10글자 이내로 입력해주세요.', 'error');
      setFormState(prev => ({ ...prev, isValid: false }));
      return;
    }

    updateProfileMutation.mutate({
      nickname: formState.nickname.trim(),
      profileImageUrl: formState.imageUrl,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal title="회원 정보를 입력해주세요." onClose={onClose}>
      <div className="w-full md:w-[500px] h-auto">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row items-center gap-[10px] mt-[30px]">
            <div className="relative h-[130px] rounded-[10px] overflow-hidden">
              <ProfileImage
                imageUrl={formState.imageUrl}
                size={130}
              />
              <ImageUploadOverlay
                fileInputRef={fileInputRef}
                onUpload={handleImageUpload}
                onDelete={() => {
                  setFormState(prev => ({ ...prev, imageUrl: null }));
                  showToast('이미지가 삭제되었습니다.', 'check');
                }}
                isUploading={isUploading}
              />
            </div>
            {/* 닉네임 입력 부분 */}
            <div className="w-full md:flex-1 md:h-[130px] flex flex-col justify-end">
              <div className="flex items-center justify-between mb-[10px]">
                <label className="text-base font-normal">닉네임</label>
                <span className="text-xs text-primary">
                  {formState.nickname.length}/10
                </span>
              </div>
              <ModalInput
                type="title"
                value={formState.nickname}
                onChange={(value) => {
                  setFormState(prev => ({
                    ...prev,
                    nickname: value,
                    isValid: profileEdit.validateNickname(value)
                  }));
                }}
                placeholder="닉네임을 수정해주세요."
                maxLength={10}
                onBlur={() => {
                }}
                onValidationFail={() =>
                  setFormState(prev => ({ ...prev, isValid: false }))
                }
              />
            </div>
          </div>

          <div className="mt-[20px]">
            <Button
              type="submit"
              name="확인"
              style="default"
              className="h-[52px]"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
