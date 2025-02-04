import { useState } from 'react';
import Modal from '@/components/dialog/Modal';
import Select, { SelectItem } from '@/components/common/Select';
import cityData from '@/constants/city';
import { SelectType } from '@/stores/useSelectStore';
import DatePickerCalendar from '@/components/common/DatePicker';
import Button from '@/components/common/Button';
import { GatheringListParams } from '@/types';

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

  // ✅ 현재 선택한 필터를 임시 저장할 `localFilters` 상태 추가
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

  // ✅ 시/도 선택 핸들러 (localFilters 업데이트)
  const handleSiChange = (value: string) => {
    setLocalFilters({ ...localFilters, mainLocation: value, subLocation: '' });
  };

  // ✅ "적용" 버튼 클릭 시, 변경된 localFilters를 부모로 전달
  const applyFilters = () => {
    setFilters(localFilters); // ✅ 필터 업데이트
    setShowFilterModal(); // ✅ 모달 닫기
  };

  return (
    <Modal onClose={setShowFilterModal} title="필터 및 정렬">
      <div>
        <h2 className="mt-[30px] mb-[10px] text-lg font-semibold">모임 정보</h2>
        <div className="flex gap-2.5">
          <button
            className={`py-2 px-6 rounded-[10px] transition-colors bg-dark-400 ${
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
        </div>
      </div>

      {/* 장소 선택 */}
      <div className="mt-[20px]">
        <h2 className="mb-[10px]">장소</h2>
        <div className="flex w-full">
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
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="flex flex-col md:flex-row w-full gap-[10px] mt-[20px]">
        <div className="w-full">
          <h2 className="mb-[10px]">날짜 선택</h2>
          <DatePickerCalendar
            className="w-full md:w-[245px]"
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
