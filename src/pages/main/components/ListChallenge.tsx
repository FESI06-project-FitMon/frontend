import { MainChallenge } from '@/types/index';
import { useQuery } from '@tanstack/react-query';
import apiRequest from '@/utils/apiRequest';
import Loading from '@/components/dialog/Loading';
import ChallengeCard from './ChallengeCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Null from '@/components/common/Null';

export default function ListChallenge() {
  const { data, isLoading } = useQuery<MainChallenge[]>({
    queryKey: ['mainChallengeList'],
    queryFn: async () => {
      return await apiRequest<MainChallenge[]>({
        param: '/api/v1/challenges',
      });
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Swiper
      spaceBetween={10}
      pagination={{ clickable: true }}
      slidesPerView={3.6}
      slidesPerGroup={1}
      breakpoints={{
        320: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
        768: {
          slidesPerView: 3.2,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 3.6,
          slidesPerGroup: 1,
        },
      }}
    >
      {data?.length === 0 ? (
        <Null message="챌린지 정보가 없습니다." />
      ) : (
        data?.map((challenge) => (
          <SwiperSlide key={challenge.challengeId}>
            <ChallengeCard data={challenge} />
          </SwiperSlide>
        ))
      )}
    </Swiper>
  );
}
