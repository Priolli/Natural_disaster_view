export interface DisasterEvent {
  id: string;
  name: string;
  type: DisasterType;
  subType?: string;
  startDate: string;
  endDate?: string;
  country: string;
  location: Location;
  impact: DisasterImpact;
  description: string;
  source: 'EMDAT' | 'OTHER';
  sourceUrl?: string;
  imageUrl?: string;
}

export type DisasterType = 
  | 'earthquake'
  | 'flood'
  | 'hurricane'
  | 'wildfire'
  | 'tsunami'
  | 'drought'
  | 'volcano'
  | 'other';

export interface Location {
  lat: number;
  lng: number;
  country: string;
  region?: string;
  city?: string;
}

export interface DisasterImpact {
  deaths: number;
  injured?: number;
  missing?: number;
  affected?: number;
  displaced?: number;
  economicLossUSD?: number;
  infrastructureDamage?: string;
  severityLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface FilterOptions {
  types: DisasterType[];
  subTypes?: string[];
  startDate?: string;
  endDate?: string;
  countries?: string[];
  minDeaths?: number;
  minAffected?: number;
  severityLevel?: 1 | 2 | 3 | 4 | 5;
}