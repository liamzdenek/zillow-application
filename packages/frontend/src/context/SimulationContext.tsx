import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InterventionType, SegmentType, SimulationResult, SimulationResponse } from 'shared';
import { runSimulation as apiRunSimulation } from '../api/simulation';

interface SimulationContextType {
  simulationResult: SimulationResult | null;
  loading: boolean;
  error: Error | null;
  runSimulation: (params: {
    interventionType: InterventionType;
    segmentType: SegmentType;
    segmentValue: string;
  }) => Promise<void>;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Run simulation
  const runSimulation = async (params: {
    interventionType: InterventionType;
    segmentType: SegmentType;
    segmentValue: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: SimulationResponse = await apiRunSimulation(params);
      
      if (response.success && response.data) {
        setSimulationResult(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to run simulation'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setSimulationResult(null);
    setError(null);
  };
  
  return (
    <SimulationContext.Provider value={{ simulationResult, loading, error, runSimulation, resetSimulation }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};