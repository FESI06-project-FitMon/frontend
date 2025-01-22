// api/memberService.ts
import apiRequest from '@/utils/apiRequest';
import { UserProfile } from '@/types';

interface ProfileUpdate {
  nickName: string;
  profileImageUrl: string | null;
}

export const profileService = {

  updateProfile: async (data: ProfileUpdate) => {
    return await apiRequest<ProfileUpdate>({
      param: 'api/v1/my-page/profile',
      method: 'patch',
      requestData: data
    });
  }
};
