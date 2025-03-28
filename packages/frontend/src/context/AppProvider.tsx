import React, { ReactNode } from 'react';
import { FilterProvider } from './FilterContext';
import { MetricsProvider } from './MetricsContext';
import { SegmentsProvider } from './SegmentsContext';
import { InterventionsProvider } from './InterventionsContext';
import { SimulationProvider } from './SimulationContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <FilterProvider>
      <SegmentsProvider>
        <InterventionsProvider>
          <MetricsProvider>
            <SimulationProvider>
              {children}
            </SimulationProvider>
          </MetricsProvider>
        </InterventionsProvider>
      </SegmentsProvider>
    </FilterProvider>
  );
};