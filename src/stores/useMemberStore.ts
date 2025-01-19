import { create } from 'zustand';

interface memberStates {
  isLogin: boolean;
  user: {
    memberId: number;
    nickName: string;
    email: string;
    profileImageUrl: string | null;
  };
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: {
    memberId: number;
    nickName: string;
    email: string;
    profileImageUrl: string | null;
  }) => void;
}
const useMemberStore = create<memberStates>((set) => ({
  isLogin: false,
  user: {
    memberId: 0,
    nickName: '',
    email: '',
    profileImageUrl: null,
  },
  setIsLogin: (isLogin: boolean) => set({ isLogin: isLogin }),
  setUser: (user) => set({ user: user }),
}));

export default useMemberStore;
