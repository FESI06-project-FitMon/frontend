import { TabItem } from '@/types';

interface SubTagProps {
  tags: TabItem[];
  currentTag: string;
  onTagChange: (id: TabItem['id']) => void; // 여기도 마찬가지
  className?: string;
}
export default function SubTag({
  tags,
  currentTag,
  onTagChange,
  className = '',
}: SubTagProps) {
  const handleTagClick = (id: TabItem['id']) => {
    // 여기도 수정
    onTagChange(id);
  };
  return (
    <div className={`${className}`}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag.id)}
          className={`
                px-3 md:px-6 py-1 md:py-2 text-[0.81rem] md:text-base mr-[10px] font-bold text-white rounded-[50px]
                ${currentTag === tag.id ? 'bg-primary' : 'bg-dark-500'}
              `}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
