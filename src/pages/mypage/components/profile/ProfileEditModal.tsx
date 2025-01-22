import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import ModalInput from '@/components/common/ModalInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { profileService } from '@/pages/mypage/api/profileService';
import useToastStore from '@/stores/useToastStore';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';

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
  const [editedNickname, setEditedNickname] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [, setIsDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.show);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedNickname(initialNickname || '');
      setEditedImage(initialImage);
    }
  }, [isOpen, initialNickname, initialImage]);

  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'MEMBER',
    onUploadSuccess: (imageUrl) => {
      setEditedImage(imageUrl);
    }
  });

  const validateNickname = (nickname: string): boolean => {
    const trimmedNickname = nickname.trim();
    return trimmedNickname.length >= 2 && trimmedNickname.length <= 10;
  };

  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: ({ nickname, profileImageUrl }: { nickname: string; profileImageUrl: string | null }) =>
      profileService.updateProfile({
        nickName: nickname,
        profileImageUrl,
      }),
    onSuccess: () => {
      onUpdate(editedNickname, editedImage);
      onClose();
      showToast('프로필 수정을 성공하였습니다.', 'check');
    },
    onError: () => {
      showToast('프로필 수정에 실패했습니다.', 'error');
    },
  });

  const handleImageDelete = () => {
    setEditedImage(null);
    showToast('이미지가 삭제되었습니다.', 'check');
  };

  const handleNicknameChange = (value: string) => {
    setEditedNickname(value);
    setIsDisabled(!validateNickname(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNickname(editedNickname)) {
      showToast('닉네임은 2글자에서 10글자 이내로 입력해주세요.', 'error');
      setIsDisabled(true);
      return;
    }

    updateProfileMutation({
      nickname: editedNickname.trim(),
      profileImageUrl: editedImage,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="회원 정보를 입력해주세요."
      onClose={onClose}
    >
      <div className="w-full md:w-[500px] h-auto">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row items-center gap-[10px] mt-[30px]">
            <div className="relative h-[130px] rounded-[10px] overflow-hidden">
              <Image
                src={
                  !editedImage || editedImage === 'null'
                    ? 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
                    : editedImage
                }
                alt="프로필 이미지"
                width={130}
                height={130}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/image/mypage_profile.svg';
                }}
              />
              <ImageUploadOverlay
                fileInputRef={fileInputRef}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                isUploading={isUploading}
              />
            </div>
            <div className="w-full md:flex-1 md:h-[130px] flex flex-col justify-end">
              <label className="text-base mb-[10px] font-normal block">
                닉네임
              </label>
              <ModalInput
                type="title"
                value={editedNickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 수정해주세요."
                maxLength={10}
                onValidationFail={() => setIsDisabled(true)}
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