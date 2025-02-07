import BarChart from '@/components/chart/BarChart';

interface ScoreProps {
  rating: string;
  rating_count: number;
  totalCounts: number;
}

export default function Score({
  rating,
  rating_count,
  totalCounts,
}: ScoreProps) {
  return (
    <div className="flex justify-center items-center">
      <p className="mr-3 whitespace-nowrap">{rating}</p>
      <div className="w-60 h-1">
        <BarChart total={totalCounts} value={rating_count} height={'h-1'} />
      </div>

      <p className="ml-3">{rating_count}</p>
    </div>
  );
}
