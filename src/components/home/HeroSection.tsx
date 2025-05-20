import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const backgrounds = [
    'https://images.pexels.com/photos/1785493/pexels-photo-1785493.jpeg', // Hurricane
    'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg', // Earthquake
    'https://images.pexels.com/photos/1784578/pexels-photo-1784578.jpeg', // Volcano
  ];

  const disasterTypes = [
    'hurricanes',
    'earthquakes',
    'wildfires',
    'floods',
    'tsunamis',
    'droughts',
    'volcanic eruptions',
  ];

  const [currentDisasterIndex, setCurrentDisasterIndex] = useState(0);

  useEffect(() => {
    // Auto-rotate background images
    const bgInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    // Text animation for disaster types
    const textInterval = setInterval(() => {
      setCurrentDisasterIndex((prev) => (prev + 1) % disasterTypes.length);
    }, 2000);

    return () => {
      clearInterval(bgInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Background Images with Crossfade */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden="true"
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Visualizing Global Natural Disasters
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              Explore the patterns and impacts of{' '}
              <span className="relative inline-block">
                <span className="text-white font-semibold">
                  {disasterTypes[currentDisasterIndex]}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500"></span>
              </span>{' '}
              around the world with interactive visualization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/map"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                Explore Map <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center"
              >
                View Analytics <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="mt-12">
              <div className="relative rounded-lg overflow-hidden max-w-xl">
                <input
                  type="text"
                  placeholder="Search for disasters by type, location, or year..."
                  className="w-full py-4 px-5 pr-16 bg-white/10 text-white placeholder-gray-300 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;