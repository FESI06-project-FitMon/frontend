import { useState } from 'react';
import Button from '@/components/common/Button';
import { useLoginMutation } from './service/postLogin';
import router from 'next/router';
import FormField from '@/pages/signup/components/FormField';
import Alert from '@/components/dialog/Alert';
import useMemberStore from '@/stores/useMemberStore';
import FormRedirect from '@/pages/signup/components/FormRedirect';

export interface LoginFields {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // 유효성 검사 결과 저장
  const [loginFormError, setLoginFormError] = useState({
    email: false,
    password: false,
  });

  // 로그인 성공, 실패 메시지 및 표시
  const [confirmAlert, setConfirmAlert] = useState({
    message: '',
    show: false,
  });

  // 로그인 요청 Mutation 함수
  const { mutate: loginMutation } = useLoginMutation({ setConfirmAlert });

  // 로그인 요청
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = Object.values(loginFormError).every((error) => !error);
    if (isValid) {
      loginMutation({
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      });
    }
  };

  // 로그인 성공 여부 표시
  const handleConfirm = () => {
    if (confirmAlert.message === '로그인에 성공했습니다.') {
      localStorage.setItem('isLogin', 'true');
      useMemberStore.getState().setIsLogin(true);
      setConfirmAlert({
        message: '',
        show: false,
      });
      router.push('/');
    } else {
      setConfirmAlert({
        message: '',
        show: false,
      });
    }
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="flex flex-col w-full px-6 gap-8 md:gap-6"
    >
      <FormField
        label="이메일"
        type="email"
        name="email"
        value={loginForm.email}
        placeholder="이메일을 입력해주세요"
        form={loginForm}
        setForm={setLoginForm}
        formError={loginFormError}
        setFormError={setLoginFormError}
        hasError={loginFormError.email}
        errorMessage="유효한 이메일 주소를 입력해주세요."
      />

      <FormField
        label="비밀번호"
        type="password"
        name="password"
        value={loginForm.password}
        placeholder="비밀번호를 입력해주세요"
        form={loginForm}
        setForm={setLoginForm}
        formError={loginFormError}
        setFormError={setLoginFormError}
        hasError={loginFormError.password}
        errorMessage="비밀번호를 입력해주세요."
      />

      <Button type="submit" name="로그인" className="h-16 mt-3" />
      <FormRedirect currentPage="login" />
      <Alert
        isOpen={confirmAlert.show}
        type="confirm"
        message={confirmAlert.message}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
