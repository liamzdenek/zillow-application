import React from 'react';
import { useMetrics } from '../context/MetricsContext';
import { useFilter } from '../context/FilterContext';
import { Layout } from '../components/layout/Layout';
import { SegmentFilter } from '../components/filters/SegmentFilter';
import { ValueFilter } from '../components/filters/ValueFilter';
import { FinancialHealth } from '../components/metrics/FinancialHealth';
import { EarlyWarning } from '../components/metrics/EarlyWarning';
import { Link } from '@tanstack/react-router';

export const Dashboard: React.FC = () => {
  const { metrics, loading, error } = useMetrics();
  const { applyFilters, resetFilters } = useFilter();

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
              className="px-4 py-2 bg-zillow-blue text-white rounded-md hover:bg-zillow-dark-blue"
              onClick={applyFilters}
            >
              Apply
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zillow-blue"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error.message}
        </div>
      )}

      {!loading && !error && metrics && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Overview Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialHealth metrics={metrics.financialHealth} />
              <EarlyWarning metrics={metrics.earlyWarning} />
              {/* Add other metric components here */}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Segment Breakdown</h2>
            {/* Add segment breakdown component here */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-500">Segment breakdown charts will be displayed here.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/simulation"
              className="inline-block px-6 py-3 bg-zillow-blue text-white font-medium rounded-md hover:bg-zillow-dark-blue"
            >
              Simulate Interventions
            </Link>
          </div>
        </>
      )}

      {!loading && !error && !metrics && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          No data available. Please check your filters or try again later.
        </div>
      )}
    </Layout>
  );
};