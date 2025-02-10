import { useLogoutMutation } from '@/pages/login/api/postLogout';
import Popover from '../common/Popover';
import router from 'next/router';
import { ProfileImage } from '@/pages/mypage/components/profile/ProfileImage';
import useMemberStore from '@/stores/useMemberStore';

export default function UserProfile({ nickname }: { nickname: string }) {
  const { mutate: logoutMutation } = useLogoutMutation();
  const { user } = useMemberStore();

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
      onClick: () => logoutMutation(),
    },
  ];

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3">
        <Popover items={popoverItems} type="user">
          <button
            type="button"
            className="mt-2 w-[40px] h-[40px] rounded-full overflow-hidden focus:outline-none"
          >
            <ProfileImage imageUrl={user.profileImageUrl} size={40} />
          </button>
        </Popover>
        <div className="hidden md:flex items-center text-gray-300 text-sm">
          {nickname}
        </div>
      </div>
    </div>
  );
}
