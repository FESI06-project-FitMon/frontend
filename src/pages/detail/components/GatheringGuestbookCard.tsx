import Heart from '@/components/common/Heart';
import Image from 'next/image';

interface GuestbookProps {
  guestbook: {  // 중첩된 guestbook 객체를 제거
    guestbookId: number;
    content: string;
    rating: number;
    createdAt: string;
    writer: {
      memberId: number;
      nickName: string;
      profileImageUrl: string;
    };
  };
}


export default function Guestbook({ guestbook }: GuestbookProps) {  
  return (
    <div className="flex flex-col w-full  bg-dark-200 rounded-[10px] gap-5 p-[30px]">
      <Heart rating={guestbook.rating} />
      <p className="w-full h-min-[72px] text-ellipsis overflow-hidden break-words">
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
          <p>{guestbook.writer.nickName}</p>
        </div>
        {/* 날짜 */}
        <p className="text-sm text-dark-700 content-center">
          {guestbook.createdAt ? guestbook.createdAt.substring(0, 10) : ''}
        </p>
      </div>
    </div>
  );
}

