import Image from 'next/image';

interface HeartProps {
  rating: number; // 현재 별점
  onChange?: (value: number) => void; // 별점 변경 이벤트 핸들러
}

export default function Heart({ rating, onChange }: HeartProps) {
  const fill = Math.floor(rating); // 꽉 찬 하트 개수
  const half = rating % 1; // 반쪽 하트 여부
  const emptyCount = 5 - fill - (half > 0 ? 1 : 0); // 빈 하트 개수

  const handleClick = (value: number) => {
    if (onChange) {
      onChange(value); // 별점 변경 핸들러 호출
    }
  };

  return (
    <div id="hearts" className="flex gap-[5px]">
      {[...Array(fill)].map((_, index) => (
        <Image
          src="/assets/image/heart-fill.svg"
          alt="heart"
          width={22}
          height={22}
          key={`fill-${index}`}
          onClick={() => handleClick(index + 1)} // 클릭 시 별점 업데이트
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        />
      ))}
      {half > 0 && (
        <Image
          src="/assets/image/heart-half.svg"
          alt="heart"
          width={22}
          height={22}
          onClick={() => handleClick(fill + 0.5)} // 반쪽 하트 클릭
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        />
      )}
      {[...Array(emptyCount)].map((_, index) => (
        <Image
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          src="/assets/image/heart-empty.svg"
          alt="heart"
          width={22}
          height={22}
          key={`empty-${index}`}
          onClick={() => handleClick(fill + (half > 0 ? 1 : 0) + index + 1)}
        />
      ))}
    </div>
  );
}
