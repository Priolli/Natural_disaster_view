import locationData from '../data/knownRegionCoords.json';

interface Coordinates {
  lat: number;
  lng: number;
}

interface GeocodeResult {
  coordinates: Coordinates | null;
  fallbackLevel: 'exact' | 'city' | 'region' | 'country' | 'failed';
  errors: string[];
}

interface LocationInput {
  coordinates?: {
    lat: number;
    lng: number;
  };
  city?: string;
  region?: string;
  country: string;
}

export function geocodeLocation(location: LocationInput): GeocodeResult {
  const errors: string[] = [];

  // Step 1: Use exact coordinates if provided and valid
  if (location.coordinates && isValidCoordinates(location.coordinates.lat, location.coordinates.lng)) {
    return {
      coordinates: location.coordinates,
      fallbackLevel: 'exact',
      errors: []
    };
  }

  // Step 2: Try city-level coordinates
  if (location.city && locationData.cities?.[location.city]) {
    return {
      coordinates: locationData.cities[location.city],
      fallbackLevel: 'city',
      errors
    };
  }
  if (location.city) {
    errors.push(`No coordinates found for city: ${location.city}`);
  }

  // Step 3: Try region/state-level coordinates
  if (location.region) {
    // Handle common region name variations
    const normalizedRegion = location.region
      .replace(/(province|state|region)$/i, '')
      .trim();
    
    if (locationData.regions?.[normalizedRegion]) {
      return {
        coordinates: locationData.regions[normalizedRegion],
        fallbackLevel: 'region',
        errors
      };
    }
    errors.push(`No coordinates found for region: ${location.region}`);
  }

  // Step 4: Use country-level coordinates as last resort
  if (location.country && locationData.countries?.[location.country]) {
    return {
      coordinates: locationData.countries[location.country],
      fallbackLevel: 'country',
      errors
    };
  }
  errors.push(`No coordinates found for country: ${location.country}`);

  // No valid coordinates found at any level
  return {
    coordinates: null,
    fallbackLevel: 'failed',
    errors
  };
}

export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat !== 0 &&
    lng !== 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}