import { useState } from 'react';
import { GetServerSideProps } from 'next';
import CardList from '@/components/card/gathering/CardList';
import Button from '@/components/common/Button';
import Tab from '@/components/common/Tab';
import SubTag from '@/components/tag/SubTag';
import ListChallenge from '@/pages/main/components/ListChallenge';
import {
  LISTPAGE_MAINTYPE,
  LISTPAGE_SUBTYPE,
  MainType,
} from '@/constants/MainList';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
  DehydratedState,
} from '@tanstack/react-query';
import CreateGathering from './main/components/CreateGatheringModal';
import useMemberStore from '@/stores/useMemberStore';
import Alert from '@/components/dialog/Alert';
import { useRouter } from 'next/router';
import { prefetchGatheringList } from '@/pages/main/service/gatheringService';

interface HomeProps {
  dehydratedState: DehydratedState;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await prefetchGatheringList(queryClient, '전체', '전체', 6);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home({ dehydratedState }: HomeProps) {
  const [mainType, setMainType] = useState<MainType>('전체');
  const [subType, setSubType] = useState('전체');
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { isLogin } = useMemberStore();
  const router = useRouter();

  const handleCreateButton = () => {
    if (isLogin) {
      setShowModal(true);
    } else {
      setShowAlert(true);
    }
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    router.push('/login');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 pt-[30px] md:pt-[50px] lg:pt-20">
      <h2 className="text-xl md:text-[1.75rem] font-semibold pb-5 md:pb-[30px]">
        지금 핫한 챌린지 🔥
      </h2>

      <div className="overflow-hidden">
        <ListChallenge />
      </div>

      <div className="w-full mt-[30px] md:mt-[50px] lg:mt-20">
        <Tab
          items={LISTPAGE_MAINTYPE}
          currentTab={mainType}
          onTabChange={(newTab) => {
            setMainType(newTab as MainType);
            setSubType('전체');
          }}
          rightElement={
            <div className="hidden lg:flex w-full justify-end">
              <Button
                style="custom"
                name="모임 만들기"
                className="text-base my-2 h-9 w-[126px]"
                handleButtonClick={handleCreateButton}
              />
            </div>
          }
        />
        {/* 모바일/태블릿용 고정 버튼 */}
        <div className="lg:hidden fixed right-6 bottom-10 z-50">
          <Button
            style="custom"
            name="모임 만들기"
            className="text-base h-9 w-[126px]"
            handleButtonClick={handleCreateButton}
          />
        </div>

        {showModal && (
          <CreateGathering setShowModal={() => setShowModal(false)} />
        )}
      </div>

      <div className="my-5 lg:my-[35px]">
        {mainType !== '전체' && (
          <SubTag
            tags={LISTPAGE_SUBTYPE[mainType]}
            currentTag={subType}
            onTagChange={(newTag) => setSubType(newTag)}
          />
        )}
      </div>

      <div className="pb-20">
        <HydrationBoundary state={dehydratedState}>
          <CardList mainType={mainType} subType={subType} />
        </HydrationBoundary>
      </div>

      {/* 알럿 컴포넌트 */}
      {showAlert && (
        <Alert
          isOpen={showAlert}
          type="confirm"
          message="로그인이 필요합니다."
          onConfirm={handleAlertConfirm}
          onCancel={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
