import { useState } from 'react';
import Modal from '@/components/dialog/Modal';
import Select, { SelectItem } from '@/components/common/Select';
import cityData from '@/constants/city';
import { SelectType } from '@/stores/useSelectStore';
import DatePickerCalendar from '@/components/common/DatePicker';
import Button from '@/components/common/Button';
import { GatheringListParams } from '@/types';
import Image from 'next/image';

interface FilterModalProps {
  setShowFilterModal: () => void;
  filters: GatheringListParams;
  setFilters: (filters: GatheringListParams) => void;
}

export default function FilterModal({
  setShowFilterModal,
  filters,
  setFilters,
}: FilterModalProps) {
  const buttonActive = 'bg-dark-600';

  // 현재 선택한 필터를 임시 저장할 `localFilters` 상태
  const [localFilters, setLocalFilters] = useState(filters);

  const placeSiItems: SelectItem[] = Object.keys(cityData).map((city) => ({
    value: city,
    label: city,
  }));

  const placeGuItems: SelectItem[] = localFilters.mainLocation
    ? cityData[localFilters.mainLocation]?.map((gu) => ({
        value: gu.value,
        label: gu.label,
      })) || []
    : [];

  const resetSort = () =>
    setLocalFilters({ ...localFilters, sortBy: 'deadline' });
  const resetLocation = () =>
    setLocalFilters({ ...localFilters, mainLocation: '', subLocation: '' });
  const resetDate = () => setLocalFilters({ ...localFilters, searchDate: '' });

  const handleSiChange = (value: string) => {
    setLocalFilters({ ...localFilters, mainLocation: value, subLocation: '' });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    setShowFilterModal();
  };

  return (
    <Modal onClose={setShowFilterModal} title="필터 및 정렬">
      {/* 정렬 필터 */}
      <div className="relative mt-[30px] ">
        <h2 className="mb-[10px] text-lg font-semibold">모임 정보</h2>
        <div className="flex gap-2.5 items-end">
          <button
            className={`py-3 px-6 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'deadline' ? buttonActive : ''
            }`}
            onClick={() =>
              setLocalFilters({ ...localFilters, sortBy: 'deadline' })
            }
          >
            마감임박순
          </button>
          <button
            className={`py-3 px-6 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'participants' ? buttonActive : ''
            }`}
            onClick={() =>
              setLocalFilters({ ...localFilters, sortBy: 'participants' })
            }
          >
            참여인원순
          </button>
          <div className="flex justify-end ml-1">
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all"
              onClick={resetSort}
            >
              필터 초기화
              <Image
                src={'/assets/image/arrow-clockwise.svg'}
                aria-readonly
                alt="초기화 이미지"
                width={14}
                height={14}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 장소 선택 */}
      <div className="relative mt-[20px]">
        <h2 className="mb-[10px]">장소</h2>
        <div className="flex items-end ">
          <Select
            items={placeSiItems}
            selectedItem={localFilters.mainLocation || ''}
            setSelectedItem={handleSiChange}
            className="mr-[10px] w-full min-w-[100px] md:w-[175px]"
            currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            width="200px"
            height="47px"
          />
          <Select
            items={placeGuItems}
            selectedItem={localFilters.subLocation || ''}
            setSelectedItem={(value) =>
              setLocalFilters({ ...localFilters, subLocation: value })
            }
            currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_GU}
            className="mr-[10px] w-full min-w-[100px] md:w-[175px]"
            width="200px"
            height="47px"
          />
          <div className="flex justify-end ml-1">
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all"
              onClick={resetLocation}
            >
              필터 초기화
              <Image
                src={'/assets/image/arrow-clockwise.svg'}
                aria-readonly
                alt="초기화 이미지"
                width={14}
                height={14}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="relative flex flex-col md:flex-row w-full gap-[10px] mt-[20px]">
        <div className="w-full">
          <h2 className="mb-[10px]">날짜 선택</h2>
          <div className="flex items-end">
            <DatePickerCalendar
              className="w-full md:w-[245px]"
              height="47px"
              selectedDate={
                localFilters.searchDate
                  ? new Date(localFilters.searchDate)
                  : null
              }
              setSelectedDate={(date) =>
                setLocalFilters({
                  ...localFilters,
                  searchDate: date ? date.toISOString().split('T')[0] : '',
                })
              }
              minDate={null}
            />
            <div className="flex justify-end ml-3">
              <button
                className="flex items-center gap-1 text-sm text-dark-700 transition-all"
                onClick={resetDate}
              >
                필터 초기화
                <Image
                  src={'/assets/image/arrow-clockwise.svg'}
                  aria-readonly
                  alt="초기화 이미지"
                  width={14}
                  height={14}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-6">
        <Button
          name="취소"
          handleButtonClick={setShowFilterModal}
          style="cancel"
          className="w-[48%] h-[52px] text-primary"
        />
        {/* 적용 버튼 (변경된 값 반영 후 닫기) */}
        <Button
          name="적용"
          handleButtonClick={applyFilters}
          style="default"
          className="w-[48%] h-[52px]"
        />
      </div>
    </Modal>
  );
}
