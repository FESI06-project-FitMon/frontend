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

  // 유효성 검사 및 값 설정
  const validateAndSet = (value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.max(min, Math.min(numericValue, MAX_VALUE));
      setTargetNumber(clampedValue);
    }
  };

  // 입력 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자 또는 빈 문자열만 허용
    if (/^\d*$/.test(value)) {
      setTargetNumber(value === '' ? min : parseInt(value, 10));
    }
  };

  // 엔터 키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndSet(e.currentTarget.value);
    }
  };

  // 블러 시 유효성 검사
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.value);
  };

  return (
    <div
      className={`w-[${width}] h-[${height}] ${className} flex justify-between items-center top-full bg-dark-400 rounded-[8px] border-[1px] border-dark-500 px-5`}
    >
      <input
        className="bg-transparent outline-none w-full"
        value={targetNumber.toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/assets/image/arrow-up.svg"
          alt="arrow"
          width={16}
          height={16}
          onClick={() => {
            if (targetNumber < MAX_VALUE) {
              setTargetNumber(targetNumber + 1);
            }
          }}
          className="flex -space-y-[10px]"
        />
        <Image
          src="/assets/image/arrow-down.svg"
          alt="arrow"
          width={16}
          height={16}
          onClick={() => {
            if (targetNumber > min) {
              setTargetNumber(targetNumber - 1);
            }
          }}
        />
      </div>
    </div>
  );
}
