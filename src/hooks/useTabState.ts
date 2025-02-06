// hooks/useTabState.ts
import { useState } from 'react';
import type { TabItem } from '@/types';

interface UseTabStateProps {
  tabs: TabItem[];
  storageKey: string;
}

export default function useTabState({ tabs, storageKey }: UseTabStateProps) {
  const [currentTab, setCurrentTab] = useState<TabItem['id']>(() => {
    if (typeof window !== 'undefined') {
      // localStorage -> sessionStorage로 변경
      return sessionStorage.getItem(storageKey) as TabItem['id'] || tabs[0].id;
    }
    return tabs[0].id;
  });

  const handleTabChange = (id: TabItem['id']) => {
    setCurrentTab(id);
    // localStorage -> sessionStorage로 변경
    sessionStorage.setItem(storageKey, id);
  };

  return {
    currentTab,
    handleTabChange
  };
}