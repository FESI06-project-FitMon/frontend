import { useState } from 'react';
import Image from 'next/image';
import useMemberStore from '@/stores/useMemberStore';
import ProfileEditModal from './ProfileEditModal';
import { ProfileImage } from './ProfileImage';

export default function Profile() {
  const { user, setUser } = useMemberStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileUpdate = (newNickname: string, newImageUrl: string | null) => {
    setUser({
      ...user,
      nickName: newNickname,
      profileImageUrl: newImageUrl,
    });
  };

  return (
    <>
      <div className="flex items-start gap-[20px]">
        <div className="flex-shrink-0">
          <ProfileImage
            imageUrl={user.profileImageUrl}
            className="rounded-full"
          />
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">{user.nickName || '닉네임 없음'}</h1>
              <p className="text-dark-600 font-light">
                {user.email || '이메일 없음'}
              </p>
            </div>
            <button onClick={() => setIsModalOpen(true)}>
              <Image
                src="/assets/image/profile_edit.svg"
                alt="프로필 수정"
                width={50}
                height={50}
              />
            </button>
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialNickname={user.nickName || ''}
        initialImage={user.profileImageUrl}
        onUpdate={handleProfileUpdate}
      />
    </>
  );
}