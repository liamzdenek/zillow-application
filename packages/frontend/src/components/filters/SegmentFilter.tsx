import React from 'react';
import { SegmentType } from 'shared';
import { useFilter } from '../../context/FilterContext';
import { useSegments } from '../../context/SegmentsContext';

export const SegmentFilter: React.FC = () => {
  const { setSegmentType, pendingSegmentType } = useFilter();
  const { segments, loading } = useSegments();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SegmentType | '';
    setSegmentType(value === '' ? undefined : value as SegmentType);
  };

  if (loading) return <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>;

  return (
    <div className="w-full">
      <label htmlFor="segment-type" className="block text-sm font-medium text-gray-700 mb-1">
        Segment
      </label>
      <select
        id="segment-type"
        value={pendingSegmentType || ''}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-zillow-blue focus:border-zillow-blue sm:text-sm rounded-md"
      >
        <option value="">All Agents</option>
        {segments && Object.keys(segments).map((type) => (
          <option key={type} value={type}>
            {formatSegmentType(type)}
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