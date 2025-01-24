interface formValidationProps {
  name: string;
  value: string;
  password: string;
  formType: string;
}

// 회원가입, 로그인 폼 유효성 검사
export default function formValidation({
  name,
  value,
  password,
  formType,
}: formValidationProps) {
  // 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === '') {
    return false;
  }
  // 닉네임: 2자 이상 10자 이하
  if (name === 'nickName') {
    return value.length < 2 || value.length > 10;
  }
  // 이메일: 이메일 형식
  else if (name === 'email') {
    return value === '' || !emailRegex.test(value);
  }
  // (회원가입) 비밀번호: 8자 이상
  else if (name === 'password' && formType === 'signup') {
    return value.length < 8;
  }
  // (로그인) 비밀번호: 빈 칸 불가능
  // 첫 번째는 막는 방법이 없음
  // else if (name === 'password' && formType === 'login') {
  //   return value === '';
  // }

  // 비밀번호 확인: 비밀번호와 동일
  else if (name === 'passwordCheck') {
    return value === '' || value !== password;
  }
  // 나머지
  else {
    return true;
  }
}
