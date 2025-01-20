import apiRequest from '@/utils/apiRequest';
import { GuestbookItem, PageResponse } from '@/types';

interface GuestbookRequest {
  rating: number;
  content: string;
}

export const guestbookService = {
  // 내가 작성한 방명록 목록 조회
  getMyGuestbooks: async (page = 0, pageSize = 10) => {
    return await apiRequest<PageResponse<GuestbookItem>>({
      param: `api/v1/guestbooks/my?page=${page}&pageSize=${pageSize}`,
      method: 'get',
    });
  },

  // 방명록 작성
  createGuestbook: async (gatheringId: number, data: GuestbookRequest) => {
    console.log('Request Data:', {
      gatheringId,
      requestBody: data,
    });

    // 요청 데이터 validation
    if (!gatheringId) throw new Error('Gathering ID is required');
    if (data.rating < 1 || data.rating > 5)
      throw new Error('Rating must be between 1 and 5');
    if (!data.content?.trim()) throw new Error('Content is required');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiRequest<any>({
        param: `api/v1/gatherings/${gatheringId}/guestbooks`,
        method: 'post',
        requestData: {
          rating: data.rating,
          content: data.content.trim(),
        },
      });

      console.log('Create guestbook response:', response);
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Create guestbook error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      throw error;
    }
  },

  // 방명록 수정
  updateGuestbook: async (
    gatheringId: number,
    guestbookId: number,
    data: GuestbookRequest,
  ) => {
    if (!gatheringId || !guestbookId)
      throw new Error('Gathering ID and Guestbook ID are required');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `api/v1/gatherings/${gatheringId}/guestbooks/${guestbookId}`,
      method: 'put',
      requestData: {
        rating: data.rating,
        content: data.content.trim(),
      },
    });
  },

  // 방명록 삭제
  deleteGuestbook: async (gatheringId: number, guestbookId: number) => {
    if (!gatheringId || !guestbookId)
      throw new Error('Gathering ID and Guestbook ID are required');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await apiRequest<any>({
      param: `api/v1/gatherings/${gatheringId}/guestbooks/${guestbookId}`,
      method: 'delete',
    });
  },
};
