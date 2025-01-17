import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import NumberSelect from '@/components/common/NumberSelect';
import TextArea from '@/components/common/TextArea';
import { CreateChallenge } from '@/types';
import Image from 'next/image';
import { useState, ChangeEvent } from 'react';

interface ChallengeInfomationModalProps {
  onChange: (data: CreateChallenge) => void; // 부모로 데이터 전달
}

export default function ChallengeInfomationModal({
  onChange,
}: ChallengeInfomationModalProps) {
  const [formData, setFormData] = useState<CreateChallenge>({
    title: '',
    description: '',
    imageUrl: '',
    maxPeopleCount: 0,
    startDate: null,
    endDate: null,
  });

  // 상태 업데이트 핸들러
  const updateFormData = <K extends keyof CreateChallenge>(
    key: K,
    value: CreateChallenge[K],
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(updated); // 부모로 업데이트된 데이터 전달
      return updated;
    });
  };

  // 이미지 관련 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    updateFormData('imageUrl', imageUrl);
  };

  const handleImageDelete = () => updateFormData('imageUrl', '');

  const handleImageEditClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div>
      {/* 챌린지 정보 */}
      <div id="information">
        <h2 className="mt-[30px] mb-[10px]">챌린지 정보</h2>
        <div className="flex gap-[10px]">
          {/* 이미지 업로드 */}
          <div className="relative border-[1px] rounded-[10px] bg-dark-400 border-dark-500 w-[130px] h-[130px] flex">
            {formData.imageUrl && (
              <>
                <Image
                  src={formData.imageUrl}
                  alt="이미지 미리보기"
                  className="rounded-[10px] w-full h-full object-cover"
                />
                <div className="absolute w-full h-full bg-black/70 rounded-[10px] z-10" />
              </>
            )}
            <div className="absolute w-full h-full flex flex-col justify-center items-center gap-2 z-20 hover:cursor-pointer">
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Image
                src="/assets/image/gathering_edit.svg"
                width={45}
                height={45}
                alt="edit-image"
                onClick={handleImageEditClick}
              />
              <button
                onClick={handleImageDelete}
                className="text-sm text-dark-700 hover:cursor-pointer"
              >
                이미지 삭제
              </button>
            </div>
          </div>

          {/* 제목 및 설명 */}
          <div className="w-[360px]">
            <Input
              type="text"
              placeholder="챌린지 이름을 입력해 주세요. (25자 제한)"
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

      {/* 최대 인원 및 날짜 선택 */}
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
            className="w-[196px]"
            height="47px"
          />
        </div>
        <div id="end-date">
          <h2 className="mb-[10px]">마감 날짜</h2>
          <DatePickerCalendar
            selectedDate={formData.endDate}
            setSelectedDate={(date) => updateFormData('endDate', date)}
            className="w-[196px]"
            height="47px"
            minDate={formData.startDate!}
          />
        </div>
      </div>
    </div>
  );
}
