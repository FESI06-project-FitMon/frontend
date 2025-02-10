import { useState } from 'react';
import GatheringInformation from './components/GatheringInformation';
import GatheringChallenge from './components/GatheringChallenge';
import GatheringGuestbook from './components/GatheringGuestbook';
import GatheringState from './components/GatheringState';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import GatheringDetailTab from './components/GatheringDetailTab';
import { GatheringQueries } from './service/gatheringQueries';
import { StateData } from '@/components/common/StateData';
export default function GatheringDetail() {
  const pathname = usePathname();
  const gatheringId = pathname
    ? parseInt(pathname.split('/')[pathname.split('/').length - 1])
    : 1;
  const [currentTab, setCurrentTab] = useState('challenge');
  const { data, error, isLoading } = useQuery(
    GatheringQueries.getGatheringQuery(gatheringId),
  );

  if (isLoading || !data || error) {
    return (
      <StateData isLoading={isLoading} emptyMessage={'모임이 없습니다.'} />
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-0 lg:w-[1200px] flex flex-col place-self-center ">
      <GatheringInformation gathering={data} isLoading={isLoading} />
      <GatheringState
        participantStatus={data.participantStatus}
        gatheringId={gatheringId}
      />
      <GatheringDetailTab
        gathering={data}
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
