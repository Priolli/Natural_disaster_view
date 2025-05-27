import { DisasterEvent } from '../types/disaster';
import { geocodeLocation, isValidCoordinates } from './geocoding';
import { parse, isValid } from 'date-fns';

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') {
    console.warn('Empty date string provided');
    return null;
  }

  // Try parsing as ISO date first
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // Handle year-only format (e.g., "1990")
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr, 10), 0, 1);
  }

  // Handle DD/MM/YYYY format
  const ddmmyyyy = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [_, day, month, year] = ddmmyyyy;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  console.warn('Failed to parse date:', dateStr);
  return null;
}

function isNaturalDisaster(type: string, subtype?: string): boolean {
  const t = (type || '').toLowerCase();
  const s = (subtype || '').toLowerCase();
  
  const naturalDisasters = [
    'earthquake',
    'flood',
    'storm',
    'hurricane',
    'typhoon',
    'cyclone',
    'tornado',
    'tsunami',
    'volcanic',
    'volcano',
    'drought',
    'wildfire',
    'forest fire',
    'landslide',
    'avalanche',
    'extreme temperature',
    'cold wave',
    'heat wave'
  ];

  return naturalDisasters.some(d => t.includes(d) || s.includes(d));
}

function parseFinancialValue(value: string | undefined): number | undefined {
  if (!value || value.trim() === '') return undefined;

  // Remove any currency symbols, commas, and spaces
  const cleanValue = value.replace(/[$,\s]/g, '').trim();
  
  // Convert to number
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? undefined : numValue;
}

export function transformEmdatRecord(record: { [key: string]: string }, index: number): DisasterEvent | null {
  try {
    // Check if it's a natural disaster
    if (!isNaturalDisaster(record['Disaster Type'], record['Disaster Subtype'])) {
      return null;
    }

    // Extract coordinates from record
    const lat = parseFloat(record['Latitude'] || '0');
    const lng = parseFloat(record['Longitude'] || '0');

    // Try geocoding with fallbacks
    const geocodeResult = geocodeLocation({
      coordinates: { lat, lng },
      city: record['Location'],
      region: record['Region'],
      country: record['Country']
    });

    if (!geocodeResult.coordinates) {
      console.warn('Failed to geocode location:', geocodeResult.errors);
      return null;
    }

    // Parse dates
    const startDate = parseDate(record['Start Date'] || record['Year']);
    if (!startDate) {
      console.warn('Invalid start date:', record['Start Date'] || record['Year']);
      return null;
    }

    const endDate = record['End Date'] ? parseDate(record['End Date']) : undefined;

    // Parse financial data with fallbacks
    let economicLossUSD = parseFinancialValue(record['Total Damages (\'000 US$)']);
    if (economicLossUSD) {
      economicLossUSD *= 1000; // Convert from thousands to actual USD
    } else {
      // Try alternative fields
      const adjustedDamages = parseFinancialValue(record['Total Damages, Adjusted (\'000 US$)']);
      if (adjustedDamages) {
        economicLossUSD = adjustedDamages * 1000;
      }
    }

    // Parse insured losses if available
    let insuredLossUSD = parseFinancialValue(record['Insured Damages (\'000 US$)']);
    if (insuredLossUSD) {
      insuredLossUSD *= 1000;
    }

    return {
      id: `emdat-${record['Disaster No'] || index}`,
      name: record['Event Name'] || `${record['Disaster Type']} in ${record['Country']}`,
      type: mapDisasterType(record['Disaster Type'], record['Disaster Subtype']),
      subType: record['Disaster Subtype'] || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      country: record['Country'],
      location: {
        lat: geocodeResult.coordinates.lat,
        lng: geocodeResult.coordinates.lng,
        country: record['Country'],
        region: record['Region'] || undefined,
      },
      impact: {
        deaths: parseInt(record['Total Deaths'] || '0') || 0,
        injured: parseInt(record['No Injured'] || '0') || undefined,
        affected: parseInt(record['Total Affected'] || '0') || undefined,
        economicLossUSD,
        insuredLossUSD,
        severityLevel: calculateSeverityLevel(record),
      },
      description: generateDescription(record),
      source: 'EMDAT',
      sourceUrl: 'https://www.emdat.be',
    };
  } catch (error) {
    console.error('Error transforming record:', error, record);
    return null;
  }
}

export async function parseEmdatCsv(csvData: string): Promise<DisasterEvent[]> {
  try {
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
      .filter((record): record is DisasterEvent => 
        record !== null && 
        record.location.lat !== 0 && 
        record.location.lng !== 0
      );
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file. Please check the format.');
  }
}

function generateDescription(record: { [key: string]: string }): string {
  const type = record['Disaster Type'];
  const subtype = record['Disaster Subtype'];
  const country = record['Country'];
  const deaths = parseInt(record['Total Deaths'] || '0') || 0;
  const affected = parseInt(record['Total Affected'] || '0') || 0;
  const economicLoss = parseFinancialValue(record['Total Damages (\'000 US$)']) || 0;
  
  let description = `A ${subtype ? `${subtype.toLowerCase()} (${type.toLowerCase()})` : type.toLowerCase()} occurred in ${country}`;
  
  if (deaths) {
    description += `, resulting in ${deaths.toLocaleString()} deaths`;
  }
  if (affected) {
    description += `${deaths ? ' and' : ','} affecting ${affected.toLocaleString()} people`;
  }
  if (economicLoss) {
    description += `${deaths || affected ? ' with' : ','} economic losses of $${(economicLoss * 1000).toLocaleString()}`;
  }
  
  return description + '.';
}

function mapDisasterType(type: string, subtype?: string): DisasterEvent['type'] {
  const normalizedType = (type || '').trim().toLowerCase();
  const normalizedSubtype = (subtype || '').trim().toLowerCase();

  // Define comprehensive type mappings
  const typeMap: { [key: string]: DisasterEvent['type'] } = {
    // Earthquake related
    'earthquake': 'earthquake',
    'seismic activity': 'earthquake',
    'ground movement': 'earthquake',
    'seismic': 'earthquake',
    'quake': 'earthquake',

    // Flood related
    'flood': 'flood',
    'flooding': 'flood',
    'flash flood': 'flood',
    'riverine flood': 'flood',
    'coastal flood': 'flood',
    'storm surge': 'flood',
    'inundation': 'flood',

    // Hurricane/Storm related
    'storm': 'hurricane',
    'tropical cyclone': 'hurricane',
    'hurricane': 'hurricane',
    'typhoon': 'hurricane',
    'cyclone': 'hurricane',
    'tornado': 'hurricane',
    'wind storm': 'hurricane',

    // Tsunami related
    'tsunami': 'tsunami',
    'tidal wave': 'tsunami',
    'seismic wave': 'tsunami',

    // Volcano related
    'volcanic': 'volcano',
    'volcano': 'volcano',
    'eruption': 'volcano',
    'volcanic activity': 'volcano',
    'volcanic eruption': 'volcano',
    'lava': 'volcano',

    // Drought related
    'drought': 'drought',
    'dry spell': 'drought',
    'water deficit': 'drought',

    // Wildfire related
    'fire': 'wildfire',
    'wildfire': 'wildfire',
    'forest fire': 'wildfire',
    'bush fire': 'wildfire',
    'grass fire': 'wildfire'
  };

  // Check both type and subtype against the mapping
  for (const [key, value] of Object.entries(typeMap)) {
    if (normalizedType.includes(key) || normalizedSubtype.includes(key)) {
      return value;
    }
  }

  // Special case handling for complex types
  if (normalizedType.includes('drought') || normalizedSubtype.includes('drought')) {
    return 'drought';
  }

  if (normalizedType.includes('fire') || normalizedSubtype.includes('fire')) {
    return 'wildfire';
  }

  if (normalizedType.includes('tsunami') || normalizedSubtype.includes('tsunami')) {
    return 'tsunami';
  }

  // If no match found, return 'other'
  return 'other';
}

function calculateSeverityLevel(record: { [key: string]: string }): 1 | 2 | 3 | 4 | 5 {
  const deaths = parseInt(record['Total Deaths'] || '0') || 0;
  const affected = parseInt(record['Total Affected'] || '0') || 0;
  const damages = parseFinancialValue(record['Total Damages (\'000 US$)']) || 0;
  
  // Calculate severity based on multiple factors
  let severityScore = 0;
  
  // Deaths impact (0-5 points)
  if (deaths > 10000) severityScore += 5;
  else if (deaths > 1000) severityScore += 4;
  else if (deaths > 100) severityScore += 3;
  else if (deaths > 10) severityScore += 2;
  else if (deaths > 0) severityScore += 1;

  // Affected population impact (0-5 points)
  if (affected > 1000000) severityScore += 5;
  else if (affected > 100000) severityScore += 4;
  else if (affected > 10000) severityScore += 3;
  else if (affected > 1000) severityScore += 2;
  else if (affected > 0) severityScore += 1;

  // Economic impact (0-5 points)
  const economicLoss = damages * 1000; // Convert to actual USD
  if (economicLoss > 1000000000) severityScore += 5; // > $1B
  else if (economicLoss > 100000000) severityScore += 4; // > $100M
  else if (economicLoss > 10000000) severityScore += 3; // > $10M
  else if (economicLoss > 1000000) severityScore += 2; // > $1M
  else if (economicLoss > 0) severityScore += 1;

  // Calculate final severity level (1-5)
  const maxPossibleScore = 15; // 5 points each for deaths, affected, and economic impact
  const normalizedScore = Math.ceil((severityScore / maxPossibleScore) * 5);
  
  return Math.max(1, Math.min(5, normalizedScore)) as 1 | 2 | 3 | 4 | 5;
}