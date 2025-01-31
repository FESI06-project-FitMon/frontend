import Image from 'next/image';
import { useState } from 'react';

interface PopoverProps {
  items: Array<PopoverItem>;
  type: 'setting' | 'dot' | 'user';
  children?: React.ReactNode;  // 추가
}

interface PopoverItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export default function Popover({ items, type, children }: PopoverProps) {
  const [showPopover, setShowPopover] = useState(false);

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const itemsStyle = () => {
    let style =
      'flex flex-col absolute mt-[10px] z-10 top-full px-[27px] py-[12px] w-max bg-dark-300 rounded-[10px] gap-[14px]';
    style += showPopover ? ' flex' : ' hidden';
    return style;
  };

  return (
    <div className="relative flex flex-col items-end lg:items-center justify-center">
      {/* children이 존재하면 그걸 클릭 가능한 요소로 사용 */}
      {children ? (
        <div onClick={togglePopover} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Image
          onClick={togglePopover}
          src={`/assets/image/${type === 'setting' ? 'setting.svg' : 'three-dots.svg'}`}
          width={type === 'setting' ? 28 : 20}
          height={type === 'setting' ? 28 : 20}
          alt="popover-button"
          className="hover:cursor-pointer"
        />
      )}

      <ul className={itemsStyle()}>
        {items.map((item: PopoverItem, index: number) => (
          <li
            className="text-sm hover:cursor-pointer"
            key={index}
            onClick={() => {
              setShowPopover(false);
              item.onClick?.();
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
