import { useChallengeListQuery } from '@/pages/main/api/useChallengeListQuery';
import Loading from '@/components/dialog/Loading';
import Null from '@/components/common/Null';
import ChallengeCard from './ChallengeCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function ListChallenge() {
  const { data, isLoading } = useChallengeListQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return <Null message="챌린지 정보가 없습니다." />;
  }

  return (
    <Swiper
      spaceBetween={10}
      pagination={{ clickable: true }}
      breakpoints={{
        360: { slidesPerView: 1.4, spaceBetween: 10 },
        400: { slidesPerView: 1.6, spaceBetween: 10 },
        480: { slidesPerView: 2.2, spaceBetween: 10 },
        640: { slidesPerView: 2.6, spaceBetween: 10 },
        700: { slidesPerView: 2.8, spaceBetween: 10 },
        768: { slidesPerView: 2.2, spaceBetween: 10 },
        820: { slidesPerView: 2.4, spaceBetween: 10 },
        885: { slidesPerView: 2.6, spaceBetween: 10 },
        948: { slidesPerView: 2.8, spaceBetween: 10 },
        1100: { slidesPerView: 3.2, spaceBetween: 10 },
        1280: { slidesPerView: 3.6, spaceBetween: 10 },
      }}
    >
      {data.map((challenge) => (
        <SwiperSlide key={challenge.challengeId}>
          <ChallengeCard data={challenge} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
