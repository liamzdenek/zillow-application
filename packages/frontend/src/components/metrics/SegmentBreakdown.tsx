import React from 'react';
import { SegmentBreakdown as SegmentBreakdownType } from 'shared';
import { MetricCard } from './MetricCard';

interface SegmentBreakdownProps {
  breakdown: SegmentBreakdownType;
}

export const SegmentBreakdown: React.FC<SegmentBreakdownProps> = ({ breakdown }) => {
  // Helper function to format segment data for display
  const formatSegmentData = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(data).map(([key, value]) => ({
      label: formatSegmentLabel(key),
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    }));
  };

  // Helper function to format segment labels for display
  const formatSegmentLabel = (key: string) => {
    // Convert camelCase or snake_case to Title Case with spaces
    return key
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
      .replace(/Less Than/g, '<') // Replace "Less Than" with "<"
      .replace(/More Than/g, '>') // Replace "More Than" with ">"
      .trim();
  };

  // Helper function to get color for segment
  const getSegmentColor = (index: number) => {
    const colors = [
      'bg-blue-600',
      'bg-green-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-purple-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-teal-600',
      'bg-orange-600',
      'bg-cyan-600'
    ];
    return colors[index % colors.length];
  };

  // Render a segment bar chart
  const renderSegmentChart = (title: string, data: Record<string, number>) => {
    const formattedData = formatSegmentData(data);
    
    return (
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">{title}</h4>
        <div className="space-y-2">
          {formattedData.map((item, index) => (
            <div key={item.label} className="flex flex-col">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>{item.percentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${getSegmentColor(index)} h-2.5 rounded-full`} 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MetricCard title="Segment Breakdown" className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSegmentChart('Experience Level', breakdown.experienceLevel)}
        {renderSegmentChart('Business Model', breakdown.businessModel)}
        {renderSegmentChart('Specialization', breakdown.specialization)}
        {renderSegmentChart('Platform Engagement', breakdown.platformEngagement)}
        {renderSegmentChart('Spend Level', breakdown.spendLevel)}
        {renderSegmentChart('Market Location', breakdown.marketTypeLocation)}
        {renderSegmentChart('Market Condition', breakdown.marketTypeCondition)}
      </div>
    </MetricCard>
  );
};