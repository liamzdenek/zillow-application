import React from 'react';
import { SimulationResult } from 'shared';
import { MetricCard, MetricItem } from '../metrics/MetricCard';

interface SimulationResultsProps {
  result: SimulationResult;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({ result }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // For metrics where higher is better (revenue, satisfaction, etc.)
  const calculatePositiveImpact = (current: number, projected: number) => {
    const difference = projected - current;
    return difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral';
  };

  // For metrics where lower is better (churn, risk, etc.)
  const calculateNegativeImpact = (current: number, projected: number) => {
    const difference = projected - current;
    return difference < 0 ? 'up' : difference > 0 ? 'down' : 'neutral';
  };

  const formatImpact = (current: number, projected: number) => {
    const difference = projected - current;
    const sign = difference > 0 ? '+' : '';
    return `${sign}${difference.toFixed(1)}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Simulation Results</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Metrics Comparison</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold mb-2">Financial Health</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Metric</div>
              <div className="font-medium">Current</div>
              <div className="font-medium">Projected</div>
              <div className="font-medium">Impact</div>
              
              <div>Avg Revenue</div>
              <div>{formatCurrency(result.currentMetrics.financialHealth.averageRevenuePerAgent)}</div>
              <div>{formatCurrency(result.projectedMetrics.financialHealth.averageRevenuePerAgent)}</div>
              <div className={`${calculatePositiveImpact(
                result.currentMetrics.financialHealth.averageRevenuePerAgent,
                result.projectedMetrics.financialHealth.averageRevenuePerAgent
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.financialHealth.averageRevenuePerAgent,
                  result.projectedMetrics.financialHealth.averageRevenuePerAgent
                )}
              </div>
              
              <div>Lifetime Value</div>
              <div>{formatCurrency(result.currentMetrics.financialHealth.lifetimeValue)}</div>
              <div>{formatCurrency(result.projectedMetrics.financialHealth.lifetimeValue)}</div>
              <div className={`${calculatePositiveImpact(
                result.currentMetrics.financialHealth.lifetimeValue,
                result.projectedMetrics.financialHealth.lifetimeValue
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.financialHealth.lifetimeValue,
                  result.projectedMetrics.financialHealth.lifetimeValue
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-2">Early Warning</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Metric</div>
              <div className="font-medium">Current</div>
              <div className="font-medium">Projected</div>
              <div className="font-medium">Impact</div>
              
              <div>Churn Risk</div>
              <div>{formatPercentage(result.currentMetrics.earlyWarning.churnPredictionScore)}</div>
              <div>{formatPercentage(result.projectedMetrics.earlyWarning.churnPredictionScore)}</div>
              <div className={`${calculateNegativeImpact(
                result.currentMetrics.earlyWarning.churnPredictionScore,
                result.projectedMetrics.earlyWarning.churnPredictionScore
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.earlyWarning.churnPredictionScore,
                  result.projectedMetrics.earlyWarning.churnPredictionScore
                )}
              </div>
              
              <div>Engagement</div>
              <div>{formatPercentage(result.currentMetrics.earlyWarning.engagementDeclinePercentage)}</div>
              <div>{formatPercentage(result.projectedMetrics.earlyWarning.engagementDeclinePercentage)}</div>
              <div className={`${calculateNegativeImpact(
                result.currentMetrics.earlyWarning.engagementDeclinePercentage,
                result.projectedMetrics.earlyWarning.engagementDeclinePercentage
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.earlyWarning.engagementDeclinePercentage,
                  result.projectedMetrics.earlyWarning.engagementDeclinePercentage
                )}
              </div>
              
              <div>Satisfaction</div>
              <div>{formatPercentage(result.currentMetrics.earlyWarning.satisfactionTrendValue)}</div>
              <div>{formatPercentage(result.projectedMetrics.earlyWarning.satisfactionTrendValue)}</div>
              <div className={`${calculatePositiveImpact(
                result.currentMetrics.earlyWarning.satisfactionTrendValue,
                result.projectedMetrics.earlyWarning.satisfactionTrendValue
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.earlyWarning.satisfactionTrendValue,
                  result.projectedMetrics.earlyWarning.satisfactionTrendValue
                )}
              </div>
              
              <div>Price Sensitivity</div>
              <div>{formatPercentage(result.currentMetrics.earlyWarning.priceSensitivityScore)}</div>
              <div>{formatPercentage(result.projectedMetrics.earlyWarning.priceSensitivityScore)}</div>
              <div className={`${calculateNegativeImpact(
                result.currentMetrics.earlyWarning.priceSensitivityScore,
                result.projectedMetrics.earlyWarning.priceSensitivityScore
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.earlyWarning.priceSensitivityScore,
                  result.projectedMetrics.earlyWarning.priceSensitivityScore
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-2">Revenue Impact</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-medium">Metric</div>
              <div className="font-medium">Current</div>
              <div className="font-medium">Projected</div>
              <div className="font-medium">Impact</div>
              
              <div>Retention Rate</div>
              <div>{formatPercentage(result.currentMetrics.revenueImpact.revenueRetentionRate)}</div>
              <div>{formatPercentage(result.projectedMetrics.revenueImpact.revenueRetentionRate)}</div>
              <div className={`${calculatePositiveImpact(
                result.currentMetrics.revenueImpact.revenueRetentionRate,
                result.projectedMetrics.revenueImpact.revenueRetentionRate
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.revenueImpact.revenueRetentionRate,
                  result.projectedMetrics.revenueImpact.revenueRetentionRate
                )}
              </div>
              
              <div>Revenue at Risk</div>
              <div>{formatCurrency(result.currentMetrics.revenueImpact.revenueAtRisk)}</div>
              <div>{formatCurrency(result.projectedMetrics.revenueImpact.revenueAtRisk)}</div>
              <div className={`${calculateNegativeImpact(
                result.currentMetrics.revenueImpact.revenueAtRisk,
                result.projectedMetrics.revenueImpact.revenueAtRisk
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.revenueImpact.revenueAtRisk,
                  result.projectedMetrics.revenueImpact.revenueAtRisk
                )}
              </div>
              
              <div>Growth Rate</div>
              <div>{formatPercentage(result.currentMetrics.revenueImpact.revenueGrowthRate)}</div>
              <div>{formatPercentage(result.projectedMetrics.revenueImpact.revenueGrowthRate)}</div>
              <div className={`${calculatePositiveImpact(
                result.currentMetrics.revenueImpact.revenueGrowthRate,
                result.projectedMetrics.revenueImpact.revenueGrowthRate
              ) === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {formatImpact(
                  result.currentMetrics.revenueImpact.revenueGrowthRate,
                  result.projectedMetrics.revenueImpact.revenueGrowthRate
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};