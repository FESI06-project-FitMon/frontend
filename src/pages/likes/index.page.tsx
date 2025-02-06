import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';
import { useState } from 'react';
import LikesGatheringsList from './components/LikesGatheringsList';
import { Metadata } from '@/components/common/Metadata';

export default function LikesGatherings() {
  // 메인타입, 서브타입 상태
  const [mainType, setMainType] = useState<MainType>('전체');
  const [subType, setSubType] = useState('전체');

  return (
    <>
      <Metadata
        title="찜한 모임 페이지"
        description="FitMon에서 관심있는 모임을 모아 볼 수 있는 페이지입니다."
      />
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pt-[30px] md:pt-[50px] lg:pt-20">
        {/* 메인 타입 탭 */}
        <div>
          <Tab
            items={LISTPAGE_MAINTYPE}
            currentTab={mainType}
            onTabChange={(newTab) => {
              setMainType(newTab as MainType);
              setSubType('전체'); // 메인 타입 변경 시 서브 타입 초기화
            }}
          />
        </div>

        {/* 서브 타입 태그 */}
        <div className="mt-7">
          {mainType !== '전체' && (
            <SubTag
              tags={LISTPAGE_SUBTYPE[mainType]}
              currentTag={subType}
              onTagChange={(newTag) => setSubType(newTag)}
            />
          )}
        </div>

        {/* 모임 카드 리스트 */}
        <div className="mt-7 pb-20">
          <LikesGatheringsList mainType={mainType} subType={subType} />
        </div>
      </div>
    </>
  );
}
