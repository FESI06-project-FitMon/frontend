import { useState } from 'react';
import Button from '@/components/common/Button';
import postLogin, {
  postLoginProps,
  postLoginResponse,
} from './service/postLogin';
import router from 'next/router';
import FormField from '@/pages/signup/components/FormField';
import { useMutation } from '@tanstack/react-query';
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
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // 로그인 요청 Mutation 함수
  const useLoginMutation = useMutation<
    postLoginResponse,
    Error,
    postLoginProps,
    unknown
  >({
    mutationFn: postLogin,
    onSuccess: (data: postLoginResponse) => {
      if (data.email) {
        setAlertMessage('로그인에 성공했습니다.');
        setShowConfirmAlert(true);
      }
    },
    onError: (error: Error) => {
      console.log(error);
      if (error.message === 'Request failed with status code 401') {
        setAlertMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
        setShowConfirmAlert(true);
      }
    },
  });

  // 로그인 요청
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = Object.values(loginFormError).every((error) => !error);
    if (isValid) {
      useLoginMutation.mutate({
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      });
    }
  };

  // 로그인 성공 여부 표시
  const handleConfirm = () => {
    if (alertMessage === '로그인에 성공했습니다.') {
      localStorage.setItem('isLogin', 'true');
      useMemberStore.getState().setIsLogin(true);
      setShowConfirmAlert(false);
      router.push('/');
    } else {
      setShowConfirmAlert(false);
    }
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="flex flex-col w-full px-6 gap-8 md:gap-6"
    >
      <FormField<LoginFields>
        label="이메일"
        type="text"
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

      <FormField<LoginFields>
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
        isOpen={showConfirmAlert}
        type="confirm"
        message={alertMessage}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
