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
  const { segmentType, segmentValue, applyFilters } = useFilter();
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
      applyFilters(); // Apply any pending filter changes
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
        <Link to="/" className="text-zillow-blue hover:underline mb-4 inline-block">
          &lt; Back to Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Intervention Simulator</h1>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Simulation Parameters</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SegmentFilter />
              <ValueFilter />
            </div>
            <InterventionSelector 
              interventions={interventions || []} 
              selectedIntervention={interventionType}
              onSelect={setInterventionType}
              loading={loadingInterventions}
            />
            <button 
              className={`px-4 py-2 rounded-md ${canSimulate ? 'bg-zillow-blue text-white hover:bg-zillow-dark-blue' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={handleSimulate}
              disabled={!canSimulate}
            >
              Simulate
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error.message}
        </div>
      )}

      {loadingSimulation && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zillow-blue"></div>
        </div>
      )}

      {simulationResult && (
        <>
          <SimulationResults result={simulationResult} />
          <ImpactVisualization result={simulationResult} />
          
          <div className="flex justify-between mt-8">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={resetSimulation}
            >
              Try Another Intervention
            </button>
            
            <button 
              className="px-4 py-2 bg-zillow-blue text-white rounded-md hover:bg-zillow-dark-blue"
              onClick={() => {
                // In a real implementation, this would export the results
                alert('Export functionality would be implemented here');
              }}
            >
              Export Results
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};