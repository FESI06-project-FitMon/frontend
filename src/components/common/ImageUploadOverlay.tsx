import React from 'react';
import Image from 'next/image';

interface ImageUploadOverlayProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;  // 여기를 수정
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isUploading?: boolean;
}

export default function ImageUploadOverlay({
  fileInputRef,
  onUpload,
  onDelete,
  isUploading = false
}: ImageUploadOverlayProps) {
  return (
    <div className="absolute inset-0 border border-dark_500 bg-dark-500/80 flex flex-col rounded-[10px] items-center justify-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/jpg,image/png"
        onChange={onUpload}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Image
          src="/assets/image/profile_edit.svg"
          alt="수정"
          width={45}
          height={45}
          className="hover:opacity-80"
        />
      </button>
      <button
        type="button"
        className="text-dark-700 font-normal hover:text-primary"
        onClick={onDelete}
        disabled={isUploading}
      >
        이미지 삭제
      </button>
    </div>
  );
}