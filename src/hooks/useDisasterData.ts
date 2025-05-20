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
    console.log('useDisasterData hook - Processing data:', options.csvData?.length || 0, 'records');
    setLoading(false);
    return options.csvData || [];
  }, [options.csvData]);

  return {
    disasters,
    loading,
    error,
  };
}