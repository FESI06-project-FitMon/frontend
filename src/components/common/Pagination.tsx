import Image from 'next/image';
import { useState } from 'react';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalNumber: number;
  countPerPage: number;
}
export default function Pagination({
  page,
  setPage,
  totalNumber,
  countPerPage,
}: PaginationProps) {
  const [index, setIndex] = useState<number>(0);
  const lastPage: number = Math.floor(totalNumber / countPerPage); // 총 4개로 구성된 페이지 수
  const lastCount = totalNumber % countPerPage; // 페이지 이외에 나오는 수
  const pageCount = lastPage + (lastCount === 0 ? 0 : 1);
  const pageStyle = (current: boolean) => {
    if (current) {
      return 'text-center	font-bold text-white bg-primary rounded-full w-[22px] h-[22px]';
    }
    return 'text-center text-dark-700 rounded-full w-[22px] h-[22px]';
  };

  const handleLeftbuttonClick = () => {
    if (page === 0) return;
    if ((page + 1) % 10 === 1) {
      setIndex(index - 1);
    }
    setPage(page - 1);
  };

  const handleRightbuttonClick = () => {
    if (page === pageCount - 1) return;
    if ((page + 1) % 10 === 0) {
      setIndex(index + 1);
    }
    setPage(page + 1);
  };

  if (totalNumber <= 0) return;
  return (
    <div className="flex w-full items-center justify-center">
      <Image
        src="/assets/image/arrow-left.svg"
        width={16}
        height={16}
        alt="arrow-left"
        onClick={() => handleLeftbuttonClick()}
      />

      <div className="flex gap-[14px] mx-[22px]">
        {[
          ...Array(
            pageCount <= 10
              ? pageCount
              : index === Math.floor(lastPage / 10)
                ? pageCount % 10
                : 10,
          ),
        ].map((_, idx) => (
          <p
            key={idx}
            className={pageStyle(idx + index * 10 === page)}
            onClick={() => setPage(idx + index * 10)}
          >
            {idx + 1 + index * 10}
          </p>
        ))}

        {pageCount > 10 && index !== Math.floor(lastPage / 10) && (
          <>
            <p>{'···'}</p>{' '}
            <p className={pageStyle(false)} onClick={() => setPage(index)}>
              {lastPage}
            </p>
          </>
        )}
      </div>

      <Image
        src="/assets/image/arrow-right.svg"
        width={16}
        height={16}
        alt="arrow-right"
        onClick={() => handleRightbuttonClick()}
      />
    </div>
  );
}
