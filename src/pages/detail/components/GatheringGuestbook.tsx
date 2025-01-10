import Heart from '@/components/common/Heart';
import { GuestbookItem } from '@/types';
import Image from 'next/image';

export default function GatheringGuestbook({
  guestbooks,
}: {
  guestbooks: Array<GuestbookItem>;
}) {
  return (
    <div className="mt-[43px] flex flex-col gap-5">
      {guestbooks.map((guestbook, index) => (
        <Guestbook key={index} guestbook={guestbook} />
      ))}
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
