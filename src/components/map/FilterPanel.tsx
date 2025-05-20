import React, { useState, useEffect } from 'react';
import { FilterOptions, DisasterType } from '../../types/disaster';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  availableSubTypes?: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  initialFilters = { types: [] },
  availableSubTypes = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const disasterTypes: { label: string; value: DisasterType; color: string }[] = [
    { label: 'Earthquake', value: 'earthquake', color: 'bg-earthquake' },
    { label: 'Flood', value: 'flood', color: 'bg-flood' },
    { label: 'Hurricane', value: 'hurricane', color: 'bg-hurricane' },
    { label: 'Wildfire', value: 'wildfire', color: 'bg-wildfire' },
    { label: 'Drought', value: 'drought', color: 'bg-drought' },
    { label: 'Volcano', value: 'volcano', color: 'bg-volcano' },
    { label: 'Other', value: 'other', color: 'bg-gray-500' },
  ];

  const handleTypeChange = (type: DisasterType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];

    const newFilters = { ...filters, types: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubTypeChange = (subType: string) => {
    const newSubTypes = filters.subTypes?.includes(subType)
      ? filters.subTypes.filter((t) => t !== subType)
      : [...(filters.subTypes || []), subType];

    const newFilters = { ...filters, subTypes: newSubTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'startDate' | 'endDate'
  ) => {
    const newFilters = { ...filters, [field]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMinimumChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'minDeaths' | 'minAffected'
  ) => {
    const value = parseInt(e.target.value) || undefined;
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSeverityChange = (level: 1 | 2 | 3 | 4 | 5) => {
    const newFilters = {
      ...filters,
      severityLevel: filters.severityLevel === level ? undefined : level,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { types: [] };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <>
      {/* Mobile filter button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-10 p-3 bg-primary-600 rounded-full shadow-lg text-white"
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        aria-label="Toggle filters"
      >
        {isPanelVisible ? <X size={20} /> : <Filter size={20} />}
      </button>

      <div
        className={`bg-white shadow-md rounded-lg transition-all duration-300 ${
          isPanelVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset all
            </button>
          </div>

          <div className="space-y-6">
            {/* Disaster Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disaster Type
              </label>
              <div className="space-y-2">
                {disasterTypes.map((type) => (
                  <div key={type.value} className="flex items-center">
                    <input
                      id={`type-${type.value}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      checked={filters.types.includes(type.value)}
                      onChange={() => handleTypeChange(type.value)}
                    />
                    <label
                      htmlFor={`type-${type.value}`}
                      className="ml-2 flex items-center"
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${type.color} mr-2`}
                      ></span>
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Disaster Subtypes */}
            {availableSubTypes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disaster Subtype
                </label>
                <div className="space-y-2">
                  {availableSubTypes.map((subType) => (
                    <div key={subType} className="flex items-center">
                      <input
                        id={`subtype-${subType}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={filters.subTypes?.includes(subType)}
                        onChange={() => handleSubTypeChange(subType)}
                      />
                      <label
                        htmlFor={`subtype-${subType}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {subType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                    value={filters.startDate || ''}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                    value={filters.endDate || ''}
                    onChange={(e) => handleDateChange(e, 'endDate')}
                  />
                </div>
              </div>
            </div>

            {/* Impact Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact Filters
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Minimum Deaths
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                    value={filters.minDeaths || ''}
                    onChange={(e) => handleMinimumChange(e, 'minDeaths')}
                    placeholder="e.g., 100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Minimum Affected
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                    value={filters.minAffected || ''}
                    onChange={(e) => handleMinimumChange(e, 'minAffected')}
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>
            </div>

            {/* Severity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.severityLevel === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSeverityChange(level as 1 | 2 | 3 | 4 | 5)}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;