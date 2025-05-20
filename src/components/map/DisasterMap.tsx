import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { AlertTriangle, Loader } from 'lucide-react';
import { useDisasterData } from '../../hooks/useDisasterData';
import { DisasterEvent, DisasterType, FilterOptions } from '../../types/disaster';
import { isValidCoordinates } from '../../services/geocoding';
import DisasterPopup from './DisasterPopup';

interface DisasterMapProps {
  filters?: FilterOptions;
  csvData?: DisasterEvent[];
}

// Move getDisasterIcon outside component to prevent recreation
const getDisasterIcon = (type: DisasterType) => {
  const colors = {
    earthquake: '#ef4444',
    flood: '#3b82f6',
    hurricane: '#8b5cf6',
    wildfire: '#f97316',
    tsunami: '#06b6d4',
    drought: '#eab308',
    volcano: '#dc2626',
    other: '#6b7280',
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colors[type]};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 0 1px ${colors[type]};
      "></div>
    `,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

const MapBoundsUpdater: React.FC<{ disasters: DisasterEvent[] }> = ({ disasters }) => {
  const map = useMap();
  
  useEffect(() => {
    if (disasters.length > 0) {
      const bounds = L.latLngBounds(
        disasters.map(d => [d.location.lat, d.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [disasters, map]);
  
  return null;
};

const DisasterMap: React.FC<DisasterMapProps> = ({ filters = { types: [] }, csvData }) => {
  const { disasters, loading, error } = useDisasterData({ csvData });
  const [filteredDisasters, setFilteredDisasters] = useState<DisasterEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [markersPerPage] = useState(500);
  
  const filterDisasters = useCallback((disasters: DisasterEvent[], filters: FilterOptions) => {
    let filtered = disasters;

    if (filters.types?.length > 0) {
      filtered = filtered.filter(d => filters.types.includes(d.type));
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate).getTime();
      filtered = filtered.filter(d => new Date(d.startDate).getTime() >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate).getTime();
      filtered = filtered.filter(d => new Date(d.startDate).getTime() <= endDate);
    }

    if (filters.countries?.length) {
      filtered = filtered.filter(d => filters.countries?.includes(d.location.country));
    }

    if (filters.minDeaths) {
      filtered = filtered.filter(d => d.impact.deaths >= filters.minDeaths!);
    }

    if (filters.minAffected) {
      filtered = filtered.filter(d => (d.impact.affected || 0) >= filters.minAffected!);
    }

    if (filters.severityLevel) {
      filtered = filtered.filter(d => d.impact.severityLevel === filters.severityLevel);
    }

    return filtered;
  }, []);

  useEffect(() => {
    if (!disasters) {
      setIsLoading(false);
      return;
    }

    const filtered = filterDisasters(disasters, filters);
    setFilteredDisasters(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    setIsLoading(false);
  }, [disasters, filters, filterDisasters]);

  const paginatedDisasters = useCallback(() => {
    const validDisasters = filteredDisasters.filter(d => 
      isValidCoordinates(d.location.lat, d.location.lng)
    );
    
    const startIndex = (currentPage - 1) * markersPerPage;
    return validDisasters.slice(startIndex, startIndex + markersPerPage);
  }, [filteredDisasters, currentPage, markersPerPage]);

  const totalPages = Math.ceil(filteredDisasters.length / markersPerPage);

  if (loading || isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading disaster data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {paginatedDisasters().map(disaster => (
            <Marker
              key={disaster.id}
              position={[disaster.location.lat, disaster.location.lng]}
              icon={getDisasterIcon(disaster.type)}
            >
              <Popup>
                <DisasterPopup disaster={disaster} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <MapBoundsUpdater disasters={paginatedDisasters()} />
      </MapContainer>
      
      {filteredDisasters.length > markersPerPage && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm text-gray-600">
        Showing {paginatedDisasters().length} of {filteredDisasters.length} disasters
      </div>
    </div>
  );
};

export default DisasterMap;