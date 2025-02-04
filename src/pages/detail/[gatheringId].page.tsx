import { useState } from 'react';
import GatheringInformation from './components/GatheringInformation';
import GatheringChallenge from './components/GatheringChallenge';
import GatheringGuestbook from './components/GatheringGuestbook';
import GatheringState from './components/GatheringState';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import GatheringDetailTab from './components/GatheringDetailTab';
import { GatheringQueries } from './service/gatheringQueries';
export default function GatheringDetail() {
  const pathname = usePathname();
  const gatheringId = pathname
    ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
    : 1;
  const [currentTab, setCurrentTab] = useState('challenge');
  const { data, error, isLoading } = useQuery(
    GatheringQueries.getGatheringQuery(gatheringId),
  );

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <div>{'Loading...'}</div>;
  }

  if (!data) {
    return <div>{'데이터 없음...'}</div>;
  }
  return (
    <div className="w-full sm:px-4 md:px-6 lg:w-[1200px] flex flex-col place-self-center ">
      <GatheringInformation gathering={data} />
      <GatheringState
        participantStatus={data.participantStatus}
        gatheringId={gatheringId}
      />
      <GatheringDetailTab
        gatheringId={gatheringId}
        captainStatus={data.captainStatus}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {currentTab === 'challenge' ? (
        <GatheringChallenge
          gatheringId={gatheringId}
          captainStatus={data.captainStatus}
        />
      ) : (
        <GatheringGuestbook
          gatheringId={gatheringId}
          gatheringGuestbookCount={data.guestBookCount}
        />
      )}
    </div>
  );
}
