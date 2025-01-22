import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/pages/mypage/api/profileService';
import useToastStore from '@/stores/useToastStore';

interface ProfileUpdateData {
  nickname: string;
  profileImageUrl: string | null;
}

export const profileUtils = {
  validateNickname: (nickname: string): boolean => {
    const trimmedNickname = nickname.trim();
    return trimmedNickname.length >= 2 && trimmedNickname.length <= 10;
  },

  useProfileUpdate: (onSuccess: (nickname: string, imageUrl: string | null) => void) => {
    const showToast = useToastStore((state) => state.show);

    return useMutation({
      mutationFn: ({ nickname, profileImageUrl }: ProfileUpdateData) =>
        profileService.updateProfile({
          nickName: nickname,
          profileImageUrl
        }),
      onSuccess: (_, variables) => {
        onSuccess(variables.nickname, variables.profileImageUrl);
        showToast('프로필 수정을 성공하였습니다.', 'check');
      },
      onError: () => {
        showToast('프로필 수정에 실패했습니다.', 'error');
      },
    });
  }
};