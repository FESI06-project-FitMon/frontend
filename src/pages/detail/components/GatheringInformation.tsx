import Image from 'next/image';
import TagList from './tag';
import Popover from '@/components/common/Popover';
import { useState } from 'react';
import Alert from '@/components/dialog/Alert';
import Modal from '@/components/dialog/Modal';
import GatheringEditModal from './GatheringEditModal';
import getDatePart from '@/utils/getDatePart';
import useToastStore from '@/stores/useToastStore';
import { AxiosError } from 'axios';
import { GatheringDetailType } from '@/types';
import { useGatheringDelete } from '../service/gatheringService';
import { useQueryClient } from '@tanstack/react-query';

export default function GatheringInformation({
  gathering,
}: {
  gathering: GatheringDetailType;
}) {
  const showToast = useToastStore((state) => state.show);
  const [showSelectAlert, setShowSelectAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutate } = useGatheringDelete(gathering.gatheringId, queryClient);
  const popoverItems = [
    {
      id: 'edit',
      label: '수정하기',
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      id: 'cancel',
      label: '취소하기',
      onClick: () => {
        setShowSelectAlert(true);
      },
    },
  ];

  const handleDeleteConfirmButtonClick = async () => {
    try {
      mutate();
      setShowSelectAlert(false);
      showToast('모임을 취소했습니다.', 'check');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        showToast(axiosError.response.data.message, 'error');
      }
    }
  };
  const handleDeleteCancelButtonClick = () => {
    setShowSelectAlert(false);
  };

  if (!gathering) {
    return (
      <div className="h-[480px]">
        <p>Loading..</p>
      </div>
    );
  }

  return (
    <div id="gathering-information" className="w-full">
      <div id="type-information">
        <div className="flex mt-20 gap-[10px]s">
          <p className="text-base md:text-lg font-semibold">
            {gathering.mainType ?? ''}
          </p>
          <Image
            src="/assets/image/arrow-right.svg"
            alt="arrow"
            width={12}
            height={12}
          />
          <p className="text-primary text-base md:text-lg font-semibold">
            {gathering.subType}
          </p>
        </div>
      </div>
      <div id="image-and-description" className="md:flex mt-[30px]">
        <Image
          width={280}
          height={300}
          alt="gathering-image"
          src={
            gathering.imageUrl ? gathering.imageUrl : '/assets/image/fitmon.png'
          }
          className="w-full h-[186px] rounded-[20px] object-cover md:w-[280px] md:h-[260px] lg:h-[300px] md:mr-5 lg:mr-[50px] sm:mb-5 md:mb-0"
        />
        <div id="detail-information" className="w-full">
          <div className="flex justify-between items-center">
            {' '}
            <h3 className="text-xl md:text-2xl lg:text-[1.75rem] font-semibold h-12 md:h-[58px] lg:h-auto align-center">
              {gathering.title}
            </h3>
            {gathering.captainStatus && (
              <>
                <Popover items={popoverItems} type="setting" />
                <Alert
                  isOpen={showSelectAlert}
                  type="select"
                  message="모임을 취소하시겠습니까?"
                  onConfirm={handleDeleteConfirmButtonClick}
                  onCancel={handleDeleteCancelButtonClick}
                />
              </>
            )}
            {showModal && (
              <Modal
                onClose={() => setShowModal(false)}
                title="모임 정보를 입력해주세요."
              >
                <GatheringEditModal
                  information={gathering}
                  gatheringId={gathering.gatheringId}
                  setIsModalOpen={setShowModal}
                />
              </Modal>
            )}
          </div>

          <p className="text-sm md:text-base lg:text-[1.125rem] text-dark-700 mt-[10px] lg:mt-4 h-[24px] md:h-12 lg:h-auto">
            {gathering.description}
          </p>

          <div id="tags" className="mt-[15px] lg:mt-[25px]">
            <TagList tagList={gathering.tags} />
          </div>
          <div
            id="range-and-place"
            className="w-full mt-5 lg:py-[30px] lg:bg-dark-200 rounded-[20px]"
          >
            <div id="range" className="flex items-center mb-[8px]">
              <Image
                src="/assets/image/time.svg"
                width={14}
                height={14}
                alt="time"
                className="lg:ml-[25px] mr-3 lg:mr-2"
              />
              <h1 className="font-semibold text-base lg:text-lg">
                {'모임 기간'}
              </h1>
              <p className="bg-dark-500 h-[12px] w-[1px] mx-[15px]"></p>{' '}
              <p className="text-lg">{`${getDatePart(gathering.startDate)}~${getDatePart(gathering.endDate)}`}</p>
            </div>
            <div id="place" className="flex items-center">
              <Image
                src="/assets/image/place.svg"
                width={14}
                height={14}
                alt="place"
                className="lg:ml-[25px] mr-3 lg:mr-2"
              />
              <h1 className="font-semibold text-lg">{'모임 장소'}</h1>
              <p className="bg-dark-500 h-[12px] w-[1px] mx-[15px]"></p>
              <p className="text-lg">{`${gathering.mainLocation} ${gathering.subLocation}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
