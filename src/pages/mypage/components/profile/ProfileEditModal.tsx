import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import Modal from '@/components/dialog/Modal';
import Button from '@/components/common/Button';
import ModalInput from '@/components/common/ModalInput';
import { useImageUpload } from '@/hooks/useImageUpload';
import { profileService } from '@/pages/mypage/api/profileService';
import useToastStore from '@/stores/useToastStore';

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
    uploadFn: profileService.uploadImage,
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
      showToast('닉네임은 2글자 이상, 10글자 이하로 입력해주세요.', 'error');
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
      <div className="w-[500px] h-[254px]">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex items-center gap-[10px] mt-[30px]">
            <div className="relative h-[130px]">
              <Image
                src={
                  !editedImage || editedImage === 'null'
                    ? '/assets/image/fitmon.png'
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
              <div className="absolute inset-0 border border-dark_500 bg-dark-500/80 flex flex-col rounded-[10px] items-center justify-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Image
                    src="/assets/image/profile_edit.svg"
                    alt="프로필 이미지 수정"
                    width={45}
                    height={45}
                    className="hover:opacity-80"
                  />
                </button>
                <button
                  type="button"
                  className="text-dark-700 font-normal hover:text-primary"
                  onClick={handleImageDelete}
                  disabled={isUploading}
                >
                  이미지 삭제
                </button>
              </div>
            </div>
            <div className="flex-1 h-[130px] flex flex-col justify-end">
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
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}