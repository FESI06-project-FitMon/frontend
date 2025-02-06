interface TagProps {
  tagName: string;
}

interface TagListProps {
  tagList: string[];
}
export function Tag({ tagName }: TagProps) {
  return (
    <div className="px-[19px] py-[7px] lg:px-[20px] lg:py-[10px] bg-dark-200 flex justify-center items-center rounded-full">
      <p className="text-primary text-sm lg:text-base font-semibold">{`#${tagName}`}</p>
    </div>
  );
}

export default function TagList({ tagList }: TagListProps) {
  if (!tagList) return;
  return (
    <>
      <div className="flex gap-[5px] lg:gap-2">
        {tagList.map((tag, index) => (
          <Tag key={index} tagName={tag} />
        ))}
      </div>
    </>
  );
}
