import Image from 'next/image';
import TagList from './tag';
import Popover from '@/components/common/Popover';
import { useState } from 'react';
import Alert from '@/components/dialog/Alert';
import Modal from '@/components/dialog/Modal';
import GatheringEditModal from './GatheringEditModal';
import { GatheringDetail } from '@/stores/useGatheringStore';
import getDatePart from '@/utils/getDatePart';

export default function GatheringInformation({
  gathering,
}: {
  gathering: GatheringDetail;
}) {
  const [showSelectAlert, setShowSelectAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  if (!gathering) {
    return <div>{'Loading..'}</div>;
  }

  const popoverItems = [
    {
      id: 'edit',
      label: '수정하기',
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      id: 'delete',
      label: '삭제하기',
      onClick: () => {
        setShowSelectAlert(true);
      },
    },
  ];
  const handleDeleteConfirmButtonClick = () => {
    setShowModal(true);
  };

  const handleDeleteCancelButtonClick = () => {
    setShowSelectAlert(false);
  };
  return (
    <div id="gathering-information" className="w-full">
      <div id="type-information">
        <div className="flex mt-20 gap-[10px]">
          <p className="text-lg font-semibold">{gathering.mainType ?? ''}</p>
          <Image
            src="/assets/image/arrow-right.svg"
            alt="arrow"
            width={12}
            height={12}
          />
          <p className="text-primary text-lg font-semibold">
            {gathering.subType}
          </p>
        </div>
      </div>
      <div id="image-and-description" className="flex mt-[30px]">
        <Image
          width={280}
          height={300}
          alt="gathering-image"
          src={
            gathering.imageUrl ? gathering.imageUrl : '/assets/image/fitmon.png'
          }
          className="rounded-[20px] mr-[50px] w-[280px] h-[300px] object-cover"
        />
        <div id="detail-information" className=" w-full">
          <div className="flex justify-between">
            {' '}
            <h3 className="text-[1.75rem] font-semibold">{gathering.title}</h3>
            {gathering.captainStatus && (
              <>
                <Popover items={popoverItems} type="setting" />
                <Alert
                  isOpen={showSelectAlert}
                  type="select"
                  message="모임을 삭제하시겠습니까?"
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

          <p className="text-[1.125rem] text-dark-700 mt-[3px]">
            {gathering.description}
          </p>
          <div id="tags" className="mt-5">
            <TagList tagList={gathering.tags} />
          </div>
          <div
            id="range-and-place"
            className="w-full mt-[25px] py-[30px] bg-dark-200 rounded-[20px]"
          >
            <div id="range" className="flex items-center mb-[8px]">
              <Image
                src="/assets/image/time.svg"
                width={14}
                height={14}
                alt="time"
                className="ml-[25px] mr-2"
              />
              <h1 className="font-semibold text-lg">{'모임 기간'}</h1>
              <p className="bg-dark-500 h-[12px] w-[1px] mx-[15px]"></p>{' '}
              <p className="text-lg">{`${getDatePart(gathering.startDate)}~${getDatePart(gathering.endDate)}`}</p>
            </div>
            <div id="place" className="flex items-center">
              <Image
                src="/assets/image/place.svg"
                width={14}
                height={14}
                alt="place"
                className="ml-[25px] mr-2"
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
