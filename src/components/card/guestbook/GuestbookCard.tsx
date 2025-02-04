// components/common/GuestbookCard.tsx
import Heart from '@/components/common/Heart';
import Popover from '@/components/common/Popover';
import {
  NormalizedGathering,
  NormalizedGuestbook,
} from '@/pages/guestBooks/utils/normalizeGuestbook';
import { GatheringListItem, GuestbookItem } from '@/types';
import getDatePart from '@/utils/getDatePart';
import Image from 'next/image';

interface GuestbookCardProps {
  guestbook: GuestbookItem | NormalizedGuestbook;
  gathering?: GatheringListItem | NormalizedGathering | null; // gathering이 없을 수도 있음
  showActions?: boolean; // showActions는 기본값이 false
  onEdit?: (guestbook: GuestbookItem) => void;
  onDelete?: (guestbook: GuestbookItem) => void;
}

export default function GuestbookCard({
  guestbook,
  gathering,
  showActions = false,
  onEdit,
  onDelete,
}: GuestbookCardProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[30px] bg-dark-900 rounded-lg">
      {/* 이미지 영역 */}
      <div className="relative min-w-[343px] md:min-w-[696px] lg:min-w-[300px] h-[200px] rounded-[20px] overflow-hidden">
        <Image
          src={
            !gathering?.imageUrl || gathering.imageUrl === 'null'
              ? 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
              : gathering.imageUrl
          }
          alt={gathering?.title || '모임 이미지'}
          layout="fill"
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png';
          }}
        />
      </div>

      <div className="flex-1 min-w-[343px] md:min-w-[696px] lg:w-[300px] h-[200px] px-2 lg:px-0 lg:py-6 lg:pr-6">
 <div className="flex justify-between items-start mb-4">
          <Heart rating={guestbook.rating} />
          {showActions &&
            onEdit &&
            onDelete &&
            'reviewOwnerStatus' in guestbook && (
              <Popover
                type="dot"
                items={[
                  {
                    id: 'edit',
                    label: '수정하기',
                    onClick: () => onEdit(guestbook),
                  },
                  {
                    id: 'delete',
                    label: '삭제하기',
      onClick: () => onDelete(guestbook),
                  },
                ]}
              />
            )}
        </div>

          <p className="mb-2 lg:mb-4 break-all line-clamp-4">
            {guestbook.content}
          </p>

    {gathering && (
          <div className="flex flex-col lg:flex-row mb-[10px] lg:mb-0 items-start lg:items-end justify-between">
            <p className="text-primary font-normal">
              {gathering.title} | {gathering.mainLocation}{' '}
              {gathering.subLocation}
            </p>
            <p className="text-dark-700 font-medium">
              {getDatePart(guestbook.createDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}