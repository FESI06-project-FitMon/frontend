import Button from '@/components/common/Button';
import DatePickerCalendar from '@/components/common/DatePicker';
import Input from '@/components/common/Input';
import NumberSelect from '@/components/common/NumberSelect';
import Select, { SelectItem } from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { SelectType } from '@/stores/useSelectStore';
import Image from 'next/image';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import cityData from '@/constants/city';
import uploadImage from '@/utils/uploadImage';
import { GatheringDetailType } from '@/types';
import Null from '@/components/common/Null';
import { useGatheringUpdate } from '../../service/gatheringService';
import { useQueryClient } from '@tanstack/react-query';
import useToastStore from '@/stores/useToastStore';
import { AxiosError } from 'axios';

export default function GatheringEditModal({
  information,
  gatheringId,
  setIsModalOpen,
}: {
  information: GatheringDetailType;
  gatheringId: number;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) {
  const showToast = useToastStore((state) => state.show);

  const [newGathering, setNewGathering] = useState({
    title: information.title,
    description: information.description,
    tags: information.tags,
    imageUrl: information.imageUrl,
    mainLocation: information.mainLocation,
    subLocation: information.subLocation,
    totalCount: information.totalCount,
    startDate: information.startDate,
    endDate: information.endDate,
  });

  const [newTag, setNewTag] = useState('');
  type CityData = typeof cityData;
  type CityKeys = keyof CityData;

  const placeSiItems: SelectItem[] = Object.keys(cityData).map((city) => ({
    value: city,
    label: city,
  }));

  const placeGuItems: SelectItem[] =
    cityData[newGathering.mainLocation as CityKeys]?.map((gu) => ({
      value: gu.value,
      label: gu.label,
    })) || [];

  const handleGatheringTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGathering({ ...newGathering, title: e.target.value });
  };
  const handleGatheringDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setNewGathering({ ...newGathering, description: e.target.value });
  };

  const handleTagDeleteButtonClick = (tag: string) => {
    setNewGathering({
      ...newGathering,
      tags: newGathering.tags.filter((t) => t !== tag),
    });
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
      if (newGathering.tags.length === 3) {
        alert('태그는 최대 3개까지 추가 가능합니다.');
        setNewTag('');
        return;
      }
      setNewGathering({
        ...newGathering,
        tags: [...newGathering.tags, newTag],
      });

      setNewTag('');
    }
  };

  // 수정버튼 클릭 핸들러
  const handleEditButtonClick = () => {
    const editedInformation = { ...newGathering };

    if (newGathering.startDate > newGathering.endDate) {
      showToast('시작날짜는 종료날짜보다 이전이어야 합니다.', 'error');
      return;
    }
    try {
      mutate({ newGathering: editedInformation });
      showToast('모임 정보 수정에 성공하였습니다.', 'check');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
    // 모달을 닫는다.
    setIsModalOpen(false);
  };

  // 숨겨져 있는 fileInput Html 클릭
  const handleImageEditButtonClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file) {
      const imageFileUrl = (await uploadImage(file, 'GATHERING')).imageUrl;
      setNewGathering({
        ...newGathering,
        imageUrl: imageFileUrl,
      });
    }
  };

  const handleImageDeleteButtonClick = () => {
    setNewGathering({
      ...newGathering,
      imageUrl: '',
    });
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useGatheringUpdate(gatheringId, queryClient);

  if (isPending) return <Null message="로딩중입니다" />;

  return (
    <div>
      {/* 모임 정보 */}
      <div id="information" className="relative">
        <div className="text-sm md:text-base mt-[30px] mb-[10px]">
          모임 정보
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-[10px]">
          <div className="relative border-[1px] rounded-[10px] border-dark-500 w-[130px] h-[130px] flex">
            <Image
              className=" border-[1px] rounded-[10px] border-dark-500 "
              src={
                newGathering.imageUrl
                  ? newGathering.imageUrl
                  : 'https://fitmon-bucket.s3.amazonaws.com/gatherings/06389c8f-340c-4864-86fb-7d9a88a632d5_default.png'
              }
              width={130}
              height={130}
              alt="edit-image"
            />

            <div
              style={{
                background: newGathering.imageUrl
                  ? 'rgba(0, 0, 0, 0.8)'
                  : '#2d2d2d',
              }}
              className="absolute  w-full h-full z-10  border-[1px] rounded-[10px] border-dark-500 "
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

              {newGathering.imageUrl && (
                <p
                  onClick={handleImageDeleteButtonClick}
                  className="text-sm text-dark-700 hover:cursor-pointer"
                >
                  {'이미지 삭제'}
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-[360px]">
            <Input
              type="text"
              handleInputChange={(e) => handleGatheringTitleChange(e)}
              value={newGathering.title}
              className="text-sm md:text-base h-[47px]  outline-dark-500 bg-dark-400 mb-[7px] "
            />
            <TextArea
              handleInputChange={(e) => handleGatheringDescriptionChange(e)}
              value={newGathering.description}
              className="text-sm md:text-base h-[76px] md:h-[76px] flex outline-dark-500 bg-dark-400 leading-[24px] overflow-x-auto resize-none whitespace-pre-wrap break-words "
            />
          </div>
        </div>
      </div>

      {/* 모임 태그 */}
      <div id="tags">
        <div className="text-sm md:text-base mt-[20px] mb-[10px]">
          모임 태그
        </div>
        <div className="relative">
          <div className="  h-[47px] bg-dark-400 border-dark-500 rounded-[8px] flex items-center gap-[10px] px-5 ">
            {newGathering.tags.map((tag, index) => (
              <div
                className="h-[30px] w-[121px] flex items-center justify-center py-[7px] px-[10px] bg-dark-200 rounded-[10px] gap-2 z-10"
                key={index}
              >
                <p className=" text-primary text-xs md:text-sm">{`#${tag}`}</p>
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
            className={`absolute w-full bg-transparent top-0 h-[47px] outline-none`}
            style={{
              paddingLeft: `${newGathering.tags.length * 121 + 30 + (newGathering.tags.length - 1) * 10}px`,
            }}
            value={newTag}
            onChange={(e) => handleNewTagOnChange(e)}
            onKeyDown={(e) => handleEnterKeyDown(e)}
          />
        </div>
      </div>

      {/* 장소 및 최대 인원 */}
      <div className="flex gap-[10px]">
        <div id="place" className="w-[66%]">
          <div className="text-sm md:text-base mt-[20px] mb-[10px]">장소</div>
          <div className="flex">
            <Select
              items={placeSiItems}
              selectedItem={newGathering.mainLocation}
              setSelectedItem={(mainLocation: string) =>
                setNewGathering({
                  ...newGathering,
                  mainLocation: mainLocation,
                })
              }
              width="100%"
              height="47px"
              className="text-sm md:text-base mr-[10px] w-[100%]"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            />
            <Select
              items={placeGuItems}
              selectedItem={newGathering.subLocation}
              setSelectedItem={(subLocation: string) =>
                setNewGathering({
                  ...newGathering,
                  subLocation: subLocation,
                })
              }
              width="100%"
              height="47px"
              className="text-sm md:text-base w-[100%]"
              currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_GU}
            />
          </div>
        </div>

        <div id="max-people-count" className="w-[34%]">
          <div className="text-sm md:text-base mt-[20px] mb-[10px]">
            최대인원
          </div>
          <NumberSelect
            min={2}
            width="100%"
            height="47px"
            targetNumber={newGathering.totalCount}
            setTargetNumber={(totalCount: number) =>
              setNewGathering({
                ...newGathering,
                totalCount: totalCount,
              })
            }
            className="text-sm md:text-base"
          />
        </div>
      </div>

      <div className="flex gap-[10px] ">
        <div className="w-[50%]">
          <div className="text-sm md:text-base mt-[20px] mb-[10px]">
            시작 날짜
          </div>
          <DatePickerCalendar
            selectedDate={new Date(newGathering.startDate)}
            setSelectedDate={(date: Date) =>
              setNewGathering({
                ...newGathering,
                startDate: date.toISOString(),
              })
            }
            className="text-sm md:text-base w-[100%] h-[47px]"
            width="100%"
            height="47px"
          />
        </div>

        <div className="w-[50%]">
          <div className="text-sm md:text-base mt-[20px] mb-[10px]">
            마감 날짜
          </div>
          <DatePickerCalendar
            selectedDate={new Date(newGathering.endDate)}
            setSelectedDate={(date: Date) =>
              setNewGathering({
                ...newGathering,
                endDate: date.toISOString(),
              })
            }
            className="text-sm md:text-base w-[100%] h-[47px]"
            width="100%"
            height="47px"
            minDate={new Date(newGathering.startDate)}
          />
        </div>
      </div>

      <Button
        handleButtonClick={handleEditButtonClick}
        name="확인"
        className="h-[52px] mt-5 md:mt-[30px]"
      />
    </div>
  );
}
