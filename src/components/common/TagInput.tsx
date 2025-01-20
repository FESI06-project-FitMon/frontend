import { useState } from 'react';
import Image from 'next/image';
import useToastStore from '@/stores/useToastStore';

interface TagInputProps {
  initialTags?: string[]; // 초기 태그
  maxTags?: number; // 최대 태그 개수
  onTagsChange: (tags: string[]) => void; // 태그 변경 콜백
}

export default function TagInput({
  initialTags = [],
  maxTags = 3,
  onTagsChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);

  const showToast = useToastStore((state) => state.show);

  const handleTagDelete = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    onTagsChange(updatedTags); // 부모에 업데이트
  };

  const handleTagAdd = (newTag: string) => {
    if (!newTag.trim()) return;
    if (tags.length >= maxTags) {
      showToast(`태그는 최대 ${maxTags}개까지 추가 가능합니다.`, 'caution');
      return;
    }
    if (tags.includes(newTag)) {
      showToast('이미 추가된 태그입니다.', 'caution');
      return;
    }
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    onTagsChange(updatedTags); // 부모에 업데이트
  };

  return (
    <div>
      <div className="h-[47px] rounded-[8px] border border-dark-500 bg-dark-400 flex items-center gap-[10px] px-5 overflow-auto">
        {tags.map((tag) => (
          <div
            key={tag}
            className="h-[30px] px-3 py-1 bg-dark-200 rounded-[10px] flex items-center gap-2 "
          >
            <p className="text-primary text-sm text-nowrap">{`#${tag}`}</p>
            <button onClick={() => handleTagDelete(tag)}>
              <Image
                src="/assets/image/cancel-tag.svg"
                width={11}
                height={11}
                alt="delete"
              />
            </button>
          </div>
        ))}
        <input
          type="text"
          className="bg-transparent outline-none flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              handleTagAdd(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}
