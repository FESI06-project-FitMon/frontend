import axiosInstance from '@/utils/axios';

export interface postLoginProps {
  email: string;
  password: string;
}

export interface postLoginResponse {
  memberId: number;
  nickName: string;
  email: string;
  profileImageUrl: string | null;
}

export default async function postLogin(
  data: postLoginProps,
): Promise<postLoginResponse> {
  const response = await axiosInstance.post<postLoginResponse>(
    'api/v1/login',
    data,
  );
  return response.data;
}
