import Heart from '@/components/common/Heart';
import Image from 'next/image';

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

export default function Guestbook({
  guestbook,
}: {
  guestbook: GuestbookProps;
}) {
  return (
    <div className="flex flex-col w-full  bg-dark-200 rounded-[10px] gap-5 p-[30px]">
      <div className="flex justify-between">
        <Heart rating={guestbook.rating} />
        <p className="flex md:hidden text-[13px] md:text-sm text-dark-700 content-center">
          {`${guestbook.createDate.substring(0, 10)}`}
        </p>
      </div>
      <p className="w-full h-min-[72px] text-sm md:text-base text-ellipsis overflow-hidden break-words">
        {guestbook.content}
      </p>
      <div className="flex justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Image
            src="/assets/image/fitmon.png"
            width={32}
            height={32}
            alt="guestbook-profile"
            className="rounded-full"
          />
          <p className="text-[13px] md:text-sm">{guestbook.writer.nickName}</p>
        </div>
        {/* 날짜 */}
        <p className="hidden md:flex text-[13px] md:text-sm text-dark-700 content-center">
          {`${guestbook.createDate.substring(0, 10)}`}
        </p>
      </div>
    </div>
  );
}
