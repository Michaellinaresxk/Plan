// constants/airlines.ts
// Comprehensive airline-terminal mapping for Punta Cana International Airport

export interface AirlineInfo {
  terminal: string;
  code: string;
  regions: string[];
  description: string;
}

export interface FormData {
  // Flight details
  date: string;
  airline: string;
  flightNumber: string;
  arrivalTime: string;
  arrivalTerminal?: string;

  // Round trip
  isRoundTrip: boolean;
  returnDate: string;
  returnAirline: string;
  returnFlightNumber: string;
  departureTime: string;
  departureTerminal?: string;

  // Passengers
  passengerCount: number;
  kidsCount: number;

  // Car seats
  needsCarSeat: boolean;
  carSeatCount: number;

  // Vehicle
  vehicleType: string;
  pickupName?: string;
  location: string;
}

export interface FormErrors {
  [key: string]: string;
}

export const AIRLINE_TERMINAL_MAP: Record<string, AirlineInfo> = {
  // Terminal A Airlines
  'American Airlines': {
    terminal: 'A',
    code: 'AA',
    regions: ['North America'],
    description: 'Major US carrier with extensive routes',
  },
  'JetBlue Airways': {
    terminal: 'A',
    code: 'B6',
    regions: ['North America'],
    description: 'Low-cost carrier from US East Coast',
  },
  'Spirit Airlines': {
    terminal: 'A',
    code: 'NK',
    regions: ['North America'],
    description: 'Ultra low-cost carrier',
  },
  'Air Canada': {
    terminal: 'A',
    code: 'AC',
    regions: ['North America'],
    description: "Canada's national airline",
  },
  WestJet: {
    terminal: 'A',
    code: 'WS',
    regions: ['North America'],
    description: 'Canadian low-cost carrier',
  },
  'TUI Airways': {
    terminal: 'A',
    code: 'BY',
    regions: ['Europe'],
    description: 'UK charter airline',
  },
  'Air Europa': {
    terminal: 'A',
    code: 'UX',
    regions: ['Europe'],
    description: 'Spanish airline',
  },
  Condor: {
    terminal: 'A',
    code: 'DE',
    regions: ['Europe'],
    description: 'German leisure airline',
  },
  Eurowings: {
    terminal: 'A',
    code: 'EW',
    regions: ['Europe'],
    description: 'German low-cost airline',
  },

  // Terminal B Airlines
  'Delta Air Lines': {
    terminal: 'B',
    code: 'DL',
    regions: ['North America'],
    description: 'Major US carrier with SkyTeam alliance',
  },
  'United Airlines': {
    terminal: 'B',
    code: 'UA',
    regions: ['North America'],
    description: 'Major US carrier with Star Alliance',
  },
  'Southwest Airlines': {
    terminal: 'B',
    code: 'WN',
    regions: ['North America'],
    description: 'US low-cost carrier',
  },
  'Copa Airlines': {
    terminal: 'B',
    code: 'CM',
    regions: ['Latin America'],
    description: 'Panamanian airline, Star Alliance',
  },
  Avianca: {
    terminal: 'B',
    code: 'AV',
    regions: ['Latin America'],
    description: 'Colombian airline, Star Alliance',
  },
  'British Airways': {
    terminal: 'B',
    code: 'BA',
    regions: ['Europe'],
    description: 'UK flag carrier, Oneworld alliance',
  },
  'Air France': {
    terminal: 'B',
    code: 'AF',
    regions: ['Europe'],
    description: 'French flag carrier, SkyTeam alliance',
  },
  'Frontier Airlines': {
    terminal: 'B',
    code: 'F9',
    regions: ['North America'],
    description: 'US ultra low-cost carrier',
  },
  Arajet: {
    terminal: 'B',
    code: 'DM',
    regions: ['Latin America'],
    description: 'Dominican low-cost carrier',
  },
  Iberojet: {
    terminal: 'B',
    code: 'E9',
    regions: ['Europe'],
    description: 'Spanish charter airline',
  },
  'Edelweiss Air': {
    terminal: 'B',
    code: 'WK',
    regions: ['Europe'],
    description: 'Swiss leisure airline',
  },
  'Air Transat': {
    terminal: 'B',
    code: 'TS',
    regions: ['North America'],
    description: 'Canadian leisure airline',
  },
  'KLM Royal Dutch Airlines': {
    terminal: 'B',
    code: 'KL',
    regions: ['Europe'],
    description: 'Dutch flag carrier, SkyTeam alliance',
  },
  Lufthansa: {
    terminal: 'B',
    code: 'LH',
    regions: ['Europe'],
    description: 'German flag carrier, Star Alliance',
  },

  // Both terminals or flexible
  'LATAM Airlines': {
    terminal: 'A/B',
    code: 'LA',
    regions: ['Latin America'],
    description: 'Latin American airline group',
  },
  'Sunwing Airlines': {
    terminal: 'A/B',
    code: 'WG',
    regions: ['North America'],
    description: 'Canadian charter airline',
  },
};

// Helper functions
export const getAllAirlines = (): string[] => {
  const mappedAirlines = Object.keys(AIRLINE_TERMINAL_MAP);
  return [...mappedAirlines].sort();
};

export const getAirlineInfo = (airline: string): AirlineInfo | null => {
  return AIRLINE_TERMINAL_MAP[airline] || null;
};

export const searchAirlines = (searchTerm: string): string[] => {
  const allAirlines = getAllAirlines();

  if (!searchTerm) return allAirlines;

  return allAirlines.filter(
    (airline) =>
      airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      AIRLINE_TERMINAL_MAP[airline]?.code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
};

export const validateAirlineWithTerminal = (airline: string): string | null => {
  if (!airline) return 'Airline is required';

  const terminalInfo = AIRLINE_TERMINAL_MAP[airline];
  if (!terminalInfo && airline !== 'Other') {
    return 'Please verify terminal information with your airline';
  }

  return null;
};

// Terminal-specific utilities
export const getTerminalAirlines = (terminal: 'A' | 'B'): string[] => {
  return Object.keys(AIRLINE_TERMINAL_MAP).filter(
    (airline) => AIRLINE_TERMINAL_MAP[airline].terminal === terminal
  );
};

export const getAirlinesByRegion = (region: string): string[] => {
  return Object.keys(AIRLINE_TERMINAL_MAP).filter((airline) =>
    AIRLINE_TERMINAL_MAP[airline].regions.includes(region)
  );
};
