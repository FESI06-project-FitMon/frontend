import { getMonth, getYear } from 'date-fns';
import Image from 'next/image';
import DatePicker from 'react-datepicker';

interface DatePickerCalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  className?: string;
  width?: string;
  height?: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function DatePickerCalendar({
  selectedDate,
  setSelectedDate,
  className,
  width = '245px',
  height,
  minDate = new Date(), // 최소 날짜를 현재 시간으로 설정
  maxDate,
}: DatePickerCalendarProps) {
  const YEARS = Array.from(
    { length: getYear(new Date()) + 1 - 2000 },
    (_, i) => getYear(new Date()) - i,
  );
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div
      className={`relative flex items-center bg-dark-400 border-[1px] border-dark-500 rounded-[8px] ${className} w-[${width}] h-[${height}]`}
    >
      <DatePicker
        className="datepicker"
        dateFormat="yyyy-MM-dd" // 시간 관련 포맷 제거
        minDate={minDate} // 최소 날짜
        maxDate={maxDate} // 최대 날짜
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date!)}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="datepicker__header">
            <div className={`flex justify-between items-center w-[${width}]`}>
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <Image
                  src="/assets/image/calendar-arrow-left.svg"
                  width={24}
                  height={24}
                  alt="arrow"
                />
              </button>
              <div className="flex my-[6.5px] gap-[5px]">
                <span className="bg-dark-500">{MONTHS[getMonth(date)]}</span>
                <select
                  className="bg-transparent select-none appearance-none"
                  value={getYear(date)}
                  onChange={({ target: { value } }) => changeYear(+value)}
                >
                  {YEARS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                <Image
                  src="/assets/image/calendar-arrow-right.svg"
                  width={24}
                  height={24}
                  alt="arrow"
                />
              </button>
            </div>
          </div>
        )}
      />
      <div className="absolute right-0 flex items-center px-5">
        <Image
          src="/assets/image/calendar.svg"
          width={20}
          height={20}
          alt="calendar"
          className="flex"
        />
      </div>
    </div>
  );
}
