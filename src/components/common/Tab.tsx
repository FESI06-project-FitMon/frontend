import type { TabItem } from '@/types/index';

interface TabProps {
  items: TabItem[];
  currentTab: TabItem['id']; // id 타입을 TabItem에서 참조
  onTabChange: (id: TabItem['id']) => void; // 여기도 마찬가지
  className?: string;
  rightElement?: React.ReactNode;
}

export default function Tab({
  items,
  currentTab,
  onTabChange,
  className = '',
  rightElement, //버튼 만드는 조건 탭바 오른쪽에 버튼 생김
}: TabProps) {
  const handleTabClick = (id: TabItem['id']) => {
    // 여기도 수정
    console.log('click');
    onTabChange(id);
  };

  return (
    <div className={` ${className}`}>
      <div className="w-full flex items-center justify-between">
      <div
          className={`flex w-full ${
            'sm:border-b-[2px] sm:border-dark-400 sm:justify-start' 
          } justify-center`} //모바일에선 검정선 안보이고, 가운데 정렬렬
        >
          <div className="flex">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                //모바일 글씨 크기 14px, 넓이 100
                className={`
                  pb-[15px] text-sm sm:text-lg lg:text-lg font-bold 
                  min-w-[100px] sm:min-w-[140px] 
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
            <div className="flex items-center px-4 ml-auto">{rightElement}</div>
          )}
        </div>
      </div>
    </div>
  );
}
