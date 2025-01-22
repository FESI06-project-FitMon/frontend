import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { guestbookService } from '@/pages/mypage/api/guestbookService'; 

// GUESTBOOK_KEYS: Query Key를 관리하는 상수 객체
export const GUESTBOOK_KEYS = {
  // 모든 방명록 데이터의 기본 키
  all: ['guestbooks'] as const, 

  // 방명록 목록 조회 키 생성 함수
  lists: () => [...GUESTBOOK_KEYS.all, 'list'] as const, 

  // 특정 페이지와 페이지 크기에 따른 방명록 목록 키 생성 함수
  list: (page: number, pageSize: number) => [...GUESTBOOK_KEYS.lists(), { page, pageSize }] as const, 

  // 방명록 상세 데이터 키 생성 함수
  details: () => [...GUESTBOOK_KEYS.all, 'detail'] as const, 

  // 특정 모임 및 방명록 ID에 따른 상세 데이터 키 생성 함수
  detail: (gatheringId: number, guestbookId: number) => [...GUESTBOOK_KEYS.details(), gatheringId, guestbookId] as const, 
};

// 방명록 목록을 조회하는 커스텀 훅
export function useGuestbooks(page = 0, pageSize = 10) {
  return useQuery({
    // queryKey: 방명록 목록 조회에 필요한 Query Key
    queryKey: GUESTBOOK_KEYS.list(page, pageSize), 
    
    // queryFn: 방명록 데이터를 가져오는 API 호출 함수
    queryFn: () => guestbookService.getMyGuestbooks(page, pageSize), 
  });
}

// 방명록을 생성하는 커스텀 훅
export function useCreateGuestbook() {
  // React Query의 QueryClient 객체 생성
  const queryClient = useQueryClient(); 

  return useMutation({
    // mutationFn: 방명록 생성 API 호출
    mutationFn: ({ gatheringId, data }: { 
      gatheringId: number; // 모임 ID
      data: { rating: number; content: string; } // 방명록 데이터
    }) => guestbookService.createGuestbook(gatheringId, data),

    // onSuccess: 방명록 생성 후 캐시를 무효화하여 목록 데이터를 갱신
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTBOOK_KEYS.lists() }); 
    },
  });
}

// 방명록을 업데이트하는 커스텀 훅
export function useUpdateGuestbook() {
  // QueryClient 객체 생성
  const queryClient = useQueryClient(); 

  return useMutation({
    // mutationFn: 방명록 업데이트 API 호출
    mutationFn: ({ 
      gatheringId, // 모임 ID
      guestbookId, // 방명록 ID
      data // 업데이트할 방명록 데이터
    }: { 
      gatheringId: number; 
      guestbookId: number; 
      data: { rating: number; content: string; }; 
    }) => guestbookService.updateGuestbook(gatheringId, guestbookId, data),

    // onSuccess: 방명록 업데이트 후 관련 캐시를 무효화
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: GUESTBOOK_KEYS.detail(variables.gatheringId, variables.guestbookId) // 해당 방명록 상세 데이터 캐시 무효화
      });
      queryClient.invalidateQueries({ 
        queryKey: GUESTBOOK_KEYS.lists() // 방명록 목록 캐시 무효화
      });
    },
  });
}

// 방명록을 삭제하는 커스텀 훅
export function useDeleteGuestbook() {
  // QueryClient 객체 생성
  const queryClient = useQueryClient(); 

  return useMutation({
    // mutationFn: 방명록 삭제 API 호출
    mutationFn: ({ gatheringId, guestbookId }: { gatheringId: number; guestbookId: number }) => 
      guestbookService.deleteGuestbook(gatheringId, guestbookId),

    // onSuccess: 방명록 삭제 후 목록 캐시 무효화
    onSuccess: (_) => {
      queryClient.invalidateQueries({ 
        queryKey: GUESTBOOK_KEYS.lists() 
      });
    },
  });
}
