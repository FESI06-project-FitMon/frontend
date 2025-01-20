import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';
import uploadImage from '@/utils/uploadImage';

interface ImageUploaderProps {
  imageUrl: string | null;
  onUpload: (url: string) => void;
  onDelete: () => void;
}

export default function ImageUploader({
  imageUrl,
  onUpload,
  onDelete,
}: ImageUploaderProps) {
  const { handleImageUpload, isUploading } = useImageUpload({
    uploadFn: uploadImage,
    onUploadSuccess: onUpload,
    onUploadError: (error) => console.error('이미지 업로드 실패:', error),
  });

  return (
    <div className="relative border-[1px] rounded-[10px] bg-dark-400 border-dark-500 w-[130px] h-[130px] flex">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="이미지 미리보기"
          className="rounded-[10px] w-full h-full object-cover"
          fill
        />
      )}
      <div className="absolute w-full h-full flex flex-col justify-center items-center gap-2 z-20 hover:cursor-pointer">
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {isUploading ? (
          <p className="text-sm text-dark-700">업로드 중...</p>
        ) : (
          <Image
            src="/assets/image/gathering_edit.svg"
            width={45}
            height={45}
            alt="edit-image"
            onClick={() => document.getElementById('file-input')?.click()}
          />
        )}
        <button
          onClick={onDelete}
          className="text-sm text-dark-700 hover:cursor-pointer"
        >
          이미지 삭제
        </button>
      </div>
    </div>
  );
}
