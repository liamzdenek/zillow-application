# Frontend Data Management Strategy Using React Context

## Overview

This document outlines a simplified strategy for managing data distribution between components and preventing duplicate API requests in the Zillow Real Estate Professional Health Dashboard frontend using only React Context.

## Challenges

1. **Multiple Components Need Same Data**: Several components may need access to the same data (e.g., metrics, segments)
2. **Preventing Duplicate Requests**: We need to avoid making the same API request multiple times
3. **Data Synchronization**: Components need to stay in sync when data changes
4. **Loading States**: Components need to show appropriate loading states
5. **Error Handling**: Components need to handle API errors consistently

## Solution: React Context API

We'll use React Context to manage all data fetching and state management in the application. This approach centralizes data fetching and state management, making it easier to prevent duplicate requests and ensure data consistency across components.

## Implementation

### 1. Data Context Structure

We'll create several context providers to manage different types of data:

```
- AppProvider (root provider)
  - FilterProvider (manages segment filters)
  - MetricsProvider (manages metrics data)
  - SegmentsProvider (manages segment data)
  - InterventionsProvider (manages intervention data)
  - SimulationProvider (manages simulation data)
```

### 2. Filter Context

```typescript
// src/context/FilterContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SegmentType } from 'shared';

interface FilterContextType {
  segmentType: SegmentType | undefined;
  segmentValue: string | undefined;
  setSegmentType: (type: SegmentType | undefined) => void;
  setSegmentValue: (value: string | undefined) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  isFiltersApplied: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
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
```

### 3. Metrics Context

```typescript
// src/context/MetricsContext.tsx
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

export const MetricsProvider = ({ children }: { children: ReactNode }) => {
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
```

### 4. Segments Context

```typescript
// src/context/SegmentsContext.tsx
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

export const SegmentsProvider = ({ children }: { children: ReactNode }) => {
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
```

### 5. Interventions Context

```typescript
// src/context/InterventionsContext.tsx
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

export const InterventionsProvider = ({ children }: { children: ReactNode }) => {
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
```

### 6. Simulation Context

```typescript
// src/context/SimulationContext.tsx
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

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
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
```

### 7. Root Provider

```typescript
// src/context/AppProvider.tsx
import React, { ReactNode } from 'react';
import { FilterProvider } from './FilterContext';
import { MetricsProvider } from './MetricsContext';
import { SegmentsProvider } from './SegmentsContext';
import { InterventionsProvider } from './InterventionsContext';
import { SimulationProvider } from './SimulationContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
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
```

### 8. Using Context in Components

```typescript
// src/components/Dashboard.tsx
import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import { useFilter } from '../context/FilterContext';
import { SegmentFilter } from './filters/SegmentFilter';
import { ValueFilter } from './filters/ValueFilter';
import { FinancialHealth } from './metrics/FinancialHealth';
import { EarlyWarning } from './metrics/EarlyWarning';
// ... other imports

export const Dashboard = () => {
  const { metrics, loading, error } = useMetrics();
  const { applyFilters, resetFilters } = useFilter();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!metrics) return <div>No data available</div>;
  
  return (
    <div>
      <h1>Zillow Real Estate Professional Health Dashboard</h1>
      
      <div className="filters">
        <SegmentFilter />
        <ValueFilter />
        <button onClick={applyFilters}>Apply</button>
        <button onClick={resetFilters}>Reset</button>
      </div>
      
      <div className="metrics">
        <FinancialHealth metrics={metrics.financialHealth} />
        <EarlyWarning metrics={metrics.earlyWarning} />
        {/* Other metric components */}
      </div>
    </div>
  );
};
```

## Benefits of This Approach

1. **Centralized Data Management**: All data fetching and state management is centralized in context providers
2. **Preventing Duplicate Requests**: Each context provider manages its own data fetching, preventing duplicate requests
3. **Consistent Loading and Error States**: Each context provider manages its own loading and error states
4. **Data Synchronization**: All components using the same context will receive the same data
5. **Simplified Component Logic**: Components can focus on rendering data rather than fetching it

## Potential Drawbacks

1. **Performance**: Context is not optimized for high-frequency updates
2. **Caching**: No built-in caching mechanism (would need to implement manually)
3. **Complexity**: As the application grows, context providers may become complex

## Conclusion

Using React Context for data management provides a simple and effective solution for our dashboard application. It centralizes data fetching and state management, prevents duplicate requests, and ensures data consistency across components. While it may not be as optimized for performance as more specialized libraries like React Query, it provides a good balance of simplicity and functionality for our needs.