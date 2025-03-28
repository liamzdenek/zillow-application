# Frontend Implementation Plan: Zillow Real Estate Professional Health Dashboard

## Overview

This document outlines the plan for implementing the frontend of the Zillow Real Estate Professional Health Dashboard. The frontend will provide a user-friendly interface for executives to monitor the health of relationships with real estate professionals and simulate interventions.

## Goals

1. Create a responsive dashboard that works on both desktop and mobile devices
2. Implement segment filtering to analyze different agent groups
3. Visualize metrics with appropriate charts and graphs
4. Create an intervention simulator to model the impact of different strategies
5. Connect to the backend API to fetch real data
6. Ensure a polished, professional look and feel suitable for executives

## Architecture

The frontend will be structured as follows:

```
packages/frontend/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── styles.css               # Global styles
│   ├── api/                     # API client
│   │   ├── client.ts            # Axios client setup
│   │   ├── metrics.ts           # Metrics API
│   │   ├── segments.ts          # Segments API
│   │   ├── interventions.ts     # Interventions API
│   │   └── simulation.ts        # Simulation API
│   ├── components/              # Reusable components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Dashboard header
│   │   │   ├── Footer.tsx       # Dashboard footer
│   │   │   └── Layout.tsx       # Main layout
│   │   ├── filters/             # Filter components
│   │   │   ├── SegmentFilter.tsx # Segment type filter
│   │   │   └── ValueFilter.tsx  # Segment value filter
│   │   ├── metrics/             # Metric components
│   │   │   ├── MetricCard.tsx   # Card for displaying metrics
│   │   │   ├── FinancialHealth.tsx # Financial health metrics
│   │   │   ├── ListingActivity.tsx # Listing activity metrics
│   │   │   ├── LeadManagement.tsx # Lead management metrics
│   │   │   ├── CustomerSatisfaction.tsx # Customer satisfaction metrics
│   │   │   ├── EarlyWarning.tsx # Early warning metrics
│   │   │   └── RevenueImpact.tsx # Revenue impact metrics
│   │   ├── charts/              # Chart components
│   │   │   ├── LineChart.tsx    # Line chart for trends
│   │   │   ├── BarChart.tsx     # Bar chart for comparisons
│   │   │   ├── PieChart.tsx     # Pie chart for breakdowns
│   │   │   └── ComparisonChart.tsx # Chart for before/after comparisons
│   │   ├── segments/            # Segment components
│   │   │   └── SegmentBreakdown.tsx # Segment breakdown visualization
│   │   └── simulation/          # Simulation components
│   │       ├── InterventionSelector.tsx # Intervention selector
│   │       ├── SimulationResults.tsx # Simulation results display
│   │       └── ImpactVisualization.tsx # Impact visualization
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx        # Main dashboard page
│   │   └── Simulation.tsx       # Simulation page
│   ├── hooks/                   # Custom hooks
│   │   ├── useMetrics.ts        # Hook for fetching metrics
│   │   ├── useSegments.ts       # Hook for fetching segments
│   │   ├── useInterventions.ts  # Hook for fetching interventions
│   │   └── useSimulation.ts     # Hook for running simulations
│   ├── context/                 # React context
│   │   └── FilterContext.tsx    # Context for segment filters
│   ├── utils/                   # Utility functions
│   │   ├── formatting.ts        # Formatting utilities
│   │   ├── colors.ts            # Color utilities
│   │   └── calculations.ts      # Calculation utilities
│   └── types/                   # Additional types
│       └── index.ts             # Frontend-specific types
```

## Implementation Steps

### 1. Set Up Project Structure

- [x] Create frontend package in NX monorepo
- [ ] Set up React with Vite
- [ ] Configure TanStack Router
- [ ] Set up Chart.js for visualizations
- [ ] Configure styling with Tailwind CSS
- [ ] Set up API client with Axios

### 2. Implement API Client

Create API client modules to interact with the backend:

```typescript
// api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

```typescript
// api/metrics.ts
import { apiClient } from './client';
import { MetricsRequest, MetricsResponse } from 'shared';

export const getMetrics = async (request: MetricsRequest = {}): Promise<MetricsResponse> => {
  const { data } = await apiClient.get('/metrics', { params: request });
  return data;
};
```

Similar modules will be created for segments, interventions, and simulation.

### 3. Implement Context Providers for Data Management

We'll use React Context for data management to prevent duplicate requests and ensure data consistency across components. See the [Frontend Data Management Strategy](./frontend-data-management.md) for details.

Create context providers for different types of data:

1. **FilterContext**: Manages segment filters
2. **MetricsContext**: Manages metrics data
3. **SegmentsContext**: Manages segment data
4. **InterventionsContext**: Manages intervention data
5. **SimulationContext**: Manages simulation data

These context providers will be combined in a root AppProvider:

```typescript
// context/AppProvider.tsx
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

Components will use these contexts to access data:

```typescript
// components/Dashboard.tsx
import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import { useFilter } from '../context/FilterContext';

export const Dashboard = () => {
  const { metrics, loading, error } = useMetrics();
  const { applyFilters, resetFilters } = useFilter();
  
  // Component implementation
};
```

### 5. Implement Reusable Components

#### Metric Card Component

```typescript
// components/metrics/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};
```

#### Segment Filter Component

```typescript
// components/filters/SegmentFilter.tsx
import React from 'react';
import { SegmentType } from 'shared';
import { useFilter } from '../../context/FilterContext';
import { useSegments } from '../../hooks/useSegments';

export const SegmentFilter: React.FC = () => {
  const { segmentType, setSegmentType, setSegmentValue } = useFilter();
  const { segments, loading } = useSegments();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SegmentType | '';
    setSegmentType(value === '' ? undefined : value);
    setSegmentValue(undefined); // Reset segment value when type changes
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <label htmlFor="segment-type" className="block text-sm font-medium text-gray-700">
        Segment
      </label>
      <select
        id="segment-type"
        value={segmentType || ''}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">All Agents</option>
        {segments && Object.keys(segments).map((type) => (
          <option key={type} value={type}>
            {formatSegmentType(type)}
          </option>
        ))}
      </select>
    </div>
  );
};

const formatSegmentType = (type: string): string => {
  // Convert camelCase to Title Case with spaces
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};
```

### 6. Implement Dashboard Page

```typescript
// pages/Dashboard.tsx
import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import { useFilter } from '../context/FilterContext';
import { Layout } from '../components/layout/Layout';
import { SegmentFilter } from '../components/filters/SegmentFilter';
import { ValueFilter } from '../components/filters/ValueFilter';
import { FinancialHealth } from '../components/metrics/FinancialHealth';
import { ListingActivity } from '../components/metrics/ListingActivity';
import { LeadManagement } from '../components/metrics/LeadManagement';
import { CustomerSatisfaction } from '../components/metrics/CustomerSatisfaction';
import { EarlyWarning } from '../components/metrics/EarlyWarning';
import { RevenueImpact } from '../components/metrics/RevenueImpact';
import { SegmentBreakdown } from '../components/segments/SegmentBreakdown';
import { Link } from '@tanstack/react-router';

export const Dashboard: React.FC = () => {
  const { metrics, loading, error } = useMetrics();
  const { applyFilters, resetFilters } = useFilter();

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error.message}</div></Layout>;
  if (!metrics) return <Layout><div>No data available</div></Layout>;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Zillow Real Estate Professional Health Dashboard</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <SegmentFilter />
            <ValueFilter />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={applyFilters}
            >
              Apply
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Overview Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FinancialHealth metrics={metrics.financialHealth} />
          <EarlyWarning metrics={metrics.earlyWarning} />
          <ListingActivity metrics={metrics.listingActivity} />
          <RevenueImpact metrics={metrics.revenueImpact} />
          <LeadManagement metrics={metrics.leadManagement} />
          <CustomerSatisfaction metrics={metrics.customerSatisfaction} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Segment Breakdown</h2>
        <SegmentBreakdown breakdown={metrics.segmentBreakdown} />
      </div>

      <div className="text-center mt-8">
        <Link
          to="/simulation"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Simulate Interventions
        </Link>
      </div>
    </Layout>
  );
};
```

### 7. Implement Simulation Page

```typescript
// pages/Simulation.tsx
import React, { useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { useInterventions } from '../context/InterventionsContext';
import { useSimulation } from '../context/SimulationContext';
import { InterventionType } from 'shared';
import { Layout } from '../components/layout/Layout';
import { SegmentFilter } from '../components/filters/SegmentFilter';
import { ValueFilter } from '../components/filters/ValueFilter';
import { InterventionSelector } from '../components/simulation/InterventionSelector';
import { SimulationResults } from '../components/simulation/SimulationResults';
import { ImpactVisualization } from '../components/simulation/ImpactVisualization';
import { Link } from '@tanstack/react-router';

export const Simulation: React.FC = () => {
  const { segmentType, segmentValue } = useFilter();
  const [interventionType, setInterventionType] = useState<InterventionType | undefined>(undefined);
  const { interventions, loading: loadingInterventions } = useInterventions();
  const {
    simulationResult,
    loading: loadingSimulation,
    error,
    runSimulation,
    resetSimulation
  } = useSimulation();

  const handleSimulate = () => {
    if (segmentType && segmentValue && interventionType) {
      runSimulation({
        segmentType,
        segmentValue,
        interventionType
      });
    }
  };

  const canSimulate = !!segmentType && !!segmentValue && !!interventionType;

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          &lt; Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Intervention Simulator</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <SegmentFilter />
            <ValueFilter />
            <InterventionSelector
              interventions={interventions || []}
              selectedIntervention={interventionType}
              onSelect={setInterventionType}
              loading={loadingInterventions}
            />
          </div>
          
          <button
            className={`px-4 py-2 rounded-md ${canSimulate ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleSimulate}
            disabled={!canSimulate}
          >
            Simulate
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error.message}
        </div>
      )}

      {loadingSimulation && <div>Running simulation...</div>}

      {simulationResult && (
        <>
          <SimulationResults result={simulationResult} />
          <ImpactVisualization result={simulationResult} />
          
          <div className="flex justify-between mt-8">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              onClick={resetSimulation}
            >
              Try Another Intervention
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => {/* Export results */}}
            >
              Export Results
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};
```

### 8. Implement Chart Components

```typescript
// components/charts/PieChart.tsx
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
  data: Record<string, number>;
  title?: string;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, className = '' }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = generateColors(labels.length);

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.7', '1')),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15
            }
          },
          title: {
            display: !!title,
            text: title || ''
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title]);

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
};

// Generate colors for chart segments
const generateColors = (count: number): string[] => {
  const baseColors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 205, 86, 0.7)',
    'rgba(201, 203, 207, 0.7)'
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // If we need more colors than in our base set, generate them
  const colors = [...baseColors];
  for (let i = baseColors.length; i < count; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }

  return colors;
};
```

### 9. Implement Responsive Design

Use Tailwind CSS to implement responsive design:

```typescript
// components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

### 10. Connect to Backend API

Ensure all API calls are properly connected to the backend:

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AppProvider } from './context/AppProvider';
import { Dashboard } from './pages/Dashboard';
import { Simulation } from './pages/Simulation';
import './styles.css';

// Define routes
const routeConfig = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/simulation',
    element: <Simulation />
  }
];

// Create router
const router = createRouter({ routeConfig });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
```

## Testing Strategy

1. **Component Testing**: Test individual components with React Testing Library
2. **Integration Testing**: Test component interactions
3. **API Testing**: Mock API responses to test data fetching
4. **Responsive Testing**: Test on different screen sizes
5. **Cross-Browser Testing**: Test on major browsers

## Implementation Timeline

1. **Project Setup (30 minutes)**:
   - Set up React with Vite
   - Configure TanStack Router
   - Set up Chart.js and Tailwind CSS

2. **API Client and Context Providers (1 hour)**:
   - Implement API client
   - Create context providers for data management
   - Set up AppProvider to combine all contexts

3. **Core Components (1 hour)**:
   - Implement layout components
   - Create filter components
   - Build metric card components

4. **Dashboard Page (1 hour)**:
   - Implement main dashboard layout
   - Create metric sections
   - Add segment breakdown section

5. **Chart Components (1 hour)**:
   - Implement pie charts for segment breakdown
   - Create line charts for trends
   - Build comparison charts for simulation

6. **Simulation Page (1 hour)**:
   - Implement simulation form
   - Create results display
   - Add impact visualization

7. **Responsive Design (30 minutes)**:
   - Ensure mobile compatibility
   - Test on different screen sizes

8. **Testing and Refinement (1 hour)**:
   - Test all components
   - Fix any issues
   - Refine UI and UX

## Conclusion

This frontend implementation plan provides a comprehensive roadmap for developing the Zillow Real Estate Professional Health Dashboard. By following this plan, we can create a polished, professional dashboard that provides valuable insights to Zillow executives about the health of their relationships with real estate professionals.