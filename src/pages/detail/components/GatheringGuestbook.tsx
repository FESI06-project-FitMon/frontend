import Pagination from '@/components/common/Pagination';
import Link from 'next/link';
import { useState } from 'react';
import { useGatheringGuestbooks } from '../service/gatheringService';
import { GatheringGuestbookResponse } from '../dto/responseDto';
import Guestbook from './GatheringGuestbookCard';
import Null from '@/components/common/Null';

export default function GatheringGuestbook({
  gatheringGuestbookCount,
  gatheringId,
}: {
  gatheringGuestbookCount: number;
  gatheringId: number;
}) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGatheringGuestbooks(gatheringId, page);
  if (isLoading) {
    <Null message="로딩중입니다." />;
  }

  return (
    <div className="w-full mt-5 lg:mt-[43px] mb-10 md:mb-[87px] lg:mb-[130px] ">
      {/* 방명록 리스트 */}
      <div className=" flex flex-col gap-5 mb-[33px] w-full">
        {data && data.content.length > 0 ? (
          (data as GatheringGuestbookResponse).content.map(
            (guestbook, index) => (
              <Guestbook
                key={index}
                guestbook={{ ...guestbook, createdAt: guestbook.createDate }}
              />
            ),
          )
        ) : (
          <div className="h-[250px] bg-dark-200 rounded-[10px] flex flex-col items-center justify-center">
            <h1>방명록이 존재하지 않습니다</h1>
            <Link href={`/mypage`}>방명록 작성하러 가기 ✏️</Link>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-[33px] bg-yellow flex items-center justify-center">
        <Pagination
          page={page}
          setPage={setPage}
          totalNumber={gatheringGuestbookCount}
          countPerPage={4}
        />
      </div>
    </div>
  );
}
