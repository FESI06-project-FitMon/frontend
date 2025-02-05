import Image from 'next/image';

interface ProfileImageProps {
  imageUrl: string | null;
  size?: number;
  className?: string;
}

export function ProfileImage({ imageUrl, size = 50, className = '' }: ProfileImageProps) {
  const defaultImage = '/assets/image/mypage_profile.svg';
  const imageSource = !imageUrl || imageUrl === 'null' ? defaultImage : imageUrl;

  return (
    <div style={{ width: size, height: size }} className="relative">
      <Image
        src={imageSource}
        alt="프로필 이미지"
        fill
        className={`object-cover ${className}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = defaultImage;
        }}
      />
    </div>
  );
}
