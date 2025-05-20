import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsOverview from '../components/home/StatsOverview';
import RecentDisasters from '../components/home/RecentDisasters';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <StatsOverview />
      <RecentDisasters />
    </div>
  );
};

export default HomePage;