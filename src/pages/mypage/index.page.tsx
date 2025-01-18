import { useRouter } from 'next/router';
import Tab from '@/components/common/Tab';
import Profile from './components/profile/Profile';
import JoinGathering from './components/join-gathering/JoinGathering';
import MyGathering from './components/my-gathering/MyGathering';
import Guestbook from './components/guestbook/Guestbook';
import Calendar from './components/calendar/Calendar';
import { useEffect, useState } from 'react';
import type { TabItem } from '@/types';
import useMemberStore from '@/stores/useMemberStore';
import useTabState from '@/hooks/useTabState';

const MY_PAGE_TABS: TabItem[] = [
  { id: 'gathering', label: '나의 모임' },
  { id: 'guestbook', label: '나의 방명록' },
  { id: 'myGathering', label: '내가 만든 모임' },
  { id: 'calendar', label: '캘린더' },
];

const CURRENT_TAB_KEY = 'mypage_current_tab';


export default function MyPage() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const { setIsLogin } = useMemberStore();
  const { currentTab, handleTabChange } = useTabState({
    tabs: MY_PAGE_TABS,
    storageKey: CURRENT_TAB_KEY
  });

  // 초기 로그인 체크 로그인 x -> 쿼리스트링으로 뒤로가기 불가능하게 
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    setIsLogin(isLoggedIn);

    if (!isLoggedIn) {
      const returnUrl = encodeURIComponent(window.location.href);
      router.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }

    setIsInitialized(true);
  }, [router, setIsLogin]);

  //아직 구현중 
  const handleGatheringClick = (gatheringId: number) => {
    console.log('모임 클릭:', gatheringId);
  };

  const handleCancelGathering = async (gatheringId: number) => {
    console.log('모임 취소:', gatheringId);
  };

  const handleCancelParticipation = async (gatheringId: number) => {
    console.log('참여 취소:', gatheringId);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 xl:px-0 pt-[30px] sm:pt-[50px] lg:pt-20" style={{ maxWidth: '1200px' }}>
      <Profile />

      <div className="mt-14">
        <Tab
          items={MY_PAGE_TABS}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />

        <div className="mt-[37px]">
          {currentTab === 'gathering' && (
            <JoinGathering
              onGatheringClick={handleGatheringClick}
              onCancelParticipation={handleCancelParticipation}
            />
          )}
          {currentTab === 'guestbook' && (
            <Guestbook />
          )}
          {currentTab === 'myGathering' && (
            <MyGathering
              onGatheringClick={handleGatheringClick}
              onCancelGathering={handleCancelGathering}
            />
          )}
          {currentTab === 'calendar' && (
            <Calendar />
          )}
        </div>
      </div>
    </div>
  );
}