import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DatePickerCalendar from '@/components/common/DatePicker';
import NumberSelect from '@/components/common/NumberSelect';
import Select, { SelectItem } from '@/components/common/Select';
import { SelectType } from '@/stores/useSelectStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';
import TagInput from '@/components/common/TagInput';
import cityData from '@/constants/city';
import useToastStore from '@/stores/useToastStore';
import ModalInput from '@/components/common/ModalInput';

interface FormData {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string | null;
  mainLocation: string;
  subLocation: string;
  totalCount: number;
  startDate: Date | null;
  endDate: Date | null;
}

interface GatheringInfomationModalProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

type CityKeys = keyof typeof cityData;

export default function GatheringInfomationModal({
  formData,
  onChange,
}: GatheringInfomationModalProps) {
  const DEFAULT_IMAGE_URL =
    'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.show);

  const [localFormData, setLocalFormData] = useState<FormData>(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setLocalFormData((prev) => {
      const updatedForm = { ...prev, [key]: value };
      onChange(updatedForm);
      return updatedForm;
    });
  };

  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'GATHERING',
    onUploadSuccess: (imageUrl) => updateFormData('imageUrl', imageUrl),
    onUploadError: (error) => {
      console.error('이미지 업로드 실패:', error);
    },
  });

  const placeSiItems: SelectItem[] = Object.keys(cityData).map((city) => ({
    value: city,
    label: city,
  }));

  const placeGuItems: SelectItem[] =
    cityData[localFormData.mainLocation as CityKeys]?.map((gu) => ({
      value: gu.value,
      label: gu.label,
    })) || [];

  const handleBlur = (
    value: string,
    field: keyof Pick<FormData, 'title' | 'description'>,
  ) => {
    if (!value.trim()) {
      showToast('빈칸으로 넘어갈 수 없습니다.', 'error');
      return;
    }
    updateFormData(field, value);
  };

  return (
    <div>
      {/* 모임 정보 */}
      <div id="information">
        <h2 className="mt-[30px] mb-[10px]">모임 정보</h2>
        <div className="flex flex-col md:flex-row items-start gap-[10px]">
          <div className="relative rounded-[10px] bg-dark-400 border-dark-500 h-[106px] md:h-[130px] overflow-hidden">
            <Image
              src={
                !localFormData.imageUrl
                  ? DEFAULT_IMAGE_URL
                  : localFormData.imageUrl
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
          <div className="w-full md:w-[360px]">
            <ModalInput
              type="title"
              placeholder="모임 이름을 입력해 주세요. (25자 제한)"
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
              className="outline-dark-500 mb-[7px]"
              maxLength={50}
              height="76px"
            />
          </div>
        </div>
      </div>

      {/* 모임 태그 */}
      <div>
        <h2 className="mb-[10px]">모임 태그</h2>
        <TagInput
          initialTags={localFormData.tags}
          onTagsChange={(updatedTags) => updateFormData('tags', updatedTags)}
        />
      </div>

      {/* 장소 및 최대 인원 */}
      <div className="flex mt-[20px]">
        <div id="place" className="w-full">
          <h2 className="mb-[10px]">장소</h2>
          <div className="flex">
            <Select
              items={placeSiItems}
              selectedItem={localFormData.mainLocation}
              setSelectedItem={(value) => updateFormData('mainLocation', value)}
              width=""
              height="47px"
              className="mr-[10px] w-full min-w-[100px] md:w-[175px]"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            />
            <Select
              items={placeGuItems}
              selectedItem={localFormData.subLocation}
              setSelectedItem={(value) => updateFormData('subLocation', value)}
              className="mr-[10px] w-full min-w-[100px] md:w-[175px]"
              width=""
              height="47px"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_GU}
            />
          </div>
        </div>
        <div id="max-people-count">
          <h2 className="mb-[10px]">최대 인원</h2>
          <NumberSelect
            targetNumber={localFormData.totalCount}
            setTargetNumber={(value) => updateFormData('totalCount', value)}
            className="md:w-[130px]"
            height="47px"
            min={5}
          />
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="flex flex-col md:flex-row w-full gap-[10px] mt-[20px]">
        <div className="w-full">
          <h2 className="mb-[10px]">시작 날짜</h2>
          <DatePickerCalendar
            selectedDate={localFormData.startDate}
            setSelectedDate={(date) => updateFormData('startDate', date)}
            className="w-full md:w-[245px]"
            height="47px"
          />
        </div>
        <div className="w-full">
          <h2 className="mb-[10px]">마감 날짜</h2>
          <DatePickerCalendar
            selectedDate={localFormData.endDate}
            setSelectedDate={(date) => updateFormData('endDate', date)}
            className="w-full md:w-[245px]"
            height="47px"
            minDate={localFormData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}
