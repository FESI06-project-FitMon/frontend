import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import { CreateChallenge } from '@/types';
import Image from 'next/image';
import { useState, useRef } from 'react';
import NumberSelect from '@/components/common/NumberSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';

interface ChallengeInfomationModalProps {
  onChange: (data: CreateChallenge) => void; // 부모로 데이터 전달
}

// 기본 이미지 URL
const DEFAULT_IMAGE_URL =
  'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png';

export default function ChallengeInfomationModal({
  onChange,
}: ChallengeInfomationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateChallenge>({
    title: '',
    description: '',
    imageUrl: null,
    startDate: null,
    endDate: null,
    totalCount: 0,
  });

  const updateFormData = <K extends keyof CreateChallenge>(
    key: K,
    value: CreateChallenge[K],
  ) => {
    const updatedForm = { ...formData, [key]: value };

    const transformedData = {
      ...updatedForm,
      imageUrl: updatedForm.imageUrl || DEFAULT_IMAGE_URL,
    };

    setFormData(updatedForm);
    onChange(transformedData);
  };

  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'CHALLENGE',
    onUploadSuccess: (imageUrl) => updateFormData('imageUrl', imageUrl),
    onUploadError: (error) => {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return (
    <div>
      {/* 챌린지 정보 */}
      <div id="information">
        <h2 className="mt-[30px] mb-[10px]">챌린지 정보</h2>
        <div className="flex gap-[10px]">
          {/* 이미지 업로드 */}
          <div className="relative border-[1px] rounded-[10px] bg-dark-400 border-dark-500 w-[130px] h-[130px] flex">
            <Image
              src={
                !formData.imageUrl || formData.imageUrl === 'null'
                  ? DEFAULT_IMAGE_URL
                  : formData.imageUrl
              }
              alt="이미지 미리보기"
              className="rounded-[10px] w-full h-full object-cover"
              fill
            />
            <ImageUploadOverlay
              fileInputRef={fileInputRef}
              onUpload={handleImageUpload}
              onDelete={() => updateFormData('imageUrl', null)}
              isUploading={isUploading}
            />
          </div>

          {/* 제목 및 설명 */}
          <div className="w-[360px]">
            <Input
              type="text"
              placeholder="챌린지 이름을 입력해 주세요. (25자 제한)"
              handleInputChange={(e) => updateFormData('title', e.target.value)}
              value={formData.title}
              className="outline-dark-500 bg-dark-400 mb-[7px] h-[47px]"
              maxLength={25}
            />
            <TextArea
              placeholder="설명을 입력해 주세요. (50자 제한)"
              handleInputChange={(e) =>
                updateFormData('description', e.target.value)
              }
              value={formData.description}
              className="h-[76px] flex outline-dark-500 bg-dark-400 leading-[24px] overflow-x-auto resize-none whitespace-pre-wrap break-words"
              maxLength={50}
            />
          </div>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="flex gap-[10px] mt-[20px]">
        <div id="max-people-count">
          <h2 className="mb-[10px]">최대 인원</h2>
          <NumberSelect
            targetNumber={formData.maxPeopleCount}
            setTargetNumber={(value) => updateFormData('maxPeopleCount', value)}
            className="w-[90px]"
            height="47px"
          />
        </div>
        <div id="start-date">
          <h2 className="mb-[10px]">시작 날짜</h2>
          <DatePickerCalendar
            selectedDate={formData.startDate}
            setSelectedDate={(date) => updateFormData('startDate', date)}
            width="196px"
            height="47px"
          />
        </div>
        <div id="end-date">
          <h2 className="mb-[10px]">마감 날짜</h2>
          <DatePickerCalendar
            selectedDate={formData.endDate}
            setSelectedDate={(date) => updateFormData('endDate', date)}
            width="196px"
            height="47px"
            minDate={formData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}
