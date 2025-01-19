// hooks/useTabState.ts
import { useState} from 'react';
import type { TabItem } from '@/types';

interface UseTabStateProps {
  tabs: TabItem[];
  storageKey: string;
}

export default function useTabState({ tabs, storageKey }: UseTabStateProps) {
  const [currentTab, setCurrentTab] = useState<TabItem['id']>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) as TabItem['id'] || tabs[0].id;
    }
    return tabs[0].id;
  });

  const handleTabChange = (id: TabItem['id']) => {
    setCurrentTab(id);
    localStorage.setItem(storageKey, id);
  };

  return {
    currentTab,
    handleTabChange
  };
}