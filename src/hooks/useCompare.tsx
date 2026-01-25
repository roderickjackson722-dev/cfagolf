import { createContext, useContext, useState, ReactNode } from 'react';
import { College } from '@/types/college';

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (collegeId: string) => void;
  isInCompare: (collegeId: string) => boolean;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (college: College) => {
    if (compareList.length >= MAX_COMPARE) return;
    if (!compareList.find(c => c.id === college.id)) {
      setCompareList(prev => [...prev, college]);
    }
  };

  const removeFromCompare = (collegeId: string) => {
    setCompareList(prev => prev.filter(c => c.id !== collegeId));
  };

  const isInCompare = (collegeId: string) => {
    return compareList.some(c => c.id === collegeId);
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
