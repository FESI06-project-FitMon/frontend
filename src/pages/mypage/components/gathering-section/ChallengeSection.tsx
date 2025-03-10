import Image from 'next/image';
import Link from 'next/link';
import { ChallengeType, GatheringChallengeType, GatheringListItem } from '@/types';
import Null from '@/components/common/Null';
import getDatePart from '@/utils/getDatePart';
import { useCallback, useMemo } from 'react';

interface ChallengeSectionProps {
  challenges: GatheringChallengeType;
  gathering: GatheringListItem;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

interface ChallengeWithStatus extends ChallengeType {
  isClosed?: boolean;
}

export default function ChallengeSection({
  challenges,
  gathering,
  isOpen,
  onToggle,
}: ChallengeSectionProps) {

  // 단순 이벤트 핸들러는 useCallback 불필요
  const handleChallengeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };


  // 복잡한 조건부 로직이므로 useCallback 사용
  const getStatusInfo = useCallback((challenge: ChallengeWithStatus) => {
    if (!gathering) return { text: '미참여', style: 'bg-dark-500' };

    if (challenge.verificationStatus && challenge.participantStatus) {
      return { text: '참여완료', style: 'bg-dark-500' };
    }
    if (challenge.participantStatus) {
      return { text: '참여중', style: 'bg-primary' };
    }
    if (gathering.captainStatus) {
      return { text: '미참여', style: 'bg-dark-500' };
    }
    return { text: '참여중', style: 'bg-primary' };
  }, [gathering?.captainStatus]); // gathering이 undefined일 수 있으므로 안전한 접근 사용

  // 배열 생성 작업을 메모이제이션
  const displayChallenges = useMemo(() => [
    ...(challenges?.inProgressChallenges || []).map(c => ({ ...c, isClosed: false })),
    ...(challenges?.doneChallenges || []).map(c => ({ ...c, isClosed: true }))
  ], [challenges?.inProgressChallenges, challenges?.doneChallenges]);

  if (!gathering) {
    console.error('No gathering provided to ChallengeSection');
    return null;
  }

  return (
    <>
      <div
        className={`mt-[15px] md:mt-[30px] bg-dark-200 p-3 md:py-5 md:px-6 cursor-pointer ${isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'
          }`}
        onClick={onToggle}
      >
        <span className="flex items-center gap-2 text-sm md:text-base font-semibold">
          <div
            className={`w-3 h-4 md:w-4 md:h-5 transition-transform ${isOpen ? 'rotate-90' : ''
              }`}
          >
            <Image
              src="/assets/image/toggle.svg"
              alt="Toggle"
              layout="responsive"
              width={16}
              height={20}
            />
          </div>
          {gathering.captainStatus ? '이 모임의 모든 챌린지' : '이 모임에서 참여했던 챌린지'}
        </span>
      </div>

      {isOpen && (
        <div className="grid gap-2 md:gap-2.5 px-4 md:px-5 lg:px-8 py-2.5 md:py-[30px] max-h-[443px] overflow-y-auto bg-dark-200 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayChallenges.length > 0 ? (
            displayChallenges.map((challenge) => {
              const status = getStatusInfo(challenge);
              return (
                <Link
                  key={challenge.challengeId}
                  href={`/detail/${gathering.gatheringId}`}
                  onClick={handleChallengeClick}
                >
                  <div className="bg-dark-300 h-[168px] px-7 py-[25px] rounded-lg cursor-pointer relative overflow-visible">
                    {challenge.isClosed && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-dark-500 w-8 h-8 md:w-10 md:h-10 lg:w-[45px] lg:h-[45px] rounded-full flex items-center justify-center shadow-md z-10">
                        <span className="text-xs md:text-sm lg:text-base">마감</span>
                      </div>
                    )}
                    <div className="flex items-start gap-[17px]">
                      <div className="relative w-[61px] h-[61px] rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            challenge.imageUrl === 'null' || !challenge.imageUrl
                              ? 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
                              : challenge.imageUrl
                          }
                          alt={challenge.title}
                          fill
                          sizes="61px"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/assets/image/default_challenge.png';
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-[13px] mb-2.5">
                          <span className={`text-sm font-semibold w-[84px] text-center px-3 py-[7px] rounded-full ${status.style}`}>
                            {status.text}
                          </span>
                          <div className="flex items-center font-normal gap-2">
                            <Image
                              src="/assets/image/person.svg"
                              alt="참여자 아이콘"
                              width={20}
                              height={20}
                            />
                            <span>
                              {challenge.successParticipantCount}/
                              {challenge.participantCount}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="w-full min-w-0 h-[60px] mb-[5px]">
                            <h4 className="font-semibold break-words">
                              {challenge.title}
                            </h4>
                          </div>
                          <h5 className="text-dark-700 text-sm font-normal">
                            {getDatePart(challenge.startDate)} ~ {getDatePart(challenge.endDate)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center">
              <Null message="참여중인 챌린지가 없습니다." />
            </div>
          )}
        </div>
      )}
    </>
  );
}
