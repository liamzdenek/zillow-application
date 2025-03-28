import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { useSegments } from '../../context/SegmentsContext';

export const ValueFilter: React.FC = () => {
  const { pendingSegmentType, pendingSegmentValue, setSegmentValue } = useFilter();
  const { segments, loading } = useSegments();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSegmentValue(value === '' ? undefined : value);
  };

  if (loading || !pendingSegmentType || !segments) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>;
  }

  const values = segments[pendingSegmentType] || [];

  return (
    <div className="w-full">
      <label htmlFor="segment-value" className="block text-sm font-medium text-gray-700 mb-1">
        Value
      </label>
      <select
        id="segment-value"
        value={pendingSegmentValue || ''}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-zillow-blue focus:border-zillow-blue sm:text-sm rounded-md"
      >
        <option value="">All {formatSegmentType(pendingSegmentType)}</option>
        {values.map((value) => (
          <option key={value} value={value}>
            {formatSegmentValue(value)}
          </option>
        ))}
      </select>
    </div>
  );
};

const formatSegmentType = (type: string): string => {
  // Convert camelCase to Title Case with spaces
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const formatSegmentValue = (value: string): string => {
  // Convert camelCase to Title Case with spaces
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};