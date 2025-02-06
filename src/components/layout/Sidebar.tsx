import { useLogoutMutation } from '@/pages/login/service/postLogout';
import useLayoutStore from '@/stores/useLayoutStore';
import useMemberStore from '@/stores/useMemberStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SideBar() {
  const { isListExpanded, toggleListExpanded } = useLayoutStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const sideBarContents = [
    { label: '모임 찾기', path: '/' },
    { label: '찜한 모임', path: '/likes' },
    { label: '모든 방명록', path: '/guestBooks' },
  ];
  const loginContents = { label: '로그인', path: '/login' };
  const mypageContents = [
    { label: '마이페이지', path: '/mypage' },
    { label: '로그아웃', path: '/' },
  ];

  const isActive = (isActive: boolean) => {
    return isActive
      ? `text-primary flex items-center text-lg w-[67vw] h-[50px] p-[15px] bg-dark-300 rounded-[10px]`
      : `text-white flex items-center text-lg w-[67vw] h-[50px] p-[15px]`;
  };

  const handleNavigation = (path: string, index: number) => {
    setSelectedIndex(index); // 선택된 항목 상태 업데이트
    toggleListExpanded(); // 사이드바 닫기
    router.push(path); // 라우터를 통해 페이지 이동
  };

  const { isLogin } = useMemberStore();
  const { mutate: logoutMutation } = useLogoutMutation();

  return (
    <>
      {isListExpanded && (
        <>
          {/* 배경을 누르면 리스트를 닫기 위한 div 요소 */}
          <div
            className="fixed flex w-screen h-screen z-[51]"
            onClick={() => toggleListExpanded()}
          >
            {/* 사이드바 */}
            <div
              className="fixed flex flex-col top-0 left-0 px-5 h-screen bg-dark-200 z-50 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <Image
                src="/assets/image/close.svg"
                alt="close"
                width={24}
                height={24}
                className="mt-6 mb-9"
                onClick={() => toggleListExpanded()}
              />
              {/* FitMon 로고 */}
              <Link
                href="/"
                className="text-red-500 font-bold text-[1.75rem] mb-[30px]"
              >
                FitMon
              </Link>
              {/* 네비게이션 요소 */}
              <ul className="flex flex-col gap-y-4 justify-center">
                {sideBarContents.map((content, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer ${isActive(index === selectedIndex)}`}
                    onClick={() => handleNavigation(content.path, index)}
                  >
                    {content.label}
                  </li>
                ))}
              </ul>

              {!isLogin ? (
                <>
                  {/* (비로그인 상태) 로그인 요소 */}
                  <div
                    className={`mt-4 cursor-pointer ${isActive(3 === selectedIndex)}`}
                    onClick={() => handleNavigation(loginContents.path, 3)}
                  >
                    {loginContents.label}
                    {/* 로그인 이미지 */}
                    {loginContents.label === '로그인' && (
                      <Image
                        className="ml-2"
                        src={`${
                          3 === selectedIndex
                            ? '/assets/image/login-primary.svg'
                            : '/assets/image/login.svg'
                        }`}
                        alt="login button"
                        width={16}
                        height={16}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* (로그인 상태) 마이페이지 요소 */}
                  <p className="text-white text-sm mt-[50px] ml-[3px] mb-5">
                    {'MYPAGE'}
                  </p>
                  <ul className="flex flex-col gap-y-4 justify-center">
                    {mypageContents.map((content, index) => (
                      <li
                        key={index}
                        className={`cursor-pointer ${isActive(index + 4 === selectedIndex)}`}
                        onClick={() => {
                          handleNavigation(content.path, index + 4);
                          logoutMutation();
                        }}
                      >
                        {content.label}
                        {/* 로그아웃 이미지 */}
                        {content.label === '로그아웃' && (
                          <Image
                            className="ml-2"
                            src={`${
                              index + 4 === selectedIndex
                                ? '/assets/image/logout-primary.svg'
                                : '/assets/image/logout.svg'
                            }`}
                            alt="logout button"
                            width={16}
                            height={16}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
