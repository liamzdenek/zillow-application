import React from 'react';
import { SimulationResult } from 'shared';

interface ImpactVisualizationProps {
  result: SimulationResult;
}

export const ImpactVisualization: React.FC<ImpactVisualizationProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Impact Visualization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for Revenue Impact Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Revenue Impact</h3>
          <div className="h-60 bg-zillow-light-blue rounded flex items-center justify-center">
            <span className="text-zillow-blue">Revenue Impact Chart</span>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Projected change in revenue: {' '}
              <span className={result.impact.financialHealth.averageRevenuePerAgent > 0 ? 'text-green-600' : 'text-red-600'}>
                {result.impact.financialHealth.averageRevenuePerAgent > 0 ? '+' : ''}
                {result.impact.financialHealth.averageRevenuePerAgent.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
        
        {/* Placeholder for Churn Impact Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Churn Impact</h3>
          <div className="h-60 bg-zillow-light-blue rounded flex items-center justify-center">
            <span className="text-zillow-blue">Churn Impact Chart</span>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Projected change in churn risk: {' '}
              <span className={result.impact.earlyWarning.churnPredictionScore < 0 ? 'text-green-600' : 'text-red-600'}>
                {result.impact.earlyWarning.churnPredictionScore > 0 ? '+' : ''}
                {result.impact.earlyWarning.churnPredictionScore.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
        
        {/* Placeholder for ROI Timeline Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">ROI Timeline</h3>
          <div className="h-60 bg-zillow-light-blue rounded flex items-center justify-center">
            <span className="text-zillow-blue">ROI Timeline Chart</span>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Estimated time to positive ROI: 3-6 months
            </p>
          </div>
        </div>
        
        {/* Placeholder for Risk Reduction Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Risk Reduction</h3>
          <div className="h-60 bg-zillow-light-blue rounded flex items-center justify-center">
            <span className="text-zillow-blue">Risk Reduction Chart</span>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Revenue at risk reduction: {' '}
              <span className={result.impact.revenueImpact.revenueAtRisk < 0 ? 'text-green-600' : 'text-red-600'}>
                {result.impact.revenueImpact.revenueAtRisk > 0 ? '+' : ''}
                {result.impact.revenueImpact.revenueAtRisk.toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};