import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DatePickerCalendar from '@/components/common/DatePicker';
import NumberSelect from '@/components/common/NumberSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';
import useToastStore from '@/stores/useToastStore';
import ModalInput from '@/components/common/ModalInput';
import { CreateChallenge } from '@/types';
import { DEFAULT_IMAGE } from '@/constants/imgConfig';

interface ChallengeInfomationModalProps {
  formData: CreateChallenge;
  onChange: (data: CreateChallenge) => void;
  gatheringEndDate: Date | null;
}

export default function ChallengeInfomationModal({
  formData,
  onChange,
  gatheringEndDate,
}: ChallengeInfomationModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.show);
  const [localFormData, setLocalFormData] = useState<CreateChallenge>(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const updateFormData = <K extends keyof CreateChallenge>(
    key: K,
    value: CreateChallenge[K],
  ) => {
    setLocalFormData((prev) => {
      const updatedForm = { ...prev, [key]: value };
      onChange(updatedForm);
      return updatedForm;
    });
  };

  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'CHALLENGE',
    onUploadSuccess: (imageUrl) => updateFormData('imageUrl', imageUrl),
    onUploadError: (error) => {
      console.error('이미지 업로드 실패:', error);
    },
  });

  const isSameDateTime = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    );
  };

  const validateEndDate = (
    startDate: Date | null,
    endDate: Date | null,
    maxDate: Date | null,
  ) => {
    if (!startDate) {
      showToast('시작 날짜를 먼저 선택해야 합니다.', 'caution');
      return false;
    }
    if (endDate && isSameDateTime(startDate, endDate)) {
      showToast('시작 날짜와 같은 날짜, 시간은 선택할 수 없습니다.', 'caution');
      return false;
    }
    if (
      endDate &&
      maxDate &&
      endDate > maxDate &&
      !isSameDateTime(endDate, maxDate)
    ) {
      showToast(
        '챌린지 종료 날짜는 모임 종료 날짜를 초과할 수 없습니다.',
        'caution',
      );
      return false;
    }
    return true;
  };

  const handleBlur = (
    value: string,
    field: keyof Pick<CreateChallenge, 'title' | 'description'>,
  ) => {
    if (!value.trim()) {
      showToast('빈칸으로 넘어갈 수 없습니다.', 'error');
      return;
    }
    updateFormData(field, value);
  };

  return (
    <div>
      <div id="information">
        <h2 className="mt-[30px] mb-[10px]">챌린지 정보</h2>
        <div className="flex-col md:flex-row flex items-start gap-[10px]">
          <div className="relative rounded-[10px] bg-dark-400 border-dark-500 h-[106px] md:h-[130px] overflow-hidden">
            <Image
              src={
                !localFormData.imageUrl ? DEFAULT_IMAGE : localFormData.imageUrl
              }
              alt="이미지 미리보기"
              width={106}
              height={106}
              className="rounded-[10px] object-cover md:w-[130px] md:h-[130px]"
            />
            <ImageUploadOverlay
              fileInputRef={fileInputRef}
              onUpload={handleImageUpload}
              onDelete={() => updateFormData('imageUrl', null)}
              isUploading={isUploading}
            />
          </div>
          <div className="w-[360px]">
            <ModalInput
              type="title"
              placeholder="챌린지 이름을 입력해 주세요. (25자 제한)"
              value={localFormData.title}
              onChange={(value) => updateFormData('title', value)}
              onBlur={(value) => handleBlur(value, 'title')}
              className="outline-dark-500 mb-[7px]"
              maxLength={25}
              height="47px"
            />
            <ModalInput
              type="description"
              placeholder="설명을 입력해 주세요. (50자 제한)"
              value={localFormData.description}
              onChange={(value) => updateFormData('description', value)}
              onBlur={(value) => handleBlur(value, 'description')}
              className="outline-dark-500 md:mb-[7px]"
              maxLength={50}
              height="76px"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-[10px] mt-[20px]">
        <div id="max-people-count">
          <h2 className="mb-[10px]">최대 인원</h2>
          <NumberSelect
            targetNumber={localFormData.totalCount}
            setTargetNumber={(value) => updateFormData('totalCount', value)}
            className="w-[90px]"
            height="47px"
            min={2}
          />
        </div>
        <div id="start-date">
          <h2 className="mb-[10px]">시작 날짜</h2>
          <DatePickerCalendar
            selectedDate={localFormData.startDate}
            setSelectedDate={(date) => updateFormData('startDate', date)}
            width="196px"
            height="47px"
          />
        </div>
        <div id="end-date">
          <h2 className="mb-[10px]">마감 날짜</h2>
          <DatePickerCalendar
            selectedDate={localFormData.endDate}
            setSelectedDate={(date) => {
              if (
                validateEndDate(localFormData.startDate, date, gatheringEndDate)
              ) {
                updateFormData('endDate', date!);
              }
            }}
            width="196px"
            height="47px"
            minDate={localFormData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}
