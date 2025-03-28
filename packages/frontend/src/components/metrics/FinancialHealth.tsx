import React from 'react';
import { FinancialHealthMetrics } from 'shared';
import { MetricCard, MetricItem } from './MetricCard';

interface FinancialHealthProps {
  metrics: FinancialHealthMetrics;
}

export const FinancialHealth: React.FC<FinancialHealthProps> = ({ metrics }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <MetricCard title="Financial Health">
      <MetricItem
        label="Average Revenue"
        value={formatCurrency(metrics.averageRevenuePerAgent)}
      />
      <MetricItem
        label="Acquisition Cost"
        value={formatCurrency(metrics.customerAcquisitionCost)}
      />
      <MetricItem
        label="Lifetime Value"
        value={formatCurrency(metrics.lifetimeValue)}
      />
    </MetricCard>
  );
};