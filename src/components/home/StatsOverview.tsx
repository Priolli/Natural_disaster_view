import React from 'react';
import { Activity, Users, DollarSign, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const StatsOverview: React.FC = () => {
  // In a real application, this data would come from an API
  const stats = [
    {
      title: 'Disasters Tracked',
      value: '23,569',
      icon: <Activity className="h-6 w-6 text-white" />,
      description: 'From 1900 to present',
      color: 'bg-primary-600',
    },
    {
      title: 'People Affected',
      value: '4.3B+',
      icon: <Users className="h-6 w-6 text-white" />,
      description: 'Globally since records began',
      color: 'bg-warning-500',
    },
    {
      title: 'Economic Losses',
      value: '$3.8T+',
      icon: <DollarSign className="h-6 w-6 text-white" />,
      description: 'In 2023 USD, estimated total',
      color: 'bg-danger-600',
    },
    {
      title: 'Data Timespan',
      value: '123 Years',
      icon: <Calendar className="h-6 w-6 text-white" />,
      description: 'Historical disaster coverage',
      color: 'bg-success-600',
    },
  ];

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Global Disaster Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;