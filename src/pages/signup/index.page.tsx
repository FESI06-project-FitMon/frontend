import { Metadata } from '@/components/common/Metadata';
import SignupForm from './components/SignupForm';

export default function Signup() {
  return (
    <>
      <Metadata
        title="회원가입"
        description="회원가입을 통해 FitMon의 회원이 되어보세요!"
      />
      <div className="w-full min-h-[calc(100vh-81px)] flex justify-center pt-[140px]">
        <div className="flex flex-col justify-center items-center w-full max-w-[640px] md:min-w-[640px]">
          <h1 className="mb-7 md:mb-12 text-[1.5rem] md:text-[2.25rem] font-medium">
            {'회원가입'}
          </h1>
          <SignupForm />
        </div>
      </div>
    </>
  );
}
