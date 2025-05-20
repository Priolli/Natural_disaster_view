import { DisasterEvent } from '../types/disaster';
import { geocodeLocation, isValidCoordinates } from './geocoding';
import { parse, format } from 'date-fns';

export function transformEmdatRecord(record: { [key: string]: string }, index: number): DisasterEvent {
  const startDate = parseDate(record['Start Date'] || record['Year']);
  const endDate = record['End Date'] ? parseDate(record['End Date']) : undefined;
  
  const lat = parseFloat(record['Latitude']) || 0;
  const lng = parseFloat(record['Longitude']) || 0;
  
  // Try to geocode the location if coordinates are missing or invalid
  let coordinates = { lat, lng };
  if (!isValidCoordinates(lat, lng)) {
    const geocoded = geocodeLocation({
      country: record['Country'],
      region: record['Region'],
      city: record['Location']
    });
    
    if (geocoded.coordinates) {
      coordinates = geocoded.coordinates;
    }
  }
  
  return {
    id: `emdat-${record['Disaster No'] || index}`,
    name: record['Event Name'] || `${record['Disaster Type']} in ${record['Country']}`,
    type: mapDisasterType(record['Disaster Type'], record['Disaster Subtype']),
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString(),
    country: record['Country'],
    location: {
      lat: coordinates.lat,
      lng: coordinates.lng,
      country: record['Country'],
      region: record['Region'] || undefined,
    },
    impact: {
      deaths: parseInt(record['Total Deaths']) || 0,
      injured: parseInt(record['No Injured']) || undefined,
      affected: parseInt(record['Total Affected']) || undefined,
      economicLossUSD: parseFloat(record['Total Damages (\'000 US$)']) * 1000 || undefined,
      insuredLossUSD: parseFloat(record['Insured Damages (\'000 US$)']) * 1000 || undefined,
      reconstructionCostUSD: parseFloat(record['Reconstruction Costs (\'000 US$)']) * 1000 || undefined,
      aidContributionUSD: parseFloat(record['Aid Contribution (\'000 US$)']) * 1000 || undefined,
      severityLevel: calculateSeverityLevel(record),
    },
    description: generateDescription(record),
    source: 'EMDAT',
    sourceUrl: 'https://www.emdat.be',
  };
}

export async function parseEmdatCsv(csvData: string): Promise<DisasterEvent[]> {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const record: { [key: string]: string } = {};
      
      headers.forEach((header, i) => {
        record[header] = values[i] || '';
      });
      
      return transformEmdatRecord(record, index);
    })
    .filter(record => record.location.lat !== 0 && record.location.lng !== 0);
}

function parseDate(dateStr: string): Date {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
    
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(parseInt(dateStr), 0, 1);
    }
    
    return new Date();
  } catch (error) {
    console.error('Error parsing date:', dateStr);
    return new Date();
  }
}

function generateDescription(record: { [key: string]: string }): string {
  const type = record['Disaster Type'];
  const subtype = record['Disaster Subtype'];
  const country = record['Country'];
  const deaths = parseInt(record['Total Deaths']) || 0;
  const affected = parseInt(record['Total Affected']) || 0;
  
  let description = `A ${subtype ? `${subtype.toLowerCase()} (${type.toLowerCase()})` : type.toLowerCase()} occurred in ${country}`;
  
  if (deaths) {
    description += `, resulting in ${deaths} deaths`;
  }
  if (affected) {
    description += `${deaths ? ' and' : ','} affecting ${affected} people`;
  }
  
  return description + '.';
}

function mapDisasterType(type: string, subtype?: string): DisasterEvent['type'] {
  const normalizedType = (type || '').trim().toLowerCase();
  const normalizedSubtype = (subtype || '').trim().toLowerCase();

  if (normalizedType.includes('drought') || normalizedSubtype.includes('drought')) {
    return 'drought';
  }

  if (normalizedType.includes('fire') || normalizedSubtype.includes('fire')) {
    return 'wildfire';
  }

  const typeMap: { [key: string]: DisasterEvent['type'] } = {
    'earthquake': 'earthquake',
    'flood': 'flood',
    'storm': 'hurricane',
    'tropical cyclone': 'hurricane',
    'hurricane': 'hurricane',
    'volcanic': 'volcano',
    'volcano': 'volcano',
  };

  for (const [key, value] of Object.entries(typeMap)) {
    if (normalizedType.includes(key) || normalizedSubtype.includes(key)) {
      return value;
    }
  }

  return 'other';
}

function calculateSeverityLevel(record: { [key: string]: string }): 1 | 2 | 3 | 4 | 5 {
  const deaths = parseInt(record['Total Deaths']) || 0;
  const affected = parseInt(record['Total Affected']) || 0;
  const damages = parseFloat(record['Total Damages (\'000 US$)']) || 0;
  
  if (deaths > 10000 || affected > 1000000 || damages > 10000000) return 5;
  if (deaths > 1000 || affected > 100000 || damages > 1000000) return 4;
  if (deaths > 100 || affected > 10000 || damages > 100000) return 3;
  if (deaths > 10 || affected > 1000 || damages > 10000) return 2;
  return 1;
}