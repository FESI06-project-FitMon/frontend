import type { TabItem } from '@/types/index';

interface TabProps {
  items: TabItem[];
  currentTab: TabItem['id']; // id 타입을 TabItem에서 참조
  onTabChange: (id: TabItem['id']) => void; // 여기도 마찬가지
  className?: string;
  rightElement?: React.ReactNode;
}

export default function zTab({
  items,
  currentTab,
  onTabChange,
  className = '',
  rightElement, //버튼 만드는 조건 탭바 오른쪽에 버튼 생김
}: TabProps) {
  const handleTabClick = (id: TabItem['id']) => {
    onTabChange(id);
  };

  return (
    <div className={`${className}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex w-full md:border-b-[2px] border-dark-400">
          <div className="flex w-full justify-start">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  pb-[15px] text-sm md:text-lg lg:text-lg font-bold
                  min-w-[90px] md:min-w-[140px]
                  border-b-[2px] z-20
                  ${
                    currentTab === item.id
                      ? 'text-primary border-primary -mb-[2px]'
                      : 'text-dark-700 border-dark-700 -mb-[2px]'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
          {rightElement && (
            <div className="w-full justify-end flex absolute items-center px-4 ml-auto">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
