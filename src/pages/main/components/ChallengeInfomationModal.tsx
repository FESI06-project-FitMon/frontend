import DatePickerCalendar from '@/components/common/DatePicker';
import { CreateChallenge } from '@/types';
import Image from 'next/image';
import { useRef, useState } from 'react';
import NumberSelect from '@/components/common/NumberSelect';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';
import useToastStore from '@/stores/useToastStore';
import ModalInput from '@/components/common/ModalInput';

interface ChallengeInfomationModalProps {
  onChange: (data: CreateChallenge) => void;
  gatheringEndDate: Date | null;
}

export default function ChallengeInfomationModal({
  onChange,
  gatheringEndDate,
}: ChallengeInfomationModalProps) {
  const DEFAULT_IMAGE_URL =
    'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.show);
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
      !isSameDateTime(endDate, maxDate) // maxDate와 동일한 경우는 허용
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
          <div className="relative rounded-[10px] bg-dark-400 border-dark-500  h-[106px] md:h-[130px] overflow-hidden">
            <Image
              src={
                !formData.imageUrl || formData.imageUrl === 'null'
                  ? DEFAULT_IMAGE_URL
                  : formData.imageUrl
              }
              alt="이미지 미리보기"
              width={106}
              height={106}
              className="rounded-[10px] object-cover md:w-[130px] md:h-[130px]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = DEFAULT_IMAGE_URL;
              }}
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
              value={formData.title}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
              onBlur={(value) => handleBlur(value, 'title')}
              className="outline-dark-500 mb-[7px]"
              maxLength={25}
              height="47px"
            />
            <ModalInput
              type="description"
              placeholder="설명을 입력해 주세요. (50자 제한)"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
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
            targetNumber={formData.totalCount}
            setTargetNumber={(value) => updateFormData('totalCount', value)}
            className="w-[90px]"
            height="47px"
            min={2}
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
            setSelectedDate={(date) => {
              if (validateEndDate(formData.startDate, date, gatheringEndDate)) {
                updateFormData('endDate', date!);
              }
            }}
            width="196px"
            height="47px"
            minDate={formData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}
