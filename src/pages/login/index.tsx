import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import postLogin from './components/postLogin';
<<<<<<< HEAD
=======
import router from 'next/router';
>>>>>>> ccbdc5fca1066179f4fd665919849ac451985686

export default function Login() {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  // 로그인 정보 저장
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 요청
  // 로그인 쿠키 테스트용 코드, 이후 수정 예정
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(loginFormData);
    postLogin({
      email: loginFormData.email,
      password: loginFormData.password,
    });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center max-w-[640px] w-1/3">
        <h1 className="mb-12 text-[2.25rem] font-medium">{'로그인'}</h1>

        <form
          onSubmit={handleLoginSubmit}
          className="flex flex-col w-full px-6"
        >
          <p className="mt-6 mb-2.5 text-[1rem]">이메일</p>
          <Input
            type="email"
            name="email"
            value={loginFormData.email}
            placeholder="이메일을 입력해주세요"
            handleInputChange={handleInputChange}
          />

          <p className="mt-6 mb-2.5 text-[1rem]">비밀번호</p>
          <Input
            type="password"
            name="password"
            value={loginFormData.password}
            placeholder="비밀번호를 입력해주세요"
            handleInputChange={handleInputChange}
            className="mb-9"
          />

          <Button type="submit" name="로그인" />
<<<<<<< HEAD
=======
          <div className="flex flex-row justify-end mt-9">
            <p className="mr-4 text-[1rem]">{'아직 회원이 아니신가요?'}</p>
            <p
              onClick={() => router.push('/signup')}
              className="text-[1rem] text-primary underline decoration-primary underline-offset-[5px] cursor-pointer"
            >
              {'회원가입하기'}
            </p>
          </div>
>>>>>>> ccbdc5fca1066179f4fd665919849ac451985686
        </form>
      </div>
    </div>
  );
}
