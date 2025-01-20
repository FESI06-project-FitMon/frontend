import React, { useState } from 'react';

interface ModalInputProps {
  type: 'title' | 'description'; // 입력 타입 (타이틀 또는 설명)
  placeholder: string; // 플레이스홀더 텍스트
  value: string; // 입력 값
  onChange: (value: string) => void; // 값 변경 핸들러
  className?: string; // 추가 스타일링을 위한 클래스
  maxLength: number; // 최대 글자수 지정
  height?: string; // 텍스트 영역 높이
  onValidationFail?: () => void; // 유효성 검사 실패 시 콜백
}

const ModalInput: React.FC<ModalInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className = '',
  maxLength,
  height = '76px', // 기본 높이
  onValidationFail,
}) => {
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = e.target.value;
    setError(false); // 입력 중 에러 제거
    onChange(newValue); // 변경된 값을 전달
  };

  const validateInput = () => {
    if (!value.trim()) {
      setError(true);
      if (onValidationFail) {
        onValidationFail(); // 명시적으로 호출
      }
      return false;
    }
    setError(false);
    return true;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {type === 'title' ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-dark-400 text-white rounded-lg placeholder-dark-700 focus:outline-none focus:ring-2 transition-all ${
            error ? 'focus:ring-primary' : 'focus:ring-[#FF7487]'
          }`}
          onBlur={validateInput}
        />
      ) : (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-dark-400 text-white rounded-lg placeholder-dark-700 focus:outline-none focus:ring-2 transition-all ${
            error ? 'focus:ring-primary' : 'focus:ring-[#FF7487]'
          }`}
          style={{ height }} // 전달받은 높이 적용
          onBlur={validateInput}
        />
      )}
    </div>
  );
};

export default ModalInput;

