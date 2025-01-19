import { create } from 'zustand';
import { GuestbookItem } from '@/types/index';
import { guestbookService } from '@/pages/mypage/api/guestbookService';

interface GuestbookState {
  // 상태
  guestbooks: GuestbookItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchGuestbooks: (page?: number, pageSize?: number) => Promise<void>;
  createGuestbook: (gatheringId: number, data: { rating: number; content: string }) => Promise<void>;
  updateGuestbook: (gatheringId: number, guestbookId: number, data: { rating: number; content: string }) => Promise<void>;
  deleteGuestbook: (gatheringId: number, guestbookId: number) => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useGuestbookStore = create<GuestbookState>((set, get) => ({
  // 초기 상태
  guestbooks: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  isLoading: false,
  error: null,

  // 액션들
  fetchGuestbooks: async (page = 0, pageSize = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await guestbookService.getMyGuestbooks(page, pageSize);
      set({
        guestbooks: response.content,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: '방명록을 불러오는데 실패했습니다.', 
        isLoading: false 
      });
      throw error;
    }
  },

  createGuestbook: async (gatheringId, data) => {
    set({ isLoading: true, error: null });
    try {
      await guestbookService.createGuestbook(gatheringId, data);
      // 목록 새로고침
      await get().fetchGuestbooks();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: '방명록 작성에 실패했습니다.', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateGuestbook: async (gatheringId, guestbookId, data) => {
    set({ isLoading: true, error: null });
    try {
      await guestbookService.updateGuestbook(gatheringId, guestbookId, data);
      // 로컬 상태 업데이트
      set((state) => ({
        guestbooks: state.guestbooks.map((guestbook) =>
          guestbook.reviewId === guestbookId
            ? { ...guestbook, ...data }
            : guestbook
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: '방명록 수정에 실패했습니다.', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteGuestbook: async (gatheringId, guestbookId) => {
    set({ isLoading: true, error: null });
    try {
      await guestbookService.deleteGuestbook(gatheringId, guestbookId);
      // 로컬 상태에서 삭제
      set((state) => ({
        guestbooks: state.guestbooks.filter(
          (guestbook) => guestbook.reviewId !== guestbookId
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: '방명록 삭제에 실패했습니다.', 
        isLoading: false 
      });
      throw error;
    }
  },

  // 상태 초기화
  reset: () => {
    set({
      guestbooks: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      isLoading: false,
      error: null
    });
  },

  // 에러 설정
  setError: (error: string | null) => {
    set({ error });
  }
}));

export default useGuestbookStore;