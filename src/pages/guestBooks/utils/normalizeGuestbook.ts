import { GuestBooksListItem } from '../api/getGuestBooks';

export interface NormalizedGuestbook {
  guestbookId: number;
  rating: number;
  content: string;
  createdAt: string;
  writer: string;
}

export interface NormalizedGathering {
  gatheringId: number;
  imageUrl: string;
  title: string;
  mainLocation: string;
  subLocation: string;
  startDate: string;
  endDate: string;
}

export default function normalizeGuestbook(guestbook: GuestBooksListItem) {
  const guestbookData = {
    guestbookId: guestbook.guestbookId,
    rating: guestbook.guestbookScore,
    content: guestbook.guestBookContent,
    createdAt: guestbook.guestbookCreatedDate,
    writer: guestbook.nickName,
  };

  const gatheringData = {
    gatheringId: guestbook.gatheringId,
    imageUrl: guestbook.gatheringImageUrl,
    title: guestbook.gatheringTitle,
    mainLocation: guestbook.mainLocation,
    subLocation: guestbook.subLocation,
    startDate: guestbook.gatheringStartDate,
    endDate: guestbook.gatheringEndDate,
  };

  return { guestbookData, gatheringData };
}
