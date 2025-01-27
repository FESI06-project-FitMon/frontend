import apiRequest from '@/utils/apiRequest';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface postLoginProps {
  email: string;
  password: string;
}

interface postLoginResponse {
  memberId: number;
  nickName: string;
  email: string;
  profileImageUrl: string | null;
}

interface LoginMutationProps {
  setConfirmAlert: React.Dispatch<
    React.SetStateAction<{ message: string; show: boolean }>
  >;
}

// 로그인 요청 함수
async function postLogin(data: postLoginProps): Promise<postLoginResponse> {
  return await apiRequest<postLoginResponse, postLoginProps>({
    param: 'api/v1/login',
    method: 'post',
    requestData: data,
  });
}

// 로그인 요청 Mutation 함수
export const useLoginMutation = ({ setConfirmAlert }: LoginMutationProps) =>
  useMutation<postLoginResponse, AxiosError, postLoginProps>({
    mutationFn: (loginData) => postLogin(loginData),
    onSuccess: (data: postLoginResponse) => {
      if (data.email) {
        setConfirmAlert({ message: '로그인에 성공했습니다.', show: true });
      }
    },
    onError: (error: AxiosError) => {
      console.log(error);
      if (error.response?.status === 401) {
        setConfirmAlert({
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
          show: true,
        });
      }
    },
  });
