import { MainType } from '@/constants/MainList';
import Score from './Score';
import useGuestbookRating from '../api/getRating';
import Heart from '@/components/common/Heart';

interface ReviewScoreProps {
  mainType: MainType;
  subType: string;
}

export default function ReviewScore({ mainType, subType }: ReviewScoreProps) {
  const { isLoading, isError, data } = useGuestbookRating({
    mainType,
    subType,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center rounded-[20px] w-full h-[308px] md:h-[180px] bg-dark-200 px-4 py-[50px] md:py-8 md:px-0 md:gap-24 lg:gap-40">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center">
          <p className="text-2xl font-semibold text-white">
            {data?.averageRating.toFixed(1) || 0}
          </p>
          <p className="text-2xl font-semibold text-dark-600">{'/5'}</p>
        </div>
        <Heart rating={data?.averageRating || 0} />
      </div>
      <div className="flex flex-col justify-center items-center mt-8 md:mt-0 gap-1">
        {Object.entries(data?.ratingCounts || {}).map(([rating, count]) => (
          <Score
            key={rating}
            rating={rating}
            rating_count={count}
            totalCounts={data?.totalCounts || 0}
          />
        ))}
      </div>
    </div>
  );
}
