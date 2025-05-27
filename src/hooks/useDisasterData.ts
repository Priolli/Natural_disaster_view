import { useState, useEffect, useMemo } from 'react';
import { DisasterEvent } from '../types/disaster';

interface UseDisasterDataOptions {
  csvData?: DisasterEvent[];
}

export function useDisasterData(options: UseDisasterDataOptions = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process EMDAT data
  const disasters = useMemo(() => {
    if (!options.csvData) {
      setLoading(false);
      return [];
    }

    try {
      console.log('Processing', options.csvData.length, 'disaster records');
      setLoading(false);
      return options.csvData;
    } catch (err) {
      console.error('Error processing disaster data:', err);
      setError('Failed to process disaster data');
      setLoading(false);
      return [];
    }
  }, [options.csvData]);

  return {
    disasters,
    loading,
    error,
  };
}