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
  trendDescription?: string;
}> = ({ label, value, trend, trendValue, trendDescription }) => {
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

  const defaultDescription = trend === 'up'
    ? 'Change from baseline (higher is better)'
    : trend === 'down'
      ? 'Change from baseline (lower is better)'
      : 'No change from baseline';

  return (
    <div className="flex justify-between items-baseline">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="flex items-baseline space-x-2">
        <div className="text-xl font-semibold">{value}</div>
        {trend && trendValue && (
          <div className="relative group">
            <div className={`text-sm ${getTrendColor()}`}>
              {getTrendIcon()} {trendValue}
            </div>
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {trendDescription || defaultDescription}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};