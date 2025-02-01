interface ScoreProps {
  rating: string;
  rating_count: number;
}

export default function Score({ rating, rating_count }: ScoreProps) {
  return (
    <div className="flex justify-center items-center">
      <p className="mr-3 whitespace-nowrap">{rating}</p>
      <div className="relative rounded-sm w-60 h-1 bg-dark-600">
        <div className="absolute inset-0 rounded-sm w-20 h-1 bg-primary"></div>
      </div>

      <p className="ml-3">{rating_count}</p>
    </div>
  );
}
