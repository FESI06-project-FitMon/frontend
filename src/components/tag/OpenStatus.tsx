import Image from 'next/image';

interface OpenStatusProps {
  gatheringJoinedPeopleCount: number;
  className?: string;
}

export default function OpenStatus({
  gatheringJoinedPeopleCount,
  className = ''
}: OpenStatusProps) {
  // 5명 이상이면 개설확정
  const isConfirmed = gatheringJoinedPeopleCount >= 5;

  return (
    <div className={`text-left ${className}`}>
      <span
        className={`font-semibold  ${isConfirmed ? 'text-primary' : 'text-dark-700'
          }`}
      >
        {isConfirmed ? (
          <div className="flex items-center text-xs md:text-base gap-[4px]">
            <span>개설확정</span>
            <div className="w-3 h-3 md:w-4 md:h-4 ml-[2px] bg-primary rounded-full">
              <Image
                src="/assets/image/open-check.svg"
                alt="확정"
                layout="responsive"
                width={16}
                height={16}
              />
            </div>
          </div>
        ) : (
          '개설대기'
        )}
      </span>
    </div>
  );
}
