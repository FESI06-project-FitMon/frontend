import Button from '@/components/common/Button';
import useToastStore from '@/stores/useToastStore';
import uploadImage from '@/utils/uploadImage';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { verificationChallenge } from '../api/challengeApi';

export default function ChallengeCertificationModal({
  challengeId,
  setOpenModal,
  setIsVerificated,
}: {
  challengeId: number;
  setOpenModal: (openModal: boolean) => void;
  setIsVerificated: (isVerified: boolean) => void;
}) {
  const [challengeGatheringImagUrl, setChallengeGatheringImageUrl] =
    useState('');

  const showToast = useToastStore((state) => state.show);
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file) {
      const imageUrl = (await uploadImage(file, 'CHALLENGE')).imageUrl;
      setChallengeGatheringImageUrl(imageUrl);
    }
  };

  const handleImageEditButtonClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleImageDeleteButtonClick = () => {
    setChallengeGatheringImageUrl('');
  };

  const handleCertificationButtonClick = async () => {
    try {
      await verificationChallenge(challengeId, challengeGatheringImagUrl);
      setOpenModal(false);
      showToast('챌린지 인증에 성공했습니다.', 'check');
      setIsVerificated(true);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
  };

  return (
    <div className="w-full h-full">
      {/* 이미지 첨부 */}
      <div className="flex flex-col justify-center items-center ">
        <div className="relative border-[1px] rounded-[10px] border-dark-500 w-[175px] h-[175px] mt-[30px] flex">
          <Image
            className=" border-[1px] rounded-[10px] border-dark-500 "
            src={
              challengeGatheringImagUrl &&
              ['https', 'http', 'blob'].indexOf(
                challengeGatheringImagUrl.split(':')[0],
              ) !== -1
                ? challengeGatheringImagUrl
                : '/assets/image/fitmon.png'
            }
            width={175}
            height={175}
            alt="edit-image"
          />

          <div
            style={{
              background: challengeGatheringImagUrl
                ? 'rgba(0, 0, 0, 0.8)'
                : '#2d2d2d',
            }}
            className="absolute  w-full h-full z-10  border-[1px] rounded-[10px] border-dark-500 "
          />

          <div className="absolute w-[175px] h-[175px] z-20 flex flex-col justify-center items-center gap-2 hover:cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              id="file-input"
              onChange={(e) => handleImageChange(e)}
            />
            <Image
              src={'/assets/image/gathering_edit.svg'}
              width={45}
              height={45}
              alt="pencil"
              onClick={handleImageEditButtonClick}
            />
            {challengeGatheringImagUrl && (
              <p
                onClick={handleImageDeleteButtonClick}
                className="text-sm text-dark-700 hover:cursor-pointer"
              >
                {'이미지 삭제'}
              </p>
            )}
          </div>
        </div>
        <Button
          name="인증하기"
          className="px-[15px] mt-[30px] w-full h-[52px]"
          style="custom"
          handleButtonClick={() => handleCertificationButtonClick()}
        />
      </div>
    </div>
  );
}
