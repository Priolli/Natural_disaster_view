import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl mb-3">
              <AlertTriangle className="h-6 w-6" />
              <span>GlobalDisasterTracker</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Interactive visualization of global natural disaster data from EMDAT and GDACS databases.
              Helping researchers, students, and the public understand patterns and impacts of natural disasters.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@globalDisasterTracker.org" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/map" className="text-gray-400 hover:text-white transition-colors">Map</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="space-y-2">
              <li><a href="https://www.emdat.be" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">EMDAT Database</a></li>
              <li><a href="https://www.gdacs.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GDACS</a></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Data Methodology</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Global Disaster Tracker. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/accessibility" className="text-gray-500 hover:text-white text-sm transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;