import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';
import { DisasterEvent } from '../types/disaster';
import { useDisasterData } from '../hooks/useDisasterData';
import EventHeader from '../components/event/EventHeader';
import EventImpact from '../components/event/EventImpact';

interface EventDetailPageProps {
  csvData?: DisasterEvent[];
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ csvData }) => {
  const { id } = useParams<{ id: string }>();
  const { disasters, loading } = useDisasterData({ csvData });
  const [event, setEvent] = useState<DisasterEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<DisasterEvent[]>([]);

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
      
      <div className="container mx-auto px-4 mt-24">
        <Link to="/map" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to map
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          
          <div>
            <EventImpact event={event} />
            
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