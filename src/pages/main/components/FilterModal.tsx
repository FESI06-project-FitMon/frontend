import { useState } from 'react';
import Modal from '@/components/dialog/Modal';
import Select, { SelectItem } from '@/components/common/Select';
import cityData from '@/constants/city';
import { SelectType } from '@/stores/useSelectStore';
import DatePickerCalendar from '@/components/common/DatePicker';
import Button from '@/components/common/Button';

interface FilterModalProps {
  setShowFilterModal: () => void;
}

export default function FilterModal({ setShowFilterModal }: FilterModalProps) {
  const [selectedSort, setSelectedSort] = useState<string>('마감임박순');
  const [selectedSi, setSelectedSi] = useState<string>(''); // 시/도 선택 상태
  const [selectedGu, setSelectedGu] = useState<string>(''); // 군/구 선택 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 날짜 선택 상태 추가 ✅

  const buttonActive = 'bg-dark-600';

  // 시/도 목록 생성
  const placeSiItems: SelectItem[] = Object.keys(cityData).map((city) => ({
    value: city,
    label: city,
  }));

  // 선택된 시/도에 따른 군/구 목록 생성
  const placeGuItems: SelectItem[] = selectedSi
    ? cityData[selectedSi]?.map((gu) => ({
        value: gu.value,
        label: gu.label,
      })) || []
    : [];

  // 시/도 선택 핸들러
  const handleSiChange = (value: string) => {
    setSelectedSi(value);
    setSelectedGu(''); // 시가 변경되면 군/구 초기화
  };

  return (
    <Modal onClose={setShowFilterModal} title="필터 및 정렬">
      <div>
        <h2 className="mt-[30px] mb-[10px] text-lg font-semibold">모임 정보</h2>
        <div className="flex gap-2.5">
          <button
            className={`py-2 px-6 rounded-[10px] transition-colors bg-dark-400 ${
              selectedSort === '마감임박순' ? buttonActive : ''
            }`}
            onClick={() => setSelectedSort('마감임박순')}
          >
            마감임박순
          </button>
          <button
            className={`py-3 px-6 rounded-[10px] transition-colors bg-dark-400 ${
              selectedSort === '참여인원순' ? buttonActive : ''
            }`}
            onClick={() => setSelectedSort('참여인원순')}
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
            selectedItem={selectedSi || ''}
            setSelectedItem={handleSiChange}
            className="mr-[10px] w-full min-w-[100px] md:w-[175px]"
            currentSelectType={SelectType.DETAIL_EDIT_MODAL_PLACE_SI}
            width="200px"
            height="47px"
          />
          <Select
            items={placeGuItems}
            selectedItem={selectedGu || ''}
            setSelectedItem={setSelectedGu}
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
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            minDate={undefined}
          />
        </div>
      </div>

      <Button
        name={'적용'}
        handleButtonClick={setShowFilterModal}
        style={'default'}
        className="w-full h-[52px] block mt-6"
      />
    </Modal>
  );
}
