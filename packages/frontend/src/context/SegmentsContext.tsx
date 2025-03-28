import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SegmentType, SegmentsResponse } from 'shared';
import { getSegments } from '../api/segments';

interface SegmentsContextType {
  segments: Record<SegmentType, string[]> | null;
  loading: boolean;
  error: Error | null;
  fetchSegments: () => Promise<void>;
}

const SegmentsContext = createContext<SegmentsContextType | undefined>(undefined);

export const SegmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [segments, setSegments] = useState<Record<SegmentType, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch segments
  const fetchSegments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: SegmentsResponse = await getSegments();
      
      if (response.success && response.data) {
        setSegments(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch segments'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch segments on mount
  useEffect(() => {
    fetchSegments();
  }, []);
  
  return (
    <SegmentsContext.Provider value={{ segments, loading, error, fetchSegments }}>
      {children}
    </SegmentsContext.Provider>
  );
};

export const useSegments = () => {
  const context = useContext(SegmentsContext);
  if (context === undefined) {
    throw new Error('useSegments must be used within a SegmentsProvider');
  }
  return context;
};