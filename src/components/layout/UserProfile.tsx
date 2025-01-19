import useMemberStore from '@/stores/useMemberStore';
import Popover from '../common/Popover';
import router from 'next/router';

export default function UserProfile({ nickname }: { nickname: string }) {
  const popoverItems = [
    {
      id: 'mypage',
      label: '마이페이지',
      onClick: () => {
        router.push('/mypage');
      },
    },
    {
      id: 'logout',
      label: '로그아웃',
      onClick: () => {
        localStorage.removeItem('isLogin');
        useMemberStore.getState().setIsLogin(false);
        router.push('/');
      },
    },
  ];

  return (
    <div className="flex items-center">
      <div className="flex items-center ml-4">
        <div className="mr-3">
          <button
            type="button"
            className="bg-gray-800 flex text-[1.6rem] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <span className="sr-only">Open user menu</span>
            <Popover items={popoverItems} type="user" />
          </button>
        </div>
        <div className="hidden md:flex items-center text-gray-300 text-sm">
          {nickname}
        </div>
      </div>
    </div>
  );
}
