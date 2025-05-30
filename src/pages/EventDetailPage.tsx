import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, DollarSign, Building, AlertTriangle } from 'lucide-react';
import { DisasterEvent } from '../types/disaster';
import { useDisasterData } from '../hooks/useDisasterData';
import EventHeader from '../components/event/EventHeader';

interface EventDetailPageProps {
  csvData?: DisasterEvent[];
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ csvData }) => {
  const { id } = useParams<{ id: string }>();
  const { disasters, loading } = useDisasterData({ csvData });
  const [event, setEvent] = useState<DisasterEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<DisasterEvent[]>([]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency in USD
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    if (!loading && disasters.length > 0 && id) {
      const foundEvent = disasters.find(disaster => disaster.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
        
        // Find related events (same type or country)
        const related = disasters
          .filter(d => d.id !== id && (
            d.type === foundEvent.type || 
            d.country === foundEvent.country
          ))
          .slice(0, 3);
        
        setRelatedEvents(related);
      }
    }
  }, [id, disasters, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-pulse">
          <AlertTriangle className="h-12 w-12 text-primary-500" />
          <p className="mt-2 text-gray-600">Loading disaster information...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The disaster event you're looking for doesn't exist or has been removed.</p>
          <Link to="/map" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to disaster map
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <EventHeader event={event} />
      
      {/* Main content */}
      <div className="container mx-auto px-4 mt-24">
        <Link to="/map" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to map
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Event</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {event.description}
              </p>
              
              {event.sourceUrl && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Source</h3>
                  <a 
                    href={event.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {event.source} Database
                  </a>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Timeline</h2>
              <div className="relative border-l-2 border-gray-200 pl-8 ml-4">
                <div className="mb-8 relative">
                  <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Event Start</h3>
                  <p className="text-gray-600">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
                {event.endDate && (
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Event End</h3>
                    <p className="text-gray-600">
                      {new Date(event.endDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - stats and related */}
          <div>
            {/* Impact Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="p-2 rounded-md bg-red-100 text-red-600 mr-3">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Deaths</p>
                    <p className="text-lg font-semibold text-gray-800">{formatNumber(event.impact.deaths)}</p>
                  </div>
                </div>
                
                {event.impact.injured && (
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-orange-100 text-orange-600 mr-3">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Injured</p>
                      <p className="text-lg font-semibold text-gray-800">{formatNumber(event.impact.injured)}</p>
                    </div>
                  </div>
                )}
                
                {event.impact.missing && (
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Missing</p>
                      <p className="text-lg font-semibold text-gray-800">{formatNumber(event.impact.missing)}</p>
                    </div>
                  </div>
                )}
                
                {event.impact.affected && (
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                      <Users className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">People Affected</p>
                      <p className="text-lg font-semibold text-gray-800">{formatNumber(event.impact.affected)}</p>
                    </div>
                  </div>
                )}
                
                {event.impact.economicLossUSD && (
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                      <DollarSign className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Economic Losses</p>
                      <p className="text-lg font-semibold text-gray-800">{formatCurrency(event.impact.economicLossUSD)}</p>
                    </div>
                  </div>
                )}
                
                {event.impact.infrastructureDamage && (
                  <div className="flex items-start">
                    <span className="p-2 rounded-md bg-yellow-100 text-yellow-600 mr-3">
                      <Building className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Infrastructure Damage</p>
                      <p className="text-lg font-semibold text-gray-800">{event.impact.infrastructureDamage}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Related Disasters */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Related Disasters</h2>
                <div className="space-y-4">
                  {relatedEvents.map(related => (
                    <Link 
                      key={related.id} 
                      to={`/event/${related.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-800">{related.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="flex items-center mr-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(related.startDate).toLocaleDateString()}
                        </span>
                        <span className="capitalize">{related.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;