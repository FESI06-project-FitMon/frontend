import Navigation from './Navigation';
import SideBar from './Sidebar';
import Toast from '@/components/dialog/Toast';
import useToastStore from '@/stores/useToastStore';
import AdPopup from '@/components/dialog/AdPopup';  // 추가

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isVisible, message, type, setIsVisible } = useToastStore();
  
  return (
    <div className="min-h-screen">
      <SideBar />
      <Navigation />
      <main>{children}</main>
      <Toast
        isOpen={isVisible}
        setIsOpen={setIsVisible}
        type={type}
        message={message}
      />
      <AdPopup />  {/* 여기에 추가 */}
    </div>
  );
}