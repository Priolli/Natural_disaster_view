import React from 'react';
import { Globe, Database, Code, Users, ArrowUpRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About GlobalDisasterTracker</h1>
        
        <div className="prose prose-lg max-w-none mb-12">
          <p>
            GlobalDisasterTracker is an interactive, educational website visualizing global natural disaster data from EMDAT and GDACS databases. 
            Our mission is to provide researchers, students, policymakers, and the general public with accessible, accurate, and comprehensive information about natural disasters worldwide.
          </p>
          
          <p>
            By exploring patterns, impacts, and trends of natural disasters throughout history, we aim to contribute to a better understanding of these events,
            help inform disaster preparedness and mitigation strategies, and raise awareness about the increasing frequency and severity of natural disasters in the face of climate change.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-md">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Interactive World Map</h3>
            </div>
            <p className="text-gray-600">
              Explore natural disasters on our interactive map with custom markers by disaster type, clustering for multiple events, and detailed tooltips with key statistics.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-secondary-100 text-secondary-600 rounded-md">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Comprehensive Data</h3>
            </div>
            <p className="text-gray-600">
              Access comprehensive disaster data from 1900 to the present day, including information on fatalities, economic impact, and affected populations worldwide.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-accent-100 text-accent-600 rounded-md">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Advanced Analytics</h3>
            </div>
            <p className="text-gray-600">
              Visualize disaster trends and patterns with our analytics dashboard featuring customizable charts, data export functionality, and cross-filtering between visualizations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-success-100 text-success-600 rounded-md">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Educational Resources</h3>
            </div>
            <p className="text-gray-600">
              Learn about different types of natural disasters, their causes, effects, and historical significance through detailed event pages and contextual information.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Sources</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <p className="text-gray-700 mb-4">
            Our platform integrates data from the following authoritative sources:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">EMDAT (Emergency Events Database)</h3>
              <p className="text-gray-600 mb-2">
                Maintained by the Centre for Research on the Epidemiology of Disasters (CRED), EMDAT contains essential data on the occurrence and effects of over 22,000 mass disasters worldwide from 1900 to the present day.
              </p>
              <a 
                href="https://www.emdat.be" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Visit EMDAT <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">GDACS (Global Disaster Alert and Coordination System)</h3>
              <p className="text-gray-600 mb-2">
                A cooperation framework between the United Nations and the European Commission, GDACS provides real-time alerts about natural disasters around the world and tools to facilitate response coordination.
              </p>
              <a 
                href="https://www.gdacs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Visit GDACS <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            We welcome feedback, suggestions, and collaboration opportunities. Please reach out to us at:
          </p>
          
          <a 
            href="mailto:info@globalDisasterTracker.org" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            info@globalDisasterTracker.org
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;