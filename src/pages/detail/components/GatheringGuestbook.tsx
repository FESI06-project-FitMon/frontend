import Heart from '@/components/common/Heart';
import Pagination from '@/components/common/Pagination';
import { GuestbookItem } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

export default function GatheringGuestbook({
  guestbooks,
  gatheringGuestbookCount,
}: {
  guestbooks: Array<GuestbookItem>;
  gatheringGuestbookCount: number;
}) {
  const [page, setPage] = useState(0);
  return (
    <div className="mt-[43px] mb-[130px] w-full">
      {/* 방명록 리스트 */}
      <div className=" flex flex-col gap-5 mb-[33px]">
        {guestbooks ? (
          guestbooks.map((guestbook, index) => (
            <Guestbook key={index} guestbook={guestbook} />
          ))
        ) : (
          <div>존재하지 않습니다</div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-[33px] bg-yellow flex items-center justify-center">
        <Pagination
          page={page}
          setPage={setPage}
          totalNumber={gatheringGuestbookCount}
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