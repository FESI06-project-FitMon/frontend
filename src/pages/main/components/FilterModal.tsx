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
    setLocalFilters({
      ...localFilters,
      sortBy: 'deadline',
      sortDirection: 'ASC',
    });
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
      <div className="relative mt-[30px]">
        <h2 className="mb-[10px] text-lg font-semibold">모임 정렬</h2>
        <div className="grid grid-cols-2 gap-2.5 items-end text-[15px]">
          <button
            className={`py-2 px-4 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'deadline' &&
              localFilters.sortDirection === 'ASC'
                ? buttonActive
                : ''
            }`}
            onClick={() =>
              setLocalFilters({
                ...localFilters, // ✅ filters가 아니라 localFilters를 업데이트
                sortBy: 'deadline',
                sortDirection: 'ASC',
              })
            }
          >
            마감이 먼 순
          </button>

          <button
            className={`py-2 px-4 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'deadline' &&
              localFilters.sortDirection === 'DESC'
                ? buttonActive
                : ''
            }`}
            onClick={() =>
              setLocalFilters({
                ...localFilters, // ✅ filters가 아니라 localFilters를 업데이트
                sortBy: 'deadline',
                sortDirection: 'DESC',
              })
            }
          >
            마감 임박순
          </button>

          <button
            className={`py-2 px-4 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'participants' &&
              localFilters.sortDirection === 'ASC'
                ? buttonActive
                : ''
            }`}
            onClick={() =>
              setLocalFilters({
                ...localFilters, // ✅ filters가 아니라 localFilters를 업데이트
                sortBy: 'participants',
                sortDirection: 'ASC',
              })
            }
          >
            참여인원 적은 순
          </button>

          <button
            className={`py-2 px-4 rounded-[10px] transition-colors bg-dark-400 ${
              localFilters.sortBy === 'participants' &&
              localFilters.sortDirection === 'DESC'
                ? buttonActive
                : ''
            }`}
            onClick={() =>
              setLocalFilters({
                ...localFilters, // ✅ filters가 아니라 localFilters를 업데이트
                sortBy: 'participants',
                sortDirection: 'DESC',
              })
            }
          >
            참여인원 많은 순
          </button>
        </div>
        {/* 초기화 버튼 */}
        <div className="flex mt-4">
          <button
            className="flex items-center gap-1 text-sm text-dark-700 transition-all"
            onClick={resetSort}
          >
            초기화
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

      {/* 장소 선택 */}
      <div className="relative mt-[20px]">
        <h2 className="mb-[10px]">장소</h2>
        <div className="flex justify-start items-end ">
          <Select
            items={placeSiItems}
            selectedItem={localFilters.mainLocation || ''}
            setSelectedItem={handleSiChange}
            className="mr-[10px] w-[175px]"
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
            className="mr-[10px] w-[175px]"
            width="200px"
            height="47px"
          />
          {/* 초기화 버튼 */}
          <div className="flex md:justify-end mt-2 ml-2">
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all"
              onClick={resetLocation}
            >
              초기화
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
      <div className="relative mt-[20px]">
        <h2 className="mb-[10px]">날짜 선택</h2>
        <div className="flex items-end">
          <DatePickerCalendar
            className="w-[245px]"
            height="47px"
            selectedDate={
              localFilters.searchDate ? new Date(localFilters.searchDate) : null
            }
            setSelectedDate={(date) =>
              setLocalFilters({
                ...localFilters,
                searchDate: date ? date.toISOString().split('T')[0] : '',
              })
            }
            minDate={null}
          />
          {/* 초기화 버튼 */}
          <div className="flex justify-end ml-4">
            <button
              className="flex items-center gap-1 text-sm text-dark-700 transition-all"
              onClick={resetDate}
            >
              초기화
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

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-6 gap-2.5">
        <Button
          name="취소"
          handleButtonClick={setShowFilterModal}
          style="cancel"
          className="min-w-[48%] h-[52px] text-primary"
        />
        {/* 적용 버튼 */}
        <Button
          name="적용"
          handleButtonClick={applyFilters}
          style="default"
          className="min-w-[48%]  h-[52px]"
        />
      </div>
    </Modal>
  );
}
