import React, { useRef, useState } from 'react';

interface ModalInputProps {
  type: 'title' | 'description'; // 입력 타입 (타이틀 또는 설명)
  placeholder: string; // 플레이스홀더 텍스트
  value: string; // 입력 값
  onChange: (value: string) => void; // 값 변경 핸들러
  className?: string; // 추가 스타일링을 위한 클래스
  maxLength: number; // 최대 글자수 지정
  height?: string; // 텍스트 영역 높이
  onValidationFail?: () => void; // 유효성 검사 실패 시 콜백
  onBlur?: (value: string) => void; // onBlur 이벤트 핸들러
}

const ModalInput: React.FC<ModalInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  className = '',
  maxLength,
  height = '76px',
  onValidationFail,
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // `input` 참조
  const textareaRef = useRef<HTMLTextAreaElement>(null); // `textarea` 참조
  const [error, setError] = useState(false);

  const handleBlur = () => {
    if (!value.trim()) {
      setError(true);
      if (onValidationFail) {
        onValidationFail();
      }
      // 적절한 필드에 포커스 재설정
      if (type === 'title') {
        inputRef.current?.focus();
      } else {
        textareaRef.current?.focus();
      }
    } else {
      setError(false);
    }

    if (onBlur) {
      onBlur(value); // 부모로 value 전달
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {type === 'title' ? (
        <input
          ref={inputRef} // `input` 참조 설정
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-dark-400 text-white rounded-lg placeholder-dark-700 focus:outline-none focus:ring-2 transition-all ${
            error ? 'focus:ring-error' : 'focus:ring-[#FF7487]'
          }`}
          onBlur={handleBlur} // 블러 이벤트 처리
        />
      ) : (
        <textarea
          ref={textareaRef} // `textarea` 참조 설정
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 bg-dark-400 text-white rounded-lg placeholder-dark-700 focus:outline-none focus:ring-2 transition-all ${
            error ? 'focus:ring-error' : 'focus:ring-[#FF7487]'
          }`}
          style={{ height }}
          onBlur={handleBlur} // 블러 이벤트 처리
        />
      )}
    </div>
  );
};

export default ModalInput;
