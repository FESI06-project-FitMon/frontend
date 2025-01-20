import SubTag from '@/components/tag/SubTag';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useGatheringStore from '@/stores/useGatheringStore';
import GatheringChallengeCard from './GatheringChallengeCard';

export default function GatheringChallenge({
  captainStatus,
  gatheringId,
}: {
  captainStatus: boolean;
  gatheringId: number;
}) {
  const challengeSubTagItems = [
    { id: 'inProgress', label: '진행중인 챌린지' },
    { id: 'done', label: '마감된 챌린지' },
  ];
  const [currentTag, setCurrentTag] = useState('inProgress');
  const [currentInquiryState, setCurrentInquiryState] = useState('list');

  const { fetchGatheringChallenges, challenges } = useGatheringStore();

  useEffect(() => {
    fetchGatheringChallenges(
      gatheringId,
      0,
      10,
      currentTag === 'inProgress' ? 'IN_PROGRESS' : 'CLOSED',
    );
  }, [gatheringId, currentTag]);

  return (
    <div>
      <div className="mt-[43px] ">
        <div className="flex items-center justify-between">
          <SubTag
            tags={challengeSubTagItems}
            currentTag={currentTag}
            onTagChange={(newTag) => setCurrentTag(newTag)}
          />

          <div className="flex">
            <div
              onClick={() => setCurrentInquiryState('list')}
              className="flex items-center justify-center mr-[17px]"
              style={{
                color: currentInquiryState === 'list' ? '#FF2140' : 'white',
              }}
            >
              <Image
                src={
                  currentInquiryState === 'list'
                    ? '/assets/image/list-ul-primary.svg'
                    : '/assets/image/list-ul.svg'
                }
                alt="list-ul"
                width={16}
                height={16}
                className="mr-[10px]"
              />

              <p className="text-sm">{'리스트 보기'}</p>
            </div>
            <div
              onClick={() => setCurrentInquiryState('calendar')}
              className="flex items-center justify-center"
              style={{
                color: currentInquiryState === 'calendar' ? '#FF2140' : 'white',
              }}
            >
              <Image
                src={
                  currentInquiryState === 'calendar'
                    ? '/assets/image/calendar-primary.svg'
                    : '/assets/image/calendar.svg'
                }
                alt="list-ul"
                width={14}
                height={14}
                className="mr-[10px]"
              />
              <p className="text-sm">{'달력 보기'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-[31px] mb-[27px] gap-6">
          {currentInquiryState === 'list' ? (
            challenges && challenges.length > 0 ? (
              challenges?.map((challenge, index) => (
                <GatheringChallengeCard
                  key={index}
                  challenge={{ ...challenge, captainStatus }}
                  inProgress={currentTag === 'inProgress'}
                />
              ))
            ) : (
              <div className="h-[250px] bg-dark-200 rounded-[10px] flex items-center justify-center">
                {currentTag === 'inProgress'
                  ? '진행중인 챌린지가 없습니다.'
                  : '마감된 챌린지가 없습니다.'}
              </div>
            )
          ) : (
            <div>calendar</div>
          )}
        </div>
      </div>
    </div>
  );
}
