import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SegmentType } from 'shared';

interface FilterContextType {
  segmentType: SegmentType | undefined;
  segmentValue: string | undefined;
  pendingSegmentType: SegmentType | undefined;
  pendingSegmentValue: string | undefined;
  setSegmentType: (type: SegmentType | undefined) => void;
  setSegmentValue: (value: string | undefined) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  isFiltersApplied: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current filter state (applied)
  const [segmentType, setSegmentTypeState] = useState<SegmentType | undefined>(undefined);
  const [segmentValue, setSegmentValueState] = useState<string | undefined>(undefined);
  
  // Pending filter state (not yet applied)
  const [pendingSegmentType, setPendingSegmentType] = useState<SegmentType | undefined>(undefined);
  const [pendingSegmentValue, setPendingSegmentValue] = useState<string | undefined>(undefined);
  
  // Track if filters have been applied
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  
  // Set segment type (pending)
  const setSegmentType = useCallback((type: SegmentType | undefined) => {
    setPendingSegmentType(type);
    // Reset segment value when type changes
    if (type !== pendingSegmentType) {
      setPendingSegmentValue(undefined);
    }
  }, [pendingSegmentType]);
  
  // Set segment value (pending)
  const setSegmentValue = useCallback((value: string | undefined) => {
    setPendingSegmentValue(value);
  }, []);
  
  // Apply pending filters
  const applyFilters = useCallback(() => {
    setSegmentTypeState(pendingSegmentType);
    setSegmentValueState(pendingSegmentValue);
    setIsFiltersApplied(true);
  }, [pendingSegmentType, pendingSegmentValue]);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setSegmentTypeState(undefined);
    setSegmentValueState(undefined);
    setPendingSegmentType(undefined);
    setPendingSegmentValue(undefined);
    setIsFiltersApplied(false);
  }, []);
  
  return (
    <FilterContext.Provider
      value={{
        segmentType,
        segmentValue,
        pendingSegmentType,
        pendingSegmentValue,
        setSegmentType,
        setSegmentValue,
        applyFilters,
        resetFilters,
        isFiltersApplied
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};