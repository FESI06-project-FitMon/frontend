import Heart from '@/components/common/Heart';
import Pagination from '@/components/common/Pagination';
import useGatheringStore from '@/stores/useGatheringStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GatheringGuestbook({
  gatheringGuestbookCount,
  gatheringId,
}: {
  gatheringGuestbookCount: number;
  gatheringId: number;
}) {
  const [page, setPage] = useState(0);
  const { guestbooks, fetchGatheringGuestbooks } = useGatheringStore();
  useEffect(() => {
    fetchGatheringGuestbooks(gatheringId, page, 10);
  }, [gatheringId]);
  return (
    <div className="mt-[43px] mb-[130px] w-full">
      {/* 방명록 리스트 */}
      <div className=" flex flex-col gap-5 mb-[33px]">
        {guestbooks && guestbooks.length > 0 ? (
          guestbooks.map((guestbook, index) => (
            <Guestbook key={index} guestbook={guestbook} />
          ))
        ) : (
          <div className="h-[250px] bg-dark-200 rounded-[10px] flex flex-col items-center justify-center">
            <h1>방명록이 존재하지 않습니다</h1>
            <Link href={`/guestbooks/${gatheringId}`}>
              방명록 작성하러 가기 ✏️
            </Link>
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

function Guestbook({ guestbook }: { guestbook: GuestbookProps }) {
  return (
    <div className="flex flex-col w-full h-[213px] bg-dark-200 rounded-[10px] gap-5 p-[30px]">
      <Heart rating={guestbook.rating} />
      <p className="h-[72px]">{guestbook.content}</p>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Image
            src="/assets/image/fitmon.png"
            width={32}
            height={32}
            alt="guestbook-profile"
            className="rounded-full"
          />
          <p>{guestbook.writer.nickName}</p>
        </div>
        {/* 날짜 */}
        <p className="text-sm text-dark-700 content-center">
          {`${guestbook.createDate.substring(0, 10)}`}
        </p>
      </div>
    </div>
  );
}

interface GuestbookProps {
  reviewId: number;
  rating: number;
  content: string;
  createDate: string;
  writer: {
    memberId: number;
    nickName: string;
    profileImageUrl: string;
  };
  reviewOwnerStatus: boolean;
}
