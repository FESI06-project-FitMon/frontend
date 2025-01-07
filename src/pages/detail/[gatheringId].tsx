import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  GatheringChallengeType,
  GatheringItem,
  GatheringStateType,
  GuestbookItem,
} from '@/types';
import GatheringInformation from './components/GatheringInformation';
import GatheringChallenge from './components/GatheringChallenge';
import GatheringGuestbook from './components/GatheringGuestbook';
import GatheringState from './components/GatheringState';

export default function GatheringDetail() {
  const router = useRouter();
  const gatheringId = router.query.gatheringId;
  const gathering: GatheringItem = {
    gatheringId: 0,
    gatheringTitle: '모임 제목',
    gatheringDescription:
      '디스크립션은50자까지 올수있습니답둘셋넷 디스크립션은50자까지 올수있습니답둘셋넷 ',
    captainStatus: true, // 이 사용자가 모임장인지 아닌지
    gatheringImage: 'www.www.ww.w.w.w.w',
    gatheringMainType: '유산소형',
    gatheringSubType: '런닝',
    gatheringTags: ['심심할 때', '스트레스', '런닝 최고'],
    gatheringStartDate: '2022-22-22',
    gatheringEndDate: '2022-23-23',
    gatheringSi: '대전',
    gatheringGu: '서구',
    gatheringStatus: '모집중',
    isReservationCancellable: false,
  };

  const gatheringState: GatheringStateType = {
    gatheringJoinedFivePeopleImages: [
      'www.www.ww.w.w.w.w',
      'www.www.ww.w.w.w.w',
    ],
    gatheringAverageRating: 4.5,
    gatheringGuestbookCount: 333,
    gatheringMaxPeopleCount: 10,
    gatheringMinPeopleCount: 3,
    gatheringJoinedPeopleCount: 5,
    gatheringStatus: '진행중',
  };

  const gatheringChallenge: GatheringChallengeType = {
    inProgressChallenges: [
      {
        // 진행중인 챌린지
        challengeId: 33,
        challengeImage: 'www.www.ww.w.w.w.w',
        challengeTitle: '',
        challengeDescription: '',
        challengeJoinedPeopleCount: 10,
        challengeSuccessPeopleCount: 5,
        challengeParticipationStatus: false, // 이 사용자가 참여중인지?
        challengeVerificationStatus: true, // 이 사용자가 인증을 완료했는지?
      },
      {
        challengeId: 33,
        challengeImage: 'www.www.ww.w.w.w.w',
        challengeTitle: '',
        challengeDescription: '',
        challengeJoinedPeopleCount: 10,
        challengeSuccessPeopleCount: 5,
        challengeParticipationStatus: false,
        challengeVerificationStatus: true,
      },
    ],
    doneChallenges: [
      {
        // 완료된 챌린지
        challengeId: 33,
        challengeImage: 'www.www.ww.w.w.w.w',
        challengeTitle: '',
        challengeDescription: '',
        challengeJoinedPeopleCount: 10,
        challengeSuccessPeopleCount: 5,
        challengeParticipationStatus: false, // 이 사용자가 참여했었인지?
        challengeVerificationStatus: true, // 이 사용자가 인증을 완료했었는지?
      },
      {
        challengeId: 33,
        challengeImage: 'www.ww.ww.w.w.w.w',
        challengeTitle: '',
        challengeDescription: '',
        challengeJoinedPeopleCount: 10,
        challengeSuccessPeopleCount: 5,
        challengeParticipationStatus: false,
        challengeVerificationStatus: true,
      },
    ],
  };

  const gatheringGuestbook: Array<GuestbookItem> = [
    {
      guestbookId: 1,
      gatheringId: 1,
      gatheringTitle: 'title1',
      content: 'good',
      rating: 4,
      createdAt: '2022-22-22',
    },
    {
      guestbookId: 2,
      gatheringId: 2,
      gatheringTitle: 'title2',
      content: 'hello',
      rating: 3,
      createdAt: '2022-22-22',
    },
  ];

  useEffect(() => {
    console.log(gatheringId);
  }, []);

  return (
    <div className="w-[1200px] flex flex-col place-self-center">
      <GatheringInformation information={gathering} />
      <GatheringState state={gatheringState} />
      <div id="challenge-and-guestbook"></div>
      <GatheringChallenge challenge={gatheringChallenge} />
      <GatheringGuestbook guestbook={gatheringGuestbook} />
    </div>
  );
}
