import Image from 'next/image';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function Modal({ children, title, onClose }: ModalProps) {
  const CloseButton = () => (
    <Image
      className="cursor-pointer"
      onClick={onClose}
      src="/assets/image/modal-close.svg"
      width={24}
      height={24}
      alt="modal-close"
    />
  );

  return createPortal(
    <div
      className="bg-black/50 w-full h-full z-[10000] fixed inset-0 flex items-center justify-center overflow-y-scroll"
      onClick={onClose}
    >
      <div
        className="bg-dark-300 rounded-[10px] w-full h-auto md:h-auto md:max-w-[560px] relative px-[15px] md:px-[30px] py-[35px] md:mt-10"
        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일 레이아웃 */}
        <div className="w-full h-full flex flex-col md:block">
          {/* 모바일 헤더 */}
          <div className="md:hidden relative">
            <div className="absolute top-0 right-0">
              <CloseButton />
            </div>
          </div>

          {/* 모바일 컨텐츠 영역 */}
          <div className="flex-1 flex flex-col justify-center items-center md:block">
            {/* 모바일 타이틀 */}
            <h2 className="text-xl font-bold text-center mb-[20px] md:hidden">
              {title}
            </h2>

            {/* 데스크탑 헤더 */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-center w-full">
                  {title}
                </h2>
                <div className="absolute top-[35px] right-[30px]">
                  <CloseButton />
                </div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="w-full md:mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('aside-root')!,
  );
}
