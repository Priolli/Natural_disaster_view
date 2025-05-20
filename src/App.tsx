import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailPage from './pages/EventDetailPage';
import AboutPage from './pages/AboutPage';
import CsvUpload from './components/data/CsvUpload';
import ErrorBoundary from './components/ErrorBoundary';
import { DisasterEvent } from './types/disaster';

function App() {
  const [csvData, setCsvData] = useState<DisasterEvent[]>([]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <ErrorBoundary>
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-4">
              <ErrorBoundary>
                <CsvUpload onDataParsed={setCsvData} />
              </ErrorBoundary>
            </div>
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <HomePage csvData={csvData} />
                </ErrorBoundary>
              } />
              <Route path="/map" element={
                <ErrorBoundary>
                  <MapPage csvData={csvData} />
                </ErrorBoundary>
              } />
              <Route path="/dashboard" element={
                <ErrorBoundary>
                  <DashboardPage csvData={csvData} />
                </ErrorBoundary>
              } />
              <Route path="/event/:id" element={
                <ErrorBoundary>
                  <EventDetailPage csvData={csvData} />
                </ErrorBoundary>
              } />
              <Route path="/about" element={
                <ErrorBoundary>
                  <AboutPage />
                </ErrorBoundary>
              } />
            </Routes>
          </main>
          <Footer />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;