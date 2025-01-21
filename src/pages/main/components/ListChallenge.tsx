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
    breakpoints={{
      360: {
        slidesPerView: 1.4,
        spaceBetween: 10,
      },
      400: {
        slidesPerView: 1.6,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2.6,
        spaceBetween: 10,
      },
      700: {
        slidesPerView: 2.8,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 10,
      },
      820: {
        slidesPerView: 2.4,
        spaceBetween: 10,
      },
      885: {
        slidesPerView: 2.6,
        spaceBetween: 10,
      },
      948: {
        slidesPerView: 2.8,
        spaceBetween: 10,
      },
      1100: {
        slidesPerView: 3.2,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 3.6,
        spaceBetween: 10,
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

