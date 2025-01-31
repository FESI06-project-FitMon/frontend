import Null from '@/components/common/Null';
import Image from 'next/image';

/**
 * 로딩 상태를 처리하는 커스텀 훅
 * @param isLoading 로딩 여부
 * @param emptyMessage 데이터가 없을 때 표시할 메시지
 * @param data 데이터 배열 또는 객체
 */
export function useLoadingState<T>(isLoading: boolean, data: T | undefined, emptyMessage: string) {
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

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <Null message={emptyMessage} />;
  }

  return null;
}
