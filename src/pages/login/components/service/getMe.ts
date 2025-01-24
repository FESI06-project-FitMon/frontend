import axiosInstance from '@/utils/axios';

export interface getMeResponse {
  memberId: number;
  nickName: string;
  email: string;
  profileImageUrl: string | null;
}

export default async function getMe(): Promise<getMeResponse> {
  const response = await axiosInstance.get<getMeResponse>('/api/v1/members/me');
  return response.data;
}
