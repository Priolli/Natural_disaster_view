import React from 'react';
import { DisasterEvent } from '../../types/disaster';
import { Calendar, MapPin, AlertCircle, Compass, Flag } from 'lucide-react';

interface EventHeaderProps {
  event: DisasterEvent;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Date unknown';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBackgroundGradient = () => {
    switch (event.type) {
      case 'earthquake':
        return 'bg-gradient-to-br from-red-500/90 to-red-800/90';
      case 'flood':
        return 'bg-gradient-to-br from-blue-500/90 to-blue-800/90';
      case 'hurricane':
        return 'bg-gradient-to-br from-purple-500/90 to-purple-800/90';
      case 'wildfire':
        return 'bg-gradient-to-br from-orange-500/90 to-orange-800/90';
      case 'tsunami':
        return 'bg-gradient-to-br from-cyan-500/90 to-cyan-800/90';
      case 'drought':
        return 'bg-gradient-to-br from-yellow-500/90 to-yellow-800/90';
      case 'volcano':
        return 'bg-gradient-to-br from-red-600/90 to-orange-700/90';
      default:
        return 'bg-gradient-to-br from-gray-700/90 to-gray-900/90';
    }
  };

  return (
    <div className="relative">
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.imageUrl || 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'})`,
          }}
        ></div>
        <div className={`absolute inset-0 ${getBackgroundGradient()}`}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="absolute -bottom-20 bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white bg-${event.type}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span className="ml-3 text-gray-500 text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(event.startDate)}
                  {event.endDate && ` - ${formatDate(event.endDate)}`}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{event.location.country}</span>
                </div>
                {event.location.region && (
                  <div className="flex items-center">
                    <Compass className="h-5 w-5 mr-1" />
                    <span>{event.location.region}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Flag className="h-5 w-5 mr-1" />
                  <span>Source: {event.source}</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-1" />
                  <span>
                    Severity: {event.impact.severityLevel
                      ? `Level ${event.impact.severityLevel} (of 5)`
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;