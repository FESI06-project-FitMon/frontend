import router from 'next/router';

type PageType = 'login' | 'signup';

interface FormRedirectProps {
  currentPage: PageType;
}

const REDIRECT_TEXT: Record<
  PageType,
  { message: string; recommend: string; link: string }
> = {
  login: {
    message: '아직 회원이 아니신가요?',
    recommend: '회원가입하기',
    link: 'signup',
  },
  signup: {
    message: '이미 회원이신가요?',
    recommend: '로그인하기',
    link: 'login',
  },
};

// 회원가입 페이지에서 로그인 페이지로 이동
// 로그인 페이지에서 회원가입 페이지로 이동

export default function FormRedirect({ currentPage }: FormRedirectProps) {
  const { message, recommend, link } = REDIRECT_TEXT[currentPage];

  return (
    <div className="flex flex-row justify-center md:justify-end -mt-2 md:mt-3">
      <p className="mr-4 text-[1rem]">{message}</p>
      <p
        onClick={() => router.push(`/${link}`)}
        className="text-[1rem] text-primary underline decoration-primary underline-offset-[5px] cursor-pointer"
      >
        {recommend}
      </p>
    </div>
  );
}
