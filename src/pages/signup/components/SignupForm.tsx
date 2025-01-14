import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import postSignup from './postSignup';
import signupValidation from '@/utils/validation/signupValidation';
import router from 'next/router';
import FormField from './FormField';
import useDebounce from '@/utils/validation/useDebounce';

// 회원가입 폼 컴포넌트
export default function SignupForm() {
  // 입력 값 저장
  const [signupForm, setSignupForm] = useState({
    nickName: '',
    email: '',
    password: '',
    passwordCheck: '',
  });

  // 유효성 검사 결과 저장
  const [signupFormError, setSignupFormError] = useState({
    nickName: false,
    email: false,
    password: false,
    passwordCheck: false,
  });

  // 입력 값 저장
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const debouncedSignupForm = useDebounce(signupForm, 1000);

  // 포커스 아웃 시 특정 필드 유효성 검사
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    signupValidation({
      name: e.target.name,
      value: e.target.value,
      password: signupForm.password,
      setSignupFormError,
    });
  };

  // 폼 전체 유효성 검사 (포커스 후 입력값 없는 경우)
  useEffect(() => {
    Object.entries(debouncedSignupForm).forEach(([name, value]) => {
      if (value === '') return;
      signupValidation({
        name: name,
        value: value.trim(),
        password: debouncedSignupForm.password,
        setSignupFormError,
      });
    });
  }, [debouncedSignupForm]);

  // 회원가입 요청
  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = Object.values(signupFormError).every((error) => !error);
    if (isValid) {
      postSignup({
        email: signupForm.email.trim(),
        nickName: signupForm.nickName.trim(),
        password: signupForm.password.trim(),
      });
    }
  };

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="flex flex-col w-full px-6 gap-6"
    >
      <FormField
        label="닉네임"
        type="text"
        name="nickName"
        value={signupForm.nickName}
        placeholder="닉네임을 입력해주세요"
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        hasError={signupFormError.nickName}
        errorMessage="닉네임은 2자 이상 10자 이하로 입력해주세요."
      />
      <FormField
        label="이메일"
        type="email"
        name="email"
        value={signupForm.email}
        placeholder="이메일을 입력해주세요"
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        hasError={signupFormError.email}
        errorMessage="유효한 이메일 주소를 입력해주세요."
      />
      <FormField
        label="비밀번호"
        type="password"
        name="password"
        value={signupForm.password}
        placeholder="비밀번호를 입력해주세요"
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        hasError={signupFormError.password}
        errorMessage="비밀번호는 최소 8자 이상이어야 합니다."
      />
      <FormField
        label="비밀번호 확인"
        type="password"
        name="passwordCheck"
        value={signupForm.passwordCheck}
        placeholder="비밀번호를 입력해주세요"
        handleInputChange={handleInputChange}
        handleBlur={handleBlur}
        hasError={signupFormError.passwordCheck}
        errorMessage="비밀번호가 일치하지 않습니다."
      />
      <Button type="submit" name="회원가입" className="h-16 mt-3" />
      <div className="flex flex-row justify-end mt-3">
        <p className="mr-4 text-[1rem]">{'이미 회원이신가요?'}</p>
        <p
          onClick={() => router.push('/login')}
          className="text-[1rem] text-primary underline decoration-primary underline-offset-[5px] cursor-pointer"
        >
          {'로그인하기'}
        </p>
      </div>
    </form>
  );
}
