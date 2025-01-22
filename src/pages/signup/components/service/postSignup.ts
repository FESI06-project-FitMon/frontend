import axiosInstance from '@/utils/axios';

export interface postSignupProps {
  email: string;
  nickName: string;
  password: string;
}

export interface postSignupResponse {
  message: string;
}

export default async function postSignup(
  data: postSignupProps,
): Promise<postSignupResponse> {
  const response = await axiosInstance.post<postSignupResponse>(
    'api/v1/signup',
    data,
  );
  return response.data;
}
