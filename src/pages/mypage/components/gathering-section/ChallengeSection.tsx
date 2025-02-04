import Image from 'next/image';
import { ChallengeType, GatheringChallengeType, GatheringListItem } from '@/types';
import Null from '@/components/common/Null';
import getDatePart from '@/utils/getDatePart';
import { useRouter } from 'next/router';

interface ChallengeSectionProps {
  challenges: GatheringChallengeType;
  gathering: GatheringListItem;
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export default function ChallengeSection({
  challenges,
  gathering,
  isOpen,
  onToggle,
}: ChallengeSectionProps) {
  const router = useRouter();

  const handleChallengeClick = (challengeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/detail/${gathering.gatheringId}`);
  };

  if (!gathering) {
    console.error('No gathering provided to ChallengeSection');
    return null;
  }

  const getStatusInfo = (challenge: ChallengeType, isClosed: boolean = false) => {
    if (isClosed) {
      return { text: '마감됨', style: 'bg-dark-500' };
    }
    
    if (gathering.captainStatus) {
      if (challenge.verificationStatus && challenge.participantStatus) {
        return { text: '참여완료', style: 'bg-dark-500' };
      } else if (challenge.participantStatus) {
        return { text: '참여중', style: 'bg-primary' };
      }
      return { text: '미참여', style: 'bg-dark-500' };
    } else {
      if (challenge.verificationStatus && challenge.participantStatus) {
        return { text: '참여완료', style: 'bg-dark-500' };
      }
      return { text: '참여중', style: 'bg-primary' };
    }
  };

// 진행중인 챌린지와 마감된 챌린지 모두 표시
const displayChallenges = [
  ...(challenges?.inProgressChallenges || []),
  ...(challenges?.doneChallenges || [])
];

  return (
    <>
      <div
        className={`mt-[15px] md:mt-[30px] bg-dark-200 p-3 md:py-5 md:px-6 cursor-pointer ${
          isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'
        }`}
        onClick={onToggle}
      >
        <span className="flex items-center gap-2 text-sm md:text-base font-semibold">
          <div
            className={`w-3 h-4 md:w-4 md:h-5 transition-transform ${
              isOpen ? 'rotate-90' : ''
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
          이 모임에서 참여했던 챌린지
        </span>
      </div>

      {isOpen && (
        <div className="grid gap-2 md:gap-2.5 px-4 md:px-5 lg:px-8 py-2.5 md:py-[30px] max-h-[443px] overflow-y-auto bg-dark-200 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayChallenges.length > 0 ? (
            displayChallenges.map((challenge) => {
              const status = getStatusInfo(challenge);
              return (
                <div
                  key={challenge.challengeId}
                  className="bg-dark-300 h-[168px] px-7 py-[25px] rounded-lg cursor-pointer"
                  onClick={(e) => handleChallengeClick(challenge.challengeId, e)}
                >
                  <div className="flex items-start gap-[17px]">
                    <div className="relative w-[61px] h-[61px] rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          challenge.imageUrl === 'null' || !challenge.imageUrl
                            ? 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
                            : challenge.imageUrl
                        }
                        alt={challenge.title}
                        width={61}
                        height={61}
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
                        <span
                          className={`text-sm font-semibold w-[84px] text-center px-3 py-[7px] rounded-full ${status.style}`}
                        >
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
                          {getDatePart(gathering.startDate)} ~ {getDatePart(gathering.endDate)}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
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