// api/memberService.ts
import instance from '@/utils/axios';
import apiRequest from '@/utils/apiRequest';
import { UserProfile } from '@/types';

interface ProfileUpdate {
  nickName: string;
  profileImageUrl: string | null;
}
interface ImageUpload {
  imageUrl: string;
}

export const profileService = {
  // 프로필 정보 조회
  getProfile: async () => {
    return await apiRequest<UserProfile>({
      param: 'api/v1/my-page/profile',
      method: 'get'
    });
  },
  uploadImage: async (file: File): Promise<ImageUpload> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // FormData는 특별한 처리가 필요하므로 직접 instance 사용
    const response = await instance.request<ImageUpload>({
      url: 'api/v1/images?type=MEMBER',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  updateProfile: async (data: ProfileUpdate) => {
    return await apiRequest<ProfileUpdate>({
      param: 'api/v1/my-page/profile',
      method: 'patch',
      requestData: data
    });
  }
};
