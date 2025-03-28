import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AvailableIntervention, InterventionsResponse } from 'shared';
import { getInterventions } from '../api/interventions';

interface InterventionsContextType {
  interventions: AvailableIntervention[] | null;
  loading: boolean;
  error: Error | null;
  fetchInterventions: () => Promise<void>;
}

const InterventionsContext = createContext<InterventionsContextType | undefined>(undefined);

export const InterventionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interventions, setInterventions] = useState<AvailableIntervention[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch interventions
  const fetchInterventions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: InterventionsResponse = await getInterventions();
      
      if (response.success && response.data) {
        setInterventions(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch interventions'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch interventions on mount
  useEffect(() => {
    fetchInterventions();
  }, []);
  
  return (
    <InterventionsContext.Provider value={{ interventions, loading, error, fetchInterventions }}>
      {children}
    </InterventionsContext.Provider>
  );
};

export const useInterventions = () => {
  const context = useContext(InterventionsContext);
  if (context === undefined) {
    throw new Error('useInterventions must be used within an InterventionsProvider');
  }
  return context;
};