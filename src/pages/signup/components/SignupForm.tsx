import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import postSignup, { postSignupProps, postSignupResponse } from './postSignup';
import signupValidation from '@/utils/validation/signupValidation';
import router from 'next/router';
import FormField from './FormField';
import useDebounce from '@/hooks/useDebounce';
import { useMutation } from '@tanstack/react-query';
import Alert from '@/components/dialog/Alert';

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
  const useSignupMutation = useMutation<
    postSignupResponse,
    Error,
    postSignupProps,
    unknown
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
        email: signupForm.email.trim(),
        nickName: signupForm.nickName.trim(),
        password: signupForm.password.trim(),
      });
    }
  };

  const handleConfirm = () => {
    if (alertMessage === '회원가입이 완료되었습니다.') {
      setShowConfirmAlert(false);
      router.push('/login');
    }
  };

  return (
    <form
      onSubmit={handleSignupSubmit}
      className="flex flex-col w-full px-6 gap-8 md:gap-6"
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
        type="text"
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
      <div className="flex flex-row justify-center md:justify-end -mt-2 md:mt-3">
        <p className="mr-4 text-[1rem]">{'이미 회원이신가요?'}</p>
        <p
          onClick={() => router.push('/login')}
          className="text-[1rem] text-primary underline decoration-primary underline-offset-[5px] cursor-pointer"
        >
          {'로그인하기'}
        </p>
      </div>
      <Alert
        isOpen={showConfirmAlert}
        type="confirm"
        message={alertMessage}
        onConfirm={handleConfirm}
      />
    </form>
  );
}
