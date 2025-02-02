import { GuestBooksListItem } from '../api/getGuestBooks';

export interface NormalizedGuestbook {
  writer: string;
  reviewId: number;
  rating: number;
  content: string;
  createDate: string;
}

export interface NormalizedGathering {
  imageUrl: string;
  title: string;
  mainLocation: string;
  subLocation: string;
  startDate: string;
  endDate: string;
}

export default function normalizeGuestbook(guestbook: GuestBooksListItem) {
  const guestbookData = {
    writer: guestbook.nickName,
    reviewId: guestbook.guestbookId,
    rating: guestbook.guestbookScore,
    content: guestbook.guestBookContent,
    createDate: guestbook.guestbookCreatedDate,
  };

  const gatheringData = {
    imageUrl: guestbook.gatheringImageUrl,
    title: guestbook.gatheringTitle,
    mainLocation: guestbook.mainLocation,
    subLocation: guestbook.subLocation,
    startDate: guestbook.gatheringStartDate,
    endDate: guestbook.gatheringEndDate,
  };

  return { guestbookData, gatheringData };
}
