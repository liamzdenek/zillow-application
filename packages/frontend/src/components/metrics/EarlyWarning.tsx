import React from 'react';
import { EarlyWarningMetrics } from 'shared';
import { MetricCard, MetricItem } from './MetricCard';

interface EarlyWarningProps {
  metrics: EarlyWarningMetrics;
}

export const EarlyWarning: React.FC<EarlyWarningProps> = ({ metrics }) => {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrend = (value: number) => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  const formatTrend = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <MetricCard title="Early Warning">
      <MetricItem
        label="Churn Risk"
        value={formatPercentage(metrics.churnPredictionScore)}
      />
      <MetricItem
        label="Engagement Decline"
        value={formatPercentage(metrics.engagementDeclinePercentage)}
        trend={getTrend(-metrics.engagementDeclinePercentage)}
        trendValue={formatTrend(-metrics.engagementDeclinePercentage)}
      />
      <MetricItem
        label="Satisfaction Trend"
        value={formatPercentage(metrics.satisfactionTrendValue)}
        trend={getTrend(metrics.satisfactionTrendValue)}
        trendValue={formatTrend(metrics.satisfactionTrendValue)}
      />
      <MetricItem
        label="Price Sensitivity"
        value={formatPercentage(metrics.priceSensitivityScore)}
      />
      
      {/* Placeholder for chart - in a real implementation, we would use Chart.js here */}
      <div className="mt-4 h-40 bg-zillow-light-blue rounded flex items-center justify-center">
        <span className="text-zillow-blue">Risk Trend Chart</span>
      </div>
    </MetricCard>
  );
};