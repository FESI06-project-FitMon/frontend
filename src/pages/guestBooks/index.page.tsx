import Preparing from '@/components/common/Preparing';

export default function guestBooks() {
  return (
    <div className="w-full h-[calc(100vh-100px)] relative">
      <Preparing isVisible={true} message="준비 중인 서비스입니다..." />{' '}
    </div>
  );
}
