import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useMemberStore from '@/stores/useMemberStore';
import useLayoutStore from '@/stores/useLayoutStore';
import UserProfile from './UserProfile';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getMe from '@/pages/login/components/getMe';
import Alert from '../dialog/Alert';
import Loading from '../dialog/Loading';

export default function Navigation() {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path
      ? 'text-red-500 font-bold'
      : 'text-gray-300';
  };

  const { isLogin, user, setIsLogin, setUser } = useMemberStore();
  const { toggleListExpanded } = useLayoutStore();

  const handleListButtonClick = () => {
    toggleListExpanded();
  };

  // 에러 발생 시 Alert 표시 및 닫기
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // 현재 로그인 정보 가져오는 useQuery
  const { isLoading, isError, data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isLogin,
  });

  // 로그인 여부 확인해 사용자 정보 초기화
  useEffect(() => {
    const localIsLogin = localStorage.getItem('isLogin') === 'true';
    setIsLogin(localIsLogin);
  }, []);

  // useQuery 성공 시 사용자 정보 업데이트
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  // 에러 발생 시 로그아웃 처리
  useEffect(() => {
    if (isError) {
      localStorage.setItem('isLogin', 'false');
      setIsLogin(false); // 에러가 발생하면 로그인 상태 초기화
      setShowConfirmAlert(true);
    }
  }, [isError]);

  // 에러 발생
  if (isError) {
    return (
      <Alert
        isOpen={showConfirmAlert}
        type="confirm"
        message="오류가 발생했습니다. 다시 로그인해주세요."
        onConfirm={() => {
          setShowConfirmAlert(false);
          router.push('/login');
        }}
      />
    );
  }

  // 로딩 중
  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-dark-100 shadow-lg z-40 border-b-[1px] border-b-dark-300">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-20">
          {/* 로고 영역 */}
          <h1 className="flex flex-row items-center flex-shrink-0 mr-8 ">
            {' '}
            {/* 오른쪽 여백 추가 */}
            <div className="flex md:hidden">
              <Image
                alt="list button"
                onClick={handleListButtonClick}
                src="/assets/image/list.svg"
                width="23"
                height="20"
              />
            </div>
            <Link href="/" className="text-primary font-bold text-2xl pl-[24px] md:pl-0">
              FitMon
            </Link>
          </h1>

          {/* 메인 네비게이션 */}
          <nav className="hidden md:flex flex-1 items-center">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`${isActive('/')} hover:text-red-500 px-3 py-2 text-base font-semibold transition-colors`}
              >
                모임 찾기
              </Link>
              <Link
                href="/likes"
                className={`${isActive('/likes')} hover:text-red-500 px-3 py-2 text-semibold font-medium transition-colors`}
              >
                찜한 모임
              </Link>
              <Link
                href="/guestBooks"
                className={`${isActive('/guestBooks')} hover:text-red-500 px-3 py-2 text-semibold font-medium transition-colors`}
              >
                모든 방명록
              </Link>
            </div>
          </nav>

          {/* 사용자 프로필 영역 */}
          {isLogin ? (
            <UserProfile nickname={user.nickName} />
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="sm:w-[124px] sm:h-[42px] w-[100px] h-[34px] rounded-[10px] text-base bg-primary text-white"
            >
              {'로그인'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
