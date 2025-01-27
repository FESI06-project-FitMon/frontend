import apiRequest from '@/utils/apiRequest';
import { useMutation } from '@tanstack/react-query';
import useMemberStore from '@/stores/useMemberStore';
import router from 'next/router';
async function postLogout(): Promise<void> {
  await apiRequest({ param: 'api/v1/logout', method: 'post' });
}
// 로그아웃 요청 Mutation 함수
export const useLogoutMutation = () =>
  useMutation<void, Error>({
    mutationFn: postLogout,
    onSuccess: () => {
      localStorage.removeItem('isLogin');
      useMemberStore.getState().setIsLogin(false);
      router.push('/');
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
