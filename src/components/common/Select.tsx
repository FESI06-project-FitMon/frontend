import useSelectStore, { SelectType } from '@/stores/useSelectStore';
import Image from 'next/image';

interface SelectProps {
  items: Array<SelectItem>;
  setSelectedItem: (itemValue: string) => void;
  selectedItem: string;
  className?: string;
  width: string;
  height: string;
  currentSelectType: SelectType | null;
}

export interface SelectItem {
  value: string;
  label: string;
}

export default function Select({
  items,
  selectedItem,
  setSelectedItem,
  width,
  height,
  className = '',
  currentSelectType,
}: SelectProps) {
  // const [open, setOpen] = useState(false);
  const { selectType, setSelectType, open, setOpen } = useSelectStore();
  const handleOptionClick = (value: string) => {
    setSelectType(null);
    setOpen(false);
    setSelectedItem(value);
  };

  const handleOptionLabelClick = () => {
    if (selectType === currentSelectType) {
      setOpen(!open);
      return;
    }
    setOpen(false);
    setSelectType(currentSelectType);
    setOpen(true);
  };
  const currentLabel =
    items.find((item) => item.value === selectedItem)?.label || '선택하세요';
  const itemStyle = (value: string) => {
    let style = ` w-[${width}] h-[${height}] relative flex items-center top-full bg-dark-400 rounded-[8px] border-[1px]  px-5`;
    if (value === selectedItem) {
      style += ' border-[#FF7487]';
    } else {
      style += ' border-dark-500';
    }
    return style;
  };

  return (
    <div className={`${className} w-[${width}] h-[${height}] z-[100] `}>
      <div
        onClick={() => handleOptionLabelClick()}
        className={`w-full h-[${height}] flex items-center justify-between bg-dark-400 rounded-[8px] border-[1px] border-dark-500 px-5  ${className}`}
      >
        <p>{currentLabel}</p>
        <Image
          src={
            open && currentSelectType === selectType
              ? '/assets/image/arrow-up.svg'
              : '/assets/image/arrow-down.svg'
          }
          alt="arrow"
          width={16}
          height={16}
        />
      </div>
      {open && selectType === currentSelectType && (
        <ul>
          {items.map((item, index) => (
            <li
              className={`w-[${width}] h-[${height}] ${itemStyle(item.value)}`}
              key={index}
              value={item.value}
              onClick={() => handleOptionClick(item.value)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
