import SubTag from '@/components/tag/SubTag';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GatheringChallengeCard from './GatheringChallengeCard';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import Null from '@/components/common/Null';
import { useGatheringChallenges } from '../service/gatheringService';
import { GatheringChallengeResponse } from '../dto/responseDto';

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

  const { data, isLoading, hasNextPage, fetchPreviousPage, fetchNextPage } =
    useGatheringChallenges(
      gatheringId,
      currentTag === 'inProgress' ? 'IN_PROGRESS' : 'CLOSED',
    );

  useEffect(() => {
    fetchPreviousPage();
  }, [currentTag]);

  const observerRef = useInfiniteScroll({
    onIntersect: fetchNextPage,
    isLoading: isLoading,
    hasNextPage: !!hasNextPage,
  });

  const handleTagChange = (newTag: string) => {
    setCurrentTag(newTag);
  };

  return (
    <div>
      <div className="mt-5 lg:mt-[43px] ">
        <div className="flex items-center justify-between">
          <SubTag
            tags={challengeSubTagItems}
            currentTag={currentTag}
            onTagChange={(newTag) => handleTagChange(newTag)}
          />

          <div className="md:hidden flex">
            <div
              onClick={() =>
                setCurrentInquiryState(
                  currentInquiryState === 'list' ? 'calendar' : 'list',
                )
              }
              className="flex items-center justify-center mr-[17px] hover:cursor-pointer"
            >
              <Image
                src={'/assets/image/arrow-updown.svg'}
                alt="list-ul"
                width={14}
                height={14}
                className="mr-[7px]"
              />

              <p className="text-sm">
                {currentInquiryState === 'list' ? '달력 보기' : '리스트 보기'}
              </p>
            </div>
          </div>
          <div className="hidden md:flex">
            <div
              onClick={() => setCurrentInquiryState('list')}
              className="flex items-center justify-center mr-[17px] hover:cursor-pointer"
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
              className="flex items-center justify-center hover:cursor-pointer"
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
            isLoading ? (
              <Null message="로딩중입니다"></Null>
            ) : data &&
              data.pages.length === 1 &&
              (data.pages[0] as GatheringChallengeResponse).content.length ===
                0 ? (
              <div className="h-[250px] bg-dark-200 rounded-[10px] flex items-center justify-center">
                {currentTag === 'inProgress'
                  ? '진행중인 챌린지가 없습니다.'
                  : '마감된 챌린지가 없습니다.'}
              </div>
            ) : (
              data &&
              data.pages.map((page) =>
                (page as GatheringChallengeResponse).content?.map(
                  (challenge, index) => (
                    <GatheringChallengeCard
                      key={index}
                      gatheringId={gatheringId}
                      challenge={{ ...challenge, captainStatus }}
                      inProgress={currentTag === 'inProgress'}
                    />
                  ),
                ),
              )
            )
          ) : (
            <div>calendar</div>
          )}
        </div>
      </div>

      {hasNextPage && <div ref={observerRef} style={{ height: '1px' }} />}
    </div>
  );
}
