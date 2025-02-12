import GatheringInformation from './components/gathering/GatheringInformation';
import { usePathname } from 'next/navigation';
import GatheringGuestbook from './components/guestbook/GatheringGuestbook';
import GatheringChallenge from './components/challenge/GatheringChallenge';
import { useDetailStore } from '@/stores/useDetailStore';
import { Metadata } from '@/components/common/Metadata';
export default function GatheringDetail() {
  const pathname = usePathname();
  const gatheringId = pathname
    ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
    : 1;
  const { currentTab } = useDetailStore();

  return (
    <>
      <Metadata
        title="모임 상세 페이지"
        description="모임의 상세 정보를 확인할 수 있습니다. "
      />
      <div className="w-full px-4 md:px-6 lg:px-0 lg:w-[1200px] flex flex-col place-self-center ">
        <GatheringInformation gatheringId={gatheringId} />
        {currentTab === 'challenge' ? (
          <GatheringChallenge gatheringId={gatheringId} />
        ) : (
          <GatheringGuestbook gatheringId={gatheringId} />
        )}
      </div>
    </>
  );
}
