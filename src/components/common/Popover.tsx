import Image from 'next/image';
import { useState } from 'react';

interface PopoverProps {
  items: Array<PopoverItem>;
  type: 'setting' | 'dot' | 'user';
}

interface PopoverItem {
  id: string;
  label: string;
  onClick?: () => void;
}
export default function Popover({ items, type }: PopoverProps) {
  const [showPopover, setShowPopover] = useState(false);
  const itemsStyle = () => {
    let style =
      'flex flex-col absolute mt-[10px] z-10 top-full px-[27px] py-[12px] w-max bg-dark-300 rounded-[10px] gap-[14px]';
    if (showPopover) {
      style += ' flex';
    } else {
      style += ' hidden';
    }
    return style;
  };
  return (
    <div className="relative flex flex-col items-center justify-center">
      {type === 'user' ? (
        <div
          onClick={() => setShowPopover(!showPopover)}
          className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center"
        >
          <svg
            className="h-5 w-5 text-gray-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      ) : (
        <Image
          onClick={() => setShowPopover(!showPopover)}
          src={`/assets/image/${type === 'setting' ? 'setting.svg' : 'three-dots.svg'}`}
          width={type === 'setting' ? 28 : 20}
          height={type === 'setting' ? 28 : 20}
          alt="popover-button"
          className=" hover:cursor-pointer"
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
