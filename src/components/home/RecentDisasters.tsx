import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDisasterData } from '../../hooks/useDisasterData';
import DisasterCard from '../DisasterCard';

const RecentDisasters: React.FC = () => {
  const { disasters } = useDisasterData();

  const recentDisasters = disasters
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Recent Disasters</h2>
          <Link 
            to="/recent-disasters" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View all <ArrowRight className="ml-1 w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentDisasters.map((disaster) => (
            <DisasterCard key={disaster.id} disaster={disaster} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentDisasters;