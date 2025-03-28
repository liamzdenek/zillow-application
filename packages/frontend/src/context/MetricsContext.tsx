import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Metrics, MetricsResponse } from 'shared';
import { useFilter } from './FilterContext';
import { getMetrics } from '../api/metrics';

interface MetricsContextType {
  metrics: Metrics | null;
  loading: boolean;
  error: Error | null;
  fetchMetrics: () => Promise<void>;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { segmentType, segmentValue, isFiltersApplied } = useFilter();
  
  // Fetch metrics based on current filters
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: MetricsResponse = await getMetrics({
        segmentType,
        segmentValue
      });
      
      if (response.success && response.data) {
        setMetrics(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch metrics'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch metrics when filters change
  useEffect(() => {
    if (isFiltersApplied || (!segmentType && !segmentValue)) {
      fetchMetrics();
    }
  }, [segmentType, segmentValue, isFiltersApplied]);
  
  return (
    <MetricsContext.Provider value={{ metrics, loading, error, fetchMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};