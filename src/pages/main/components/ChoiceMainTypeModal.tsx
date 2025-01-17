import Image from 'next/image';
import { useState } from 'react';
import { LISTPAGE_MAINTYPE } from '@/constants/MainList';

interface ChoiceMainTypeModalProps {
  onSelect: (type: string, subType: string) => void; // 서브타입도 전달
}

export default function ChoiceMainTypeModal({
  onSelect,
}: ChoiceMainTypeModalProps) {
  const [selectedType, setSelectedType] = useState<string>('유산소형');
  const [selectedSubType, setSelectedSubType] = useState<string>('달리기');

  // 이미지 매핑
  const images: { [key: string]: string } = {
    유산소형: '/assets/image/cardio.png',
    헬스형: '/assets/image/naerobic.png',
    경기형: '/assets/image/game.png',
  };

  // 서브타입 매핑
  const subTypes: { [key: string]: string[] } = {
    유산소형: ['달리기', '수영', '자전거', '기타'],
    헬스형: ['헬스', '기타'],
    경기형: ['축구', '배드민턴', '풋살', '기타'],
  };

  return (
    <div>
      {/* 메인 타입 선택 */}
      <div className="flex gap-3 mb-5">
        {LISTPAGE_MAINTYPE.map((type) => {
          if (type.id === '전체') return null;

          return (
            <div
              key={type.id}
              className={`relative w-40 h-44 rounded-xl text-center py-5 px-2 cursor-pointer border ${
                selectedType === type.id
                  ? 'bg-dark-600 border-dark-700'
                  : 'bg-dark-400 border-transparent'
              }`}
              onClick={() => {
                setSelectedType(type.id);
                setSelectedSubType(subTypes[type.id]?.[0] || ''); // 첫 번째 서브타입 선택
                onSelect(type.id, subTypes[type.id]?.[0] || ''); // 메인 타입과 서브타입 전달
              }}
            >
              {selectedType === type.id && (
                <div className="absolute top-2 right-2">
                  <Image
                    width={16}
                    height={16}
                    src="/assets/image/check.svg"
                    alt="선택됨"
                  />
                </div>
              )}
              <Image
                width={45}
                height={72}
                src={images[type.id] || '/assets/image/default.png'}
                alt={`${type.label} 이미지`}
                className="mx-auto"
              />
              <h3 className="font-bold text-lg pt-3.5">{type.label}</h3>
              <p className="text-sm pt-[5px]">
                {type.id === '유산소형' && '달리기, 수영, 자전거, 기타'}
                {type.id === '헬스형' && '헬스, 기타'}
                {type.id === '경기형' && '축구, 배드민턴, 풋살, 기타'}
              </p>
            </div>
          );
        })}
      </div>

      {/* 서브타입 선택 */}
      <div className="flex gap-3">
        {subTypes[selectedType]?.map((subType) => (
          <button
            key={subType}
            className={`px-4 py-2 rounded-lg outline-none border-dark-400 ${
              selectedSubType === subType
                ? 'bg-primary text-white'
                : 'bg-dark-400 text-dark-700'
            }`}
            onClick={() => {
              setSelectedSubType(subType);
              onSelect(selectedType, subType); // 메인 타입과 서브타입 전달
            }}
          >
            {subType}
          </button>
        ))}
      </div>
    </div>
  );
}
