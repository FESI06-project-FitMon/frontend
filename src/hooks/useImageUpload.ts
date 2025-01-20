// hooks/useImageUpload.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useToastStore from '@/stores/useToastStore';
import uploadImage from '@/utils/uploadImage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

interface UseImageUploadProps {
  type: 'MEMBER' | 'GATHERING' | 'CHALLENGE';
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: unknown) => void;
  maxSize?: number;
  allowedTypes?: string[];
  customMessages?: {
    uploadSuccess?: string;
    uploadError?: string;
    invalidType?: string;
    invalidSize?: string;
  };
}

export const useImageUpload = ({
  type,
  onUploadSuccess,
  onUploadError,
  maxSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_FILE_TYPES,
  customMessages
}: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const showToast = useToastStore((state) => state.show);

  const messages = {
    uploadSuccess: customMessages?.uploadSuccess ?? '이미지가 업로드되었습니다.',
    uploadError: customMessages?.uploadError ?? '이미지 업로드에 실패했습니다.',
    invalidType: customMessages?.invalidType ?? 'JPEG/JPG/PNG 파일만 업로드 가능합니다.',
    invalidSize: customMessages?.invalidSize ?? '파일 크기는 5MB 이하여야 합니다.'
  };

  const { mutate: uploadImageMutation } = useMutation({
    mutationFn: (file: File) => uploadImage(file, type),
    onSuccess: (data) => {
      onUploadSuccess(data.imageUrl);
      setIsUploading(false);
      showToast(messages.uploadSuccess, 'check');
    },
    onError: (error) => {
      onUploadError?.(error);
      setIsUploading(false);
      showToast(messages.uploadError, 'error');
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!allowedTypes.includes(file.type)) {
      showToast(messages.invalidType, 'error');
      return;
    }

    // 파일 크기 검증
    if (file.size > maxSize) {
      showToast(messages.invalidSize, 'error');
      return;
    }

    setIsUploading(true);
    uploadImageMutation(file);
  };

  return {
    handleImageUpload,
    isUploading
  };
};