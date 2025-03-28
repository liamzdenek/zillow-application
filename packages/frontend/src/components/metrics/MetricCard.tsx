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

export const MetricItem: React.FC<{
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
}> = ({ label, value, trend, trendValue }) => {
  const getTrendColor = () => {
    if (!trend) return '';
    return trend === 'up' 
      ? 'text-green-600' 
      : trend === 'down' 
        ? 'text-red-600' 
        : 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' 
      ? '↑' 
      : trend === 'down' 
        ? '↓' 
        : '→';
  };

  return (
    <div className="flex justify-between items-baseline">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="flex items-baseline space-x-2">
        <div className="text-xl font-semibold">{value}</div>
        {trend && trendValue && (
          <div className={`text-sm ${getTrendColor()}`}>
            {getTrendIcon()} {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};