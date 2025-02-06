import Heart from '@/components/common/Heart';
import Image from 'next/image';

interface GuestbookProps {
  guestbook: {
    // 중첩된 guestbook 객체를 제거
    guestbookId: number;
    content: string;
    rating: number;
    createDate: string;
    writer: {
      memberId: number;
      nickName: string;
      profileImageUrl: string;
    };
  };
}

export default function Guestbook({ guestbook }: GuestbookProps) {
  console.log(guestbook);
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
            src="https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png"
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
