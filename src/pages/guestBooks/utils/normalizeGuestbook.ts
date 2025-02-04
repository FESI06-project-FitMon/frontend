import { GuestBooksListItem } from '../api/getGuestBooks';

export interface NormalizedGuestbook {
  guestbookId: number; // reviewId에서 변경
  rating: number;
  content: string;
  createdAt: string; // createDate에서 변경
  writer: string;
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
    guestbookId: guestbook.guestbookId, // reviewId에서 변경
    rating: guestbook.guestbookScore,
    content: guestbook.guestBookContent,
    createdAt: guestbook.guestbookCreatedDate, // createDate에서 변경
    writer: guestbook.nickName
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
