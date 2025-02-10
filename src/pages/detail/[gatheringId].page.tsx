import GatheringInformation from './components/gathering/GatheringInformation';
import { usePathname } from 'next/navigation';
import GatheringGuestbook from './components/guestbook/GatheringGuestbook';
import GatheringChallenge from './components/challenge/GatheringChallenge';
import { useDetailStore } from '@/stores/useDetailStore';
export default function GatheringDetail() {
  const pathname = usePathname();
  const gatheringId = pathname
    ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
    : 1;
  const { currentTab } = useDetailStore();

  return (
    <div className="w-full px-4 md:px-6 lg:px-0 lg:w-[1200px] flex flex-col place-self-center ">
      <GatheringInformation gatheringId={gatheringId} />
      {currentTab === 'challenge' ? (
        <GatheringChallenge gatheringId={gatheringId} />
      ) : (
        <GatheringGuestbook gatheringId={gatheringId} />
      )}
    </div>
  );
}
