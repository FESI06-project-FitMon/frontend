import { create } from 'zustand';
interface DetailStates {
  currentTab: string;
  setCurrentTab: (currentTab: string) => void;
  captainStatus: boolean;
  setCaptainStatus: (captainStatus: boolean) => void;
  gatheringGuestbookCount: number;
  setGatheringGuestbookCount: (count: number) => void;
}
export const useDetailStore = create<DetailStates>((set) => ({
  currentTab: 'string',
  setCurrentTab: (currentTab: string) => set({ currentTab: currentTab }),
  captainStatus: false,
  setCaptainStatus: (captainStatus: boolean) =>
    set({ captainStatus: captainStatus }),
  gatheringGuestbookCount: 0,
  setGatheringGuestbookCount: (count: number) =>
    set({ gatheringGuestbookCount: count }),
}));
