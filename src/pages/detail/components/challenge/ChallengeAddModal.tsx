import Button from '@/components/common/Button';
import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import NumberSelect from '@/components/common/NumberSelect';
import TextArea from '@/components/common/TextArea';
import uploadImage from '@/utils/uploadImage';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useChallengeCreate } from '../../service/gatheringService';
import { useQueryClient } from '@tanstack/react-query';
import { GatheringDetailType } from '@/types';

interface ChallengeAddModalProps {
  onClose: () => void;
  gathering: GatheringDetailType;
}
export default function ChallengeAddModal({
  onClose,
  gathering,
}: ChallengeAddModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // 오늘 날짜 +1일

  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    imageUrl: '',
    totalCount: 0,
    startDate: tomorrow,
    endDate: tomorrow,
  });

  const handleChallengeTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChallenge({ ...newChallenge, title: e.target.value });
  };
  const handleChallengeDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setNewChallenge({ ...newChallenge, description: e.target.value });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file) {
      const imageUrl = (await uploadImage(file, 'CHALLENGE')).imageUrl;
      setNewChallenge({
        ...newChallenge,
        imageUrl: imageUrl,
      });
    }
  };

  const handleImageEditButtonClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleImageDeleteButtonClick = () => {
    setNewChallenge({
      ...newChallenge,
      imageUrl: '',
    });
  };

  const handleChallengeAddButtonClick = async () => {
    mutate({
      ...newChallenge,
      startDate: newChallenge.startDate.toISOString(),
      endDate: newChallenge.endDate.toISOString(),
    });
    onClose();
  };
  const queryClient = useQueryClient();

  const { mutate } = useChallengeCreate(gathering.gatheringId, queryClient);
  return (
    <>
      {/* 챌린지 정보 */}
      <div id="information">
        <div className="text-sm md:text-base mt-[30px] mb-[10px]">
          챌린지 정보
        </div>

        {/* 상단 정보 */}
        <div className="flex flex-col md:flex-row gap-[10px]">
          {/* 이미지 첨부 */}
          <div className="relative border-[1px] rounded-[10px] w-[106px] h-[106px] md:w-[130px] md:h-[130px] border-dark-500 flex justify-center items-center">
            <Image
              src={
                newChallenge.imageUrl
                  ? newChallenge.imageUrl
                  : 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
              }
              width={106}
              height={106}
              alt="edit-image"
              className="w-[106px] h-[106px] md:w-[130px] md:h-[130px] border-[1px] rounded-[10px] border-dark-500 "
            />

            <div
              style={{
                background: newChallenge.imageUrl
                  ? 'rgba(0, 0, 0, 0.8)'
                  : '#2d2d2d',
              }}
              className="absolute w-full h-full z-10  border-[1px] rounded-[10px] border-dark-500 "
            />

            <div className="absolute w-[130px] h-[130px] z-20 flex flex-col justify-center items-center gap-2 hover:cursor-pointer">
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
              {newChallenge.imageUrl && (
                <p
                  onClick={handleImageDeleteButtonClick}
                  className="text-sm text-dark-700 hover:cursor-pointer"
                >
                  {'이미지 삭제'}
                </p>
              )}
            </div>
          </div>
          {/* 이름, 설명 입력 */}
          <div className="w-full md:w-[360px]">
            <Input
              type="text"
              handleInputChange={(e) => handleChallengeTitleChange(e)}
              value={newChallenge.title}
              className="text-sm md:text-base  outline-dark-500 bg-dark-400  mb-[7px] h-[47px]"
              placeholder="챌린지 이름을 입력해 주세요. (25자 제한)"
            />
            <TextArea
              handleInputChange={(e) => handleChallengeDescriptionChange(e)}
              value={newChallenge.description}
              className="text-sm md:text-base h-[76px] flex outline-dark-500 bg-dark-400 leading-[24px] overflow-x-auto resize-none whitespace-pre-wrap break-words "
              placeholder="설명을 입력해 주세요. (50자 제한)"
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-[10px] mt-2 md:mt-[30px] mb-[10px]">
          {/* 최대 인원 */}
          <div>
            <p className="text-sm md:text-base  mb-[10px]">최대 인원</p>
            <NumberSelect
              min={2}
              targetNumber={newChallenge.totalCount}
              setTargetNumber={(targetNumber: number) => {
                if (
                  targetNumber >= gathering.minCount &&
                  targetNumber <= gathering.totalCount
                ) {
                  setNewChallenge({
                    ...newChallenge,
                    totalCount: targetNumber,
                  });
                }
              }}
              className="text-sm md:text-base  w-[90px] h-[47px]"
            />
          </div>

          <div className="flex gap-[9px] w-full justify-between">
            {/* 시작 날짜 */}
            <div className="w-[50%]">
              <p className="text-sm md:text-base  mb-[10px]">시작 날짜</p>
              <DatePickerCalendar
                selectedDate={newChallenge.startDate}
                setSelectedDate={(date: Date) =>
                  setNewChallenge({ ...newChallenge, startDate: date })
                }
                minDate={tomorrow}
                width="100%"
                height="47px"
                className="text-sm md:text-base "
              />
            </div>

            {/* 마감 날짜 */}
            <div className="w-[50%]">
              <p className="text-sm md:text-base  mb-[10px]">마감 날짜</p>
              <DatePickerCalendar
                selectedDate={newChallenge.endDate}
                setSelectedDate={(date: Date) =>
                  setNewChallenge({ ...newChallenge, endDate: date })
                }
                minDate={newChallenge.startDate!}
                width="100%"
                height="47px"
                className="text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        {/* 챌린지 추가 버튼 */}
        <Button
          name="확인"
          className="w-full h-[52px] mt-1 md:mt-[30px]"
          handleButtonClick={handleChallengeAddButtonClick}
        />
      </div>
    </>
  );
}
