import Image from 'next/image';
import { ChangeEvent, KeyboardEvent } from 'react';

interface NumberSelectProps {
  targetNumber: number;
  setTargetNumber: (targetNumber: number) => void;
  min: number; // 최소값
  width?: string;
  height?: string;
  className?: string;
}

export default function NumberSelect({
  targetNumber,
  setTargetNumber,
  min,
  width,
  height,
  className,
}: NumberSelectProps) {
  const MAX_VALUE = 30; // 최대값 고정

  // 범위 제한 함수
  const clampValue = (value: number) =>
    Math.max(min, Math.min(value, MAX_VALUE));

  // 입력 변경 처리
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자 또는 빈 문자열만 허용
    if (/^\d*$/.test(value)) {
      setTargetNumber(value === '' ? min : clampValue(parseInt(value, 10)));
    }
  };

  // 입력 완료 처리 (Enter, Blur)
  const handleValidation = (value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setTargetNumber(clampValue(numericValue));
    }
  };

  // 키보드 입력 처리
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValidation(e.currentTarget.value);
    } else if (e.key === 'ArrowUp' && targetNumber < MAX_VALUE) {
      setTargetNumber(targetNumber + 1);
    } else if (e.key === 'ArrowDown' && targetNumber > min) {
      setTargetNumber(targetNumber - 1);
    }
  };

  return (
    <div
      className={`w-[${width}] h-[${height}] ${className} flex justify-between items-center bg-dark-400 rounded-[8px] border-[1px] border-dark-500 px-5`}
    >
      <input
        className="bg-transparent outline-none w-full"
        value={targetNumber.toString()}
        onChange={handleChange}
        onBlur={(e) => handleValidation(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/assets/image/arrow-up.svg"
          alt="Increase"
          width={16}
          height={16}
          onClick={() => setTargetNumber(clampValue(targetNumber + 1))}
          className="cursor-pointer"
        />
        <Image
          src="/assets/image/arrow-down.svg"
          alt="Decrease"
          width={16}
          height={16}
          onClick={() => setTargetNumber(clampValue(targetNumber - 1))}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
