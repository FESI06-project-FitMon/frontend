import apiRequest from '@/utils/apiRequest';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

interface postSignupProps {
  email: string;
  nickName: string;
  password: string;
}

interface postSignupResponse {
  message: string;
}

interface SignupMutationProps {
  setConfirmAlert: React.Dispatch<
    React.SetStateAction<{ message: string; show: boolean }>
  >;
}

// 회원가입 요청 함수
async function postSignup(data: postSignupProps) {
  return await apiRequest<postSignupResponse, postSignupProps>({
    param: 'api/v1/signup',
    method: 'post',
    requestData: data,
  });
}

// 회원가입 요청 Mutation 함수
export const useSignupMutation = ({ setConfirmAlert }: SignupMutationProps) =>
  useMutation<postSignupResponse, AxiosError, postSignupProps>({
    mutationFn: postSignup,
    onSuccess: (data: postSignupResponse) => {
      if (data.message === '사용자 생성 성공') {
        setConfirmAlert({
          message: '회원가입이 완료되었습니다.',
          show: true,
        });
      }
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        setConfirmAlert({
          message: '이미 존재하는 이메일입니다.',
          show: true,
        });
      }
    },
  });
