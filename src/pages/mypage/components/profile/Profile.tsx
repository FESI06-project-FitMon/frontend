// components/profile/Profile.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import useMemberStore from '@/stores/useMemberStore';
import ProfileEditModal from './ProfileEditModal';

export default function Profile() {
  const { user, setUser } = useMemberStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleProfileUpdate = (
    newNickname: string,
    newImageUrl: string | null,
  ) => {
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
          <Image
            src={
              !user.profileImageUrl || user.profileImageUrl === 'null'
                ? '/assets/image/mypage_profile.svg'
                : user.profileImageUrl
            }
            alt="프로필 이미지"
            width={50}
            height={50}
            className="rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/assets/image/mypage_profile.svg';
            }}
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
            <button onClick={handleEditClick}>
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
