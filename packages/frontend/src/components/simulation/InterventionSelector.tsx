import React from 'react';
import { InterventionType, AvailableIntervention } from 'shared';

interface InterventionSelectorProps {
  interventions: AvailableIntervention[];
  selectedIntervention: InterventionType | undefined;
  onSelect: (intervention: InterventionType | undefined) => void;
  loading: boolean;
}

export const InterventionSelector: React.FC<InterventionSelectorProps> = ({
  interventions,
  selectedIntervention,
  onSelect,
  loading
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as InterventionType | '';
    onSelect(value === '' ? undefined : value as InterventionType);
  };

  if (loading) return <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>;

  return (
    <div className="w-full">
      <label htmlFor="intervention-type" className="block text-sm font-medium text-gray-700 mb-1">
        Intervention
      </label>
      <select
        id="intervention-type"
        value={selectedIntervention || ''}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-zillow-blue focus:border-zillow-blue sm:text-sm rounded-md"
      >
        <option value="">Select an Intervention</option>
        {interventions.map((intervention) => (
          <option key={intervention.id} value={intervention.id}>
            {intervention.name}
          </option>
        ))}
      </select>
      {selectedIntervention && interventions.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {interventions.find(i => i.id === selectedIntervention)?.description || ''}
        </p>
      )}
    </div>
  );
};