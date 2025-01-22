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
    items.find((item) => item.value === selectedItem)?.label || '선택';

  return (
    <div className={`${className} w-[${width}] h-[${height}] z-[100] relative`}>
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
        <ul className="absolute top-full w-full max-h-[200px] overflow-y-auto bg-dark-400 rounded-[8px] border border-dark-500 z-10">
          {items.map((item, index) => (
            <li
              className={`w-full px-5 py-2 cursor-pointer hover:bg-gray-700 ${
                item.value === selectedItem ? 'text-primary' : ''
              }`}
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
