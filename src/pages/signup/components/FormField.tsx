import Input from '@/components/common/Input';
import useDebounce from '@/hooks/useDebounce';
import formValidation from '@/utils/formValidation';
import React, { useEffect } from 'react';

interface FormFieldProps<
  T extends Record<string, string>,
  E extends Record<string, boolean>,
> {
  label: string;
  type?: 'text' | 'email' | 'password';
  name: Extract<keyof T, string>;
  value: string;
  placeholder: string;
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
  formError: E;
  setFormError: React.Dispatch<React.SetStateAction<E>>;
  hasError: boolean;
  errorMessage: string;
}

// 회원가입, 로그인 input 컴포넌트
export default function FormField<
  T extends Record<string, string>,
  E extends Record<string, boolean>,
>({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  form,
  setForm,
  formError,
  setFormError,
  hasError,
  errorMessage,
}: FormFieldProps<T, E>) {
  // 입력 값 저장
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  // 포커스 아웃 시 특정 필드 유효성 검사
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formType = 'nickName' in form ? 'signup' : 'login';

    setFormError((prev) => ({
      ...prev,
      [name]: formValidation({
        name,
        value: value.trim(),
        password: form.password,
        formType,
      }),
    }));
  };

  // 포커스 후 1초 이상 입력 없으면 값 저장
  const debouncedFormValue = useDebounce(form[name], 1000);

  // 포커스 후 1초 이상 입력 없으면 유효성 검사
  useEffect(() => {
    const formType = 'nickName' in form ? 'signup' : 'login';
    setFormError((prev) => ({
      ...prev,
      [name]: formValidation({
        name: name,
        value: debouncedFormValue.trim(),
        password: form.password,
        formType,
      }),
    }));
  }, [debouncedFormValue]);

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
      {formError[name] && (
        <p className="mt-3 text-[0.875rem] text-error">{errorMessage}</p>
      )}
    </div>
  );
}
