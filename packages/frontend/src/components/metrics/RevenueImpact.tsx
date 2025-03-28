import React from 'react';
import { RevenueImpactMetrics } from 'shared';
import { MetricCard, MetricItem } from './MetricCard';

interface RevenueImpactProps {
  metrics: RevenueImpactMetrics;
}

export const RevenueImpact: React.FC<RevenueImpactProps> = ({ metrics }) => {
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
    <MetricCard title="Revenue Impact">
      <MetricItem
        label="Retention Rate"
        value={formatPercentage(metrics.revenueRetentionRate)}
        trend={getTrend(metrics.revenueRetentionRate - 80)} // Assuming 80% is baseline
        trendValue={formatTrend(metrics.revenueRetentionRate - 80)}
        trendDescription="Change in retention rate compared to industry baseline of 80% (positive is better)"
      />
      <MetricItem
        label="Revenue at Risk"
        value={formatCurrency(metrics.revenueAtRisk)}
      />
      <MetricItem
        label="Growth Rate"
        value={formatPercentage(metrics.revenueGrowthRate)}
        trend={getTrend(metrics.revenueGrowthRate)}
        trendValue={formatTrend(metrics.revenueGrowthRate)}
        trendDescription="Year-over-year revenue growth rate (positive is better)"
      />
    </MetricCard>
  );
};