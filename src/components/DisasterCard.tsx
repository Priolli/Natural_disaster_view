import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, AlertTriangle, Info } from 'lucide-react';
import { DisasterEvent } from '../types/disaster';
import { isValidCoordinates } from '../services/geocoding';

interface DisasterCardProps {
  disaster: DisasterEvent;
  variant?: 'default' | 'compact';
}

const DisasterCard: React.FC<DisasterCardProps> = ({ disaster, variant = 'default' }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDisasterColor = (type: DisasterEvent['type']): string => {
    const baseColors: Record<DisasterEvent['type'], string> = {
      earthquake: 'bg-earthquake/10 text-earthquake border-earthquake',
      flood: 'bg-flood/10 text-flood border-flood',
      hurricane: 'bg-hurricane/10 text-hurricane border-hurricane',
      wildfire: 'bg-wildfire/10 text-wildfire border-wildfire',
      drought: 'bg-drought/10 text-drought border-drought',
      volcano: 'bg-volcano/10 text-volcano border-volcano',
      other: 'bg-gray-100 text-gray-700 border-gray-300',
    };

    return baseColors[type];
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDisasterColor(disaster.type)}`}>
              {disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded">
              {disaster.source}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(disaster.startDate)}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {disaster.name}
        </h3>
        
        <div className="flex items-center text-gray-600 text-xs mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="line-clamp-1">{disaster.location.country}</span>
        </div>
        
        <Link
          to={`/event/${disaster.id}`}
          className="text-primary-600 hover:text-primary-700 text-xs font-medium"
        >
          View Details →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {disaster.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={disaster.imageUrl}
            alt={disaster.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDisasterColor(disaster.type)}`}>
              {disaster.type.charAt(0).toUpperCase() + disaster.type.slice(1)}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
              {disaster.source}
            </span>
          </div>
          <span className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(disaster.startDate)}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {disaster.name}
        </h2>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{disaster.location.country}</span>
          {disaster.location.region && (
            <span className="ml-1">({disaster.location.region})</span>
          )}
        </div>

        {!isValidCoordinates(disaster.location.lat, disaster.location.lng) && (
          <div className="flex items-center text-xs text-amber-600 mb-2">
            <Info className="w-4 h-4 mr-1" />
            <span>Location approximated from {disaster.location.region || 'country'} data</span>
          </div>
        )}

        <p className="text-gray-600 mb-4 line-clamp-3">
          {disaster.description}
        </p>

        <div className="space-y-2 mb-4">
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
          {disaster.impact.insuredLossUSD && (
            <div className="text-sm">
              <span className="font-semibold">Insured Loss:</span> ${formatNumber(disaster.impact.insuredLossUSD)}
            </div>
          )}
          {disaster.impact.reconstructionCostUSD && (
            <div className="text-sm">
              <span className="font-semibold">Reconstruction Cost:</span> ${formatNumber(disaster.impact.reconstructionCostUSD)}
            </div>
          )}
          {disaster.impact.aidContributionUSD && (
            <div className="text-sm">
              <span className="font-semibold">Aid Contribution:</span> ${formatNumber(disaster.impact.aidContributionUSD)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">
              Severity Level: {disaster.impact.severityLevel || 'Unknown'}
            </span>
          </div>
          <Link
            to={`/event/${disaster.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisasterCard;