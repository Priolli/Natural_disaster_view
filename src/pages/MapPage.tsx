import React, { useState, useEffect } from 'react';
import DisasterMap from '../components/map/DisasterMap';
import FilterPanel from '../components/map/FilterPanel';
import { FilterOptions, DisasterEvent } from '../types/disaster';

interface MapPageProps {
  csvData?: DisasterEvent[];
}

const MapPage: React.FC<MapPageProps> = ({ csvData }) => {
  const [filters, setFilters] = useState<FilterOptions>({ types: [] });
  const [availableSubTypes, setAvailableSubTypes] = useState<string[]>([]);

  useEffect(() => {
    if (csvData) {
      // Extract unique subtypes from the data
      const subtypes = new Set<string>();
      csvData.forEach(disaster => {
        if (disaster.subType) {
          subtypes.add(disaster.subType);
        }
      });
      setAvailableSubTypes(Array.from(subtypes).sort());
    }
  }, [csvData]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      <div className="w-full md:w-80 md:min-w-80 p-4 md:h-full md:overflow-y-auto z-10">
        <FilterPanel 
          onFilterChange={handleFilterChange} 
          initialFilters={filters}
          availableSubTypes={availableSubTypes}
        />
      </div>
      
      <div className="flex-grow">
        <DisasterMap filters={filters} csvData={csvData} />
      </div>
    </div>
  );
};

export default MapPage;