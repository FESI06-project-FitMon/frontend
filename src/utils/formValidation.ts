import { emailRegex, passwordRegex } from '@/constants/Regex';

interface formValidationProps {
  name: string;
  value: string;
  password?: string;
  passwordCheck?: string;
  formType: string;
}

// 회원가입, 로그인 폼 유효성 검사
export default function formValidation({
  name,
  value,
  password,
  passwordCheck,
  formType,
}: formValidationProps) {
  if (value === '') {
    return {
      [name]: false,
    };
  }

  // 닉네임: 2자 이상 10자 이하
  if (name === 'nickName') {
    return {
      nickName: value.length < 2 || value.length > 10,
    };
  }

  // 이메일: 이메일 형식
  else if (name === 'email') {
    return {
      email: !emailRegex.test(value),
    };
  }

  // (회원가입) 비밀번호: 8자 이상, 영문 대소문자, 숫자, 특수문자 포함
  else if (name === 'password' && formType === 'signup') {
    if (passwordCheck !== '') {
      // 비밀번호 확인값이 있을 때
      return {
        password: !passwordRegex.test(value),
        passwordCheck: value !== passwordCheck,
      };
    } else {
      return {
        password: !passwordRegex.test(value),
      };
    }
  }

  // 비밀번호 확인: 비밀번호와 동일
  else if (name === 'passwordCheck') {
    return {
      passwordCheck: value !== password,
    };
  }

  // 나머지
  else {
    return {
      [name]: false,
    };
  }
}
