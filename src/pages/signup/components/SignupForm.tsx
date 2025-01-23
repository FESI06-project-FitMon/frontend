import Button from '@/components/common/Button';
import { useState } from 'react';
import postSignup, {
  postSignupProps,
  postSignupResponse,
} from '@/pages/signup/components/service/postSignup';
import router from 'next/router';
import FormField from './FormField';
import { useMutation } from '@tanstack/react-query';
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
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // 회원가입 요청
  const useSignupMutation = useMutation<
    postSignupResponse,
    Error,
    postSignupProps
  >({
    mutationFn: postSignup,
    onSuccess: (data: postSignupResponse) => {
      if (data.message === '사용자 생성 성공') {
        setAlertMessage('회원가입이 완료되었습니다.');
        setShowConfirmAlert(true);
      }
    },
    onError: (error: Error) => {
      if (error.message === 'Request failed with status code 400') {
        // console.log('이미 존재하는 이메일입니다.');
        setShowConfirmAlert(true);
        setAlertMessage('이미 존재하는 이메일입니다.');
      }
    },
  });

  // 회원가입 요청
  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = Object.values(signupFormError).every((error) => !error);
    if (isValid) {
      useSignupMutation.mutate({
        email: signupForm.email,
        nickName: signupForm.nickName,
        password: signupForm.password,
      });
    }
  };

  // 회원가입 성공 여부 표시
  const handleConfirm = () => {
    if (alertMessage === '회원가입이 완료되었습니다.') {
      setShowConfirmAlert(false);
      router.push('/login');
    } else {
      setShowConfirmAlert(false);
    }
  };

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="flex flex-col w-full px-6 gap-8 md:gap-6"
    >
      <FormField<SignupFields>
        label="닉네임"
        type="text"
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
      <FormField<SignupFields>
        label="이메일"
        type="text"
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
      <FormField<SignupFields>
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
      <FormField<SignupFields>
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
        isOpen={showConfirmAlert}
        type="confirm"
        message={alertMessage}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
