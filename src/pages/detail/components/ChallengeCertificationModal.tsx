import Button from '@/components/common/Button';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export default function ChallengeCertificationModal() {
  const [challengeGatheringImagUrl, setChallengeGatheringImageUrl] =
    useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file) {
      setChallengeGatheringImageUrl(URL.createObjectURL(file));
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

  return (
    <>
      {/* 이미지 첨부 */}
      <div className="flex flex-col justify-center items-center">
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

          <div className="absolute bg-black/80  w-full h-full z-10  border-[1px] rounded-[10px] border-dark-500 " />

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
            <p
              onClick={handleImageDeleteButtonClick}
              className="text-sm text-dark-700 hover:cursor-pointer"
            >
              {'이미지 삭제'}
            </p>
          </div>
        </div>
        <Button
          name="인증하기"
          className="mt-[30px] w-[500px] h-[52px]"
          style="custom"
        />
      </div>
    </>
  );
}
