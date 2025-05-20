import React from 'react';
import { AlertTriangle, Users, DollarSign, Building, Activity } from 'lucide-react';
import { DisasterEvent } from '../../types/disaster';

interface EventImpactProps {
  event: DisasterEvent;
}

const EventImpact: React.FC<EventImpactProps> = ({ event }) => {
  const formatNumber = (num: number | undefined): string => {
    if (!num) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Impact Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="p-2 rounded-md bg-red-100 text-red-600 mr-3">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-gray-500">Deaths</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatNumber(event.impact.deaths)}
              </p>
            </div>
          </div>
          
          {event.impact.injured && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-orange-100 text-orange-600 mr-3">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Injured</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatNumber(event.impact.injured)}
                </p>
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
                <p className="text-lg font-semibold text-gray-800">
                  {formatNumber(event.impact.affected)}
                </p>
              </div>
            </div>
          )}

          {event.magnitude && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Magnitude</p>
                <p className="text-lg font-semibold text-gray-800">
                  {event.magnitude.value} {event.magnitude.scale}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {event.impact.economicLossUSD && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                <DollarSign className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Total Economic Loss</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(event.impact.economicLossUSD)}
                </p>
              </div>
            </div>
          )}
          
          {event.impact.insuredLossUSD && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-emerald-100 text-emerald-600 mr-3">
                <DollarSign className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Insured Loss</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(event.impact.insuredLossUSD)}
                </p>
              </div>
            </div>
          )}
          
          {event.impact.reconstructionCostUSD && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-yellow-100 text-yellow-600 mr-3">
                <Building className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Reconstruction Cost</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(event.impact.reconstructionCostUSD)}
                </p>
              </div>
            </div>
          )}
          
          {event.impact.aidContributionUSD && (
            <div className="flex items-start">
              <span className="p-2 rounded-md bg-teal-100 text-teal-600 mr-3">
                <DollarSign className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">Aid Contribution</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(event.impact.aidContributionUSD)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventImpact;