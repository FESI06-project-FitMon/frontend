import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import NumberSelect from '@/components/common/NumberSelect';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { SelectType } from '@/stores/useSelectStore';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploadOverlay from '@/components/common/ImageUploadOverlay';

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
  onChange: (data: FormData) => void;
}


export default function GatheringInfomationModal({
  onChange,
}: GatheringInfomationModalProps) {
  const DEFAULT_IMAGE_URL =
    'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tags: [],
    imageUrl: null,
    mainLocation: '서울시',
    subLocation: '동작구',
    totalCount: 0,
    startDate: null,
    endDate: null,
  });

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    const updatedForm = { ...formData, [key]: value };

    // 부모로 전달 시 이미지가 없으면 기본 이미지를 전송
    const transformedData = {
      ...updatedForm,
      imageUrl: updatedForm.imageUrl || DEFAULT_IMAGE_URL,
    };

    setFormData(updatedForm);
    onChange(transformedData);
  };

  // useImageUpload 호출 부분 수정
  const { handleImageUpload, isUploading } = useImageUpload({
    type: 'GATHERING', // uploadFn 대신 type 지정
    onUploadSuccess: (imageUrl) => updateFormData('imageUrl', imageUrl),
    onUploadError: (error) => {
      console.error('이미지 업로드 실패:', error);
    }
  });

  const handleTagDelete = (tag: string) => {
    updateFormData(
      'tags',
      formData.tags.filter((t) => t !== tag),
    );
  };

  const placeSiItems = [
    { value: '서울시', label: '서울시' },
    { value: '부산시', label: '부산시' },
    { value: '대전시', label: '대전시' },
  ];

  const placeGuItems = [
    { value: '동작구', label: '동작구' },
    { value: '강서구', label: '강서구' },
    { value: '마포구', label: '마포구' },
  ];

  return (
    <div>
      {/* 모임 정보 */}
      <div id="information">
        <h2 className="mt-[30px] mb-[10px]">모임 정보</h2>
        <div className="flex gap-[10px]">
          <div className="relative border-[1px] rounded-[10px] bg-dark-400 border-dark-500 w-[130px] h-[130px] flex">
            <Image
              src={!formData.imageUrl || formData.imageUrl === 'null'
                ? DEFAULT_IMAGE_URL
                : formData.imageUrl}
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

          <div className="w-[360px]">
            <Input
              type="text"
              placeholder="모임명을 입력해 주세요. (25자 제한)"
              handleInputChange={(e) => updateFormData('title', e.target.value)}
              value={formData.title}
              className="outline-dark-500 bg-dark-400 mb-[7px] h-[47px]"
            />
            <TextArea
              placeholder="설명을 입력해 주세요. (50자 제한)"
              handleInputChange={(e) =>
                updateFormData('description', e.target.value)
              }
              value={formData.description}
              className="h-[76px] flex outline-dark-500 bg-dark-400 leading-[24px] overflow-x-auto resize-none whitespace-pre-wrap break-words"
            />
          </div>
        </div>
      </div>
      {/* 모임 태그 */}
      <div id="tags">
        <h2 className="mt-[20px] mb-[10px]">모임 태그</h2>
        <div className="relative">
          <div className="h-[47px] rounded-[8px] border border-dark-500 bg-dark-400 flex items-center gap-[10px] px-5">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="h-[30px] w-[121px] flex items-center justify-center py-[7px] px-[10px] bg-dark-200 rounded-[10px] gap-2 z-10"
              >
                <p className="text-primary text-sm">{`#${tag}`}</p>
                <button onClick={() => handleTagDelete(tag)}>
                  <Image
                    src="/assets/image/cancel-tag.svg"
                    width={11}
                    height={11}
                    alt="delete"
                  />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            className="absolute w-full bg-transparent top-0 h-[47px] outline-none"
            onKeyDown={(e) => {
              const input = e.currentTarget.value.trim();
              if (e.key === 'Enter' && input && !e.nativeEvent.isComposing) {
                if (formData.tags.length >= 3) {
                  alert('태그는 최대 3개까지 추가 가능합니다.');
                  return;
                }
                if (formData.tags.includes(input)) {
                  alert('이미 추가된 태그입니다.');
                  return;
                }
                updateFormData('tags', [...formData.tags, input]);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>
      {/* 장소 및 최대 인원 */}
      <div className="flex gap-[10px] mt-[20px]">
        <div id="place">
          <h2 className="mb-[10px]">장소</h2>
          <div className="flex">
            <Select
              items={placeSiItems}
              selectedItem={formData.mainLocation}
              setSelectedItem={(value) => updateFormData('mainLocation', value)}
              width="175px"
              height="47px"
              className="mr-[10px] w-[175px]"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            />
            <Select
              items={placeGuItems}
              selectedItem={formData.subLocation}
              setSelectedItem={(value) => updateFormData('subLocation', value)}
              width="175px"
              height="47px"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_GU}
            />
          </div>
        </div>
        <div id="max-people-count">
          <h2 className="mb-[10px]">최대 인원</h2>
          <NumberSelect
            targetNumber={formData.totalCount}
            setTargetNumber={(value) => updateFormData('totalCount', value)}
            width="130px"
            height="47px"
          />
        </div>
      </div>
      {/* 날짜 선택 */}
      <div className="flex gap-[10px] mt-[20px]">
        <div>
          <h2 className="mb-[10px]">시작 날짜</h2>
          <DatePickerCalendar
            selectedDate={formData.startDate}
            setSelectedDate={(date) => updateFormData('startDate', date)}
            width="245px"
            height="47px"
          />
        </div>
        <div>
          <h2 className="mb-[10px]">마감 날짜</h2>
          <DatePickerCalendar
            selectedDate={formData.endDate}
            setSelectedDate={(date) => updateFormData('endDate', date)}
            width="245px"
            height="47px"
            minDate={formData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}

