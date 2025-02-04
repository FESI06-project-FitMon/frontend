import Image from 'next/image';
import Null from './Null';

interface StateDataProps {
  isLoading: boolean;
  emptyMessage: string;
}

export function StateData({ isLoading, emptyMessage }: StateDataProps) {
  if (isLoading) {
    return (
      <Null
        message="로딩 중..."
        svg={
          <Image
            src="/assets/image/spinner.svg"
            alt="로딩 스피너"
            width={50}
            height={50}
          />
        }
      />
    );
  }

  return <Null message={emptyMessage} />;
}
