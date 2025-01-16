import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import NumberSelect from '@/components/common/NumberSelect';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { SelectType } from '@/stores/useSelectStore';
import Image from 'next/image';
import { useState, ChangeEvent, KeyboardEvent } from 'react';

export default function GatheringInfomationModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPlaceSi, setSelectedPlaceSi] = useState('seoul');
  const [selectedPlaceGu, setSelectedPlaceGu] = useState('dongjak');
  const [maxPeopleCount, setMaxPeopleCount] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const placeSiItems = [
    { value: 'seoul', label: '서울시' },
    { value: 'busan', label: '부산시' },
    { value: 'daejeon', label: '대전시' },
  ];
  const placeGuItems = [
    { value: 'dongjak', label: '동작구' },
    { value: 'kangsu', label: '강서구' },
    { value: 'mapo', label: '마포구' },
  ];

  const handleGatheringTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleGatheringDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleTagDeleteButtonClick = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleNewTagOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 6) {
      alert('태그는 최대 5글자까지 추가 가능합니다.');
      return;
    }
    setNewTag(e.target.value);
  };

  const handleEnterKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      if (tags.length === 3) {
        alert('태그는 최대 3개까지 추가 가능합니다.');
        setNewTag('');
        return;
      }
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleCreateButtonClick = () => {
    const newGathering = {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      mainLocation: placeSiItems.find((item) => item.value === selectedPlaceSi)
        ?.label,
      subLocation: placeGuItems.find((item) => item.value === selectedPlaceGu)
        ?.label,
      tags,
      maxPeopleCount,
    };

    console.log(newGathering);
  };

  const handleImageEditButtonClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageDeleteButtonClick = () => {
    setImageUrl('');
  };

  return (
    <div>
      {/* 모임 정보 */}
      <div id="information">
        <div className="mt-[30px] mb-[10px]">모임 정보</div>
        <div className="flex gap-[10px]">
          <div className="relative border-[1px] rounded-[10px] bg-dark-400 border-dark-500 w-[130px] h-[130px] flex">
            {/* <Image
              className="border-[1px] rounded-[10px] border-dark-500"
              width={130}
              height={130}
              alt="edit-image"
            /> */}

            {/* <div className="absolute bg-black/80 w-full h-full z-10 border-[1px] rounded-[10px] border-dark-500" /> */}

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
              <p
                onClick={handleImageDeleteButtonClick}
                className="text-sm text-dark-700 hover:cursor-pointer"
              >
                {'이미지 삭제'}
              </p>
            </div>
          </div>
          <div className="w-[360px]">
            <Input
              type="text"
              placeholder="모임명을 입력해 주세요. (25자 제한)"
              handleInputChange={(e) => handleGatheringTitleChange(e)}
              value={title}
              className="outline-dark-500 bg-dark-400 mb-[7px] h-[47px]"
            />
            <TextArea
              handleInputChange={(e) => handleGatheringDescriptionChange(e)}
              value={description}
              className="h-[76px] flex outline-dark-500 bg-dark-400 leading-[24px] overflow-x-auto resize-none whitespace-pre-wrap break-words"
            />
          </div>
        </div>
      </div>

      {/* 모임 태그 */}
      <div id="tags">
        <div className="mt-[20px] mb-[10px]">모임 태그</div>
        <div className="relative">
          <div className="h-[47px] bg-dark-400 border-dark-500 rounded-[8px] flex items-center gap-[10px] px-5">
            {tags.map((tag, index) => (
              <div
                className="h-[30px] w-[121px] flex items-center justify-center py-[7px] px-[10px] bg-dark-200 rounded-[10px] gap-2 z-10"
                key={index}
              >
                <p className="text-primary text-sm">{`#${tag}`}</p>
                <button onClick={() => handleTagDeleteButtonClick(tag)}>
                  <Image
                    src="/assets/image/cancel-tag.svg"
                    width={11}
                    height={11}
                    alt="tag-delete-button"
                  />
                </button>
              </div>
            ))}
          </div>
          <input
            className="absolute w-full bg-transparent top-0 h-[47px] outline-none"
            style={{
              paddingLeft: `${tags.length * 121 + 30 + (tags.length - 1) * 10}px`,
            }}
            value={newTag}
            onChange={(e) => handleNewTagOnChange(e)}
            onKeyDown={(e) => handleEnterKeyDown(e)}
          />
        </div>
      </div>

      {/* 장소 및 최대 인원 */}
      <div className="flex gap-[10px]">
        <div id="place">
          <div className="mt-[20px] mb-[10px]">장소</div>
          <div className="flex">
            <Select
              items={placeSiItems}
              selectedItem={selectedPlaceSi}
              setSelectedItem={setSelectedPlaceSi}
              width="175px"
              height="47px"
              className="mr-[10px] w-[175px]"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            />
            <Select
              items={placeGuItems}
              selectedItem={selectedPlaceGu}
              setSelectedItem={setSelectedPlaceGu}
              width="175px"
              height="47px"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_GU}
            />
          </div>
        </div>

        <div id="max-people-count">
          <div className="mt-[20px] mb-[10px]">최대인원</div>
          <NumberSelect
            width="130px"
            height="47px"
            targetNumber={maxPeopleCount}
            setTargetNumber={setMaxPeopleCount}
          />
        </div>
      </div>

      <div className="flex gap-[10px]">
        <div>
          <div className="mt-[20px] mb-[10px]">시작 날짜</div>
          <DatePickerCalendar
            selectedDate={startDate}
            setSelectedDate={setStartDate}
            className="w-[245px] h-[47px]"
            width="245px"
            height="47px"
          />
        </div>

        <div>
          <div className="mt-[20px] mb-[10px]">마감 날짜</div>
          <DatePickerCalendar
            selectedDate={endDate}
            setSelectedDate={setEndDate}
            className="w-[245px] h-[47px]"
            width="245px"
            height="47px"
            minDate={startDate!}
          />
        </div>
      </div>
    </div>
  );
}
