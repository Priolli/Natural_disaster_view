import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, AlertTriangle, Info } from 'lucide-react';
import { DisasterEvent } from '../../types/disaster';
import { isValidCoordinates } from '../../services/geocoding';

interface DisasterPopupProps {
  disaster: DisasterEvent;
}

const DisasterPopup: React.FC<DisasterPopupProps> = ({ disaster }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">{disaster.name}</h3>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
          {disaster.source}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {formatDate(disaster.startDate)}
        {disaster.endDate && ` - ${formatDate(disaster.endDate)}`}
      </div>
      
      <div className="flex items-center mb-2">
        <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
          {disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}
        </span>
        <span className="text-sm">{disaster.location.country}</span>
      </div>
      
      {!isValidCoordinates(disaster.location.lat, disaster.location.lng) && (
        <div className="flex items-center text-xs text-amber-600 mb-2">
          <Info className="w-4 h-4 mr-1" />
          <span>Location approximated from {disaster.location.region || 'country'} data</span>
        </div>
      )}
      
      <div className="space-y-1 mb-3">
        <div className="text-sm">
          <span className="font-semibold">Deaths:</span> {formatNumber(disaster.impact.deaths)}
        </div>
        {disaster.impact.affected && (
          <div className="text-sm">
            <span className="font-semibold">Affected:</span> {formatNumber(disaster.impact.affected)}
          </div>
        )}
        {disaster.impact.economicLossUSD && (
          <div className="text-sm">
            <span className="font-semibold">Economic Loss:</span> ${formatNumber(disaster.impact.economicLossUSD)}
          </div>
        )}
      </div>
      
      <Link
        to={`/event/${disaster.id}`}
        className="inline-block text-primary-600 hover:text-primary-800 font-medium text-sm"
      >
        View detailed information →
      </Link>
    </div>
  );
};

export default DisasterPopup;