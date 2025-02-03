import Modal from '@/components/dialog/Modal';

interface FilterModalProps {
  setShowFilterModal: () => void;
}

export default function FilterModal({ setShowFilterModal }: FilterModalProps) {
  return (
    <Modal onClose={setShowFilterModal} title="필터 및 정렬을 선택해주세요">
      꺄아아아
    </Modal>
  );
}
