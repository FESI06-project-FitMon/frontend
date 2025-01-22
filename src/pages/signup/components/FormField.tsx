import Input from '@/components/common/Input';
import React from 'react';

interface FormFieldProps<T> {
  label: string;
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  placeholder: string;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  errorMessage: string;
}

// 회원가입, 로그인 input 컴포넌트
export default function FormField<T>({
  label,
  type,
  name,
  value,
  placeholder,
  setForm,
  handleBlur,
  hasError = false,
  errorMessage,
}: FormFieldProps<T>) {
  // 입력 값 저장
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full">
      <p className="mb-2.5 text-[1rem]">{label}</p>
      <Input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        className={hasError ? 'mb-3' : ''}
      />
      {hasError && (
        <p className="mt-3 text-[0.875rem] text-error">{errorMessage}</p>
      )}
    </div>
  );
}
