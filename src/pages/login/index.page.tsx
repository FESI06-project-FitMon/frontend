import LoginForm from './components/LoginForm';

export default function Login() {
  return (
    <div className="w-full h-[calc(100vh-81px)] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[640px] md:min-w-[640px]">
        <h1 className="mb-7 md:mb-12 text-[1.5rem] md:text-[2.25rem] font-medium">
          {'로그인'}
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
