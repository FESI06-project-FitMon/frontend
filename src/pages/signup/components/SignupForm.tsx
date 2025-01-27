import Button from '@/components/common/Button';
import { useState } from 'react';
import { useSignupMutation } from '@/pages/signup/components/service/postSignup';
import router from 'next/router';
import FormField from './FormField';
import Alert from '@/components/dialog/Alert';
import FormRedirect from './FormRedirect';

export interface SignupFields {
  nickName: string;
  email: string;
  password: string;
  passwordCheck: string;
}

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

  // 회원가입 성공, 실패 메시지 및 표시
  const [confirmAlert, setConfirmAlert] = useState({
    message: '',
    show: false,
  });

  // 회원가입 요청 Mutation 함수
  const { mutate: signupMutation } = useSignupMutation({ setConfirmAlert });

  // 회원가입 요청
  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = Object.values(signupFormError).every((error) => !error);
    if (isValid) {
      signupMutation({
        email: signupForm.email,
        nickName: signupForm.nickName,
        password: signupForm.password,
      });
    }
  };

  // 회원가입 성공 여부 표시
  const handleConfirm = () => {
    if (confirmAlert.message === '회원가입이 완료되었습니다.') {
      setConfirmAlert({
        message: '',
        show: false,
      });
      router.push('/login');
    } else {
      setConfirmAlert({
        message: '',
        show: false,
      });
    }
  };

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="flex flex-col w-full px-6 gap-8 md:gap-6"
    >
      <FormField
        label="닉네임"
        name="nickName"
        value={signupForm.nickName}
        placeholder="닉네임을 입력해주세요"
        form={signupForm}
        setForm={setSignupForm}
        formError={signupFormError}
        setFormError={setSignupFormError}
        hasError={signupFormError.nickName}
        errorMessage="닉네임은 2자 이상 10자 이하로 입력해주세요."
      />
      <FormField
        label="이메일"
        type="email"
        name="email"
        value={signupForm.email}
        placeholder="이메일을 입력해주세요"
        form={signupForm}
        setForm={setSignupForm}
        formError={signupFormError}
        setFormError={setSignupFormError}
        hasError={signupFormError.email}
        errorMessage="유효한 이메일 주소를 입력해주세요."
      />
      <FormField
        label="비밀번호"
        type="password"
        name="password"
        value={signupForm.password}
        placeholder="비밀번호를 입력해주세요"
        form={signupForm}
        setForm={setSignupForm}
        formError={signupFormError}
        setFormError={setSignupFormError}
        hasError={signupFormError.password}
        errorMessage="비밀번호는 최소 8자 이상이어야 합니다."
      />
      <FormField
        label="비밀번호 확인"
        type="password"
        name="passwordCheck"
        value={signupForm.passwordCheck}
        placeholder="비밀번호를 입력해주세요"
        form={signupForm}
        setForm={setSignupForm}
        formError={signupFormError}
        setFormError={setSignupFormError}
        hasError={signupFormError.passwordCheck}
        errorMessage="비밀번호가 일치하지 않습니다."
      />
      <Button type="submit" name="회원가입" className="h-16 mt-3" />
      <FormRedirect currentPage="signup" />
      <Alert
        isOpen={confirmAlert.show}
        type="confirm"
        message={confirmAlert.message}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
