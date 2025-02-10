import Pagination from '@/components/common/Pagination';
import { useState } from 'react';
import { useGatheringGuestbooks } from '../../service/gatheringService';
import { GatheringGuestbookResponse } from '../../dto/responseDto';
import Guestbook from '../guestbook/GatheringGuestbookCard';
import Null from '@/components/common/Null';
import { useDetailStore } from '@/stores/useDetailStore';
import { useRouter } from 'next/router';

export default function GatheringGuestbook({
  gatheringId,
}: {
  gatheringId: number;
}) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGatheringGuestbooks(gatheringId, page);
  const { gatheringGuestbookCount } = useDetailStore();
  if (isLoading) {
    <Null message="로딩중입니다." />;
  }

  const router = useRouter();
  const handleMoveGuestbookButton = () => {
    sessionStorage.setItem('mypage_current_tab', 'guestbook');
    router.push('/mypage');
  };

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
            <div onClick={handleMoveGuestbookButton}>
              방명록 작성하러 가기 ✏️
            </div>
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
