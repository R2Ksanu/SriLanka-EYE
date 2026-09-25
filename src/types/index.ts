// Core Type Definitions for Sri Lanka - The Journey of a Nation

export type Language = 'en' | 'si' | 'ta';

export interface DataSource {
  id: string;
  title: string;
  organization: string;
  publicationDate: string;
  datasetDate: string;
  url: string;
  indicator: string;
  methodology: string;
  license: string;
  notes: string;
}

export interface EconomicIndicatorYear {
  year: number;
  gdpNominalUSD: number | null; // in Billions USD
  gdpNominalLKR: number | null; // in Billions LKR
  gdpRealGrowthPct: number | null; // % year-on-year
  gdpPerCapitaUSD: number | null; // USD
  inflationCCPI: number | null; // Colombo Consumer Price Index %
  exchangeRateLKRUSD: number | null; // Year-end or annual average LKR per 1 USD
  exportsUSD: number | null; // Billions USD
  importsUSD: number | null; // Billions USD
  tradeBalanceUSD: number | null; // Billions USD (Exports - Imports)
  govRevenuePctGDP: number | null; // % of GDP
  govExpenditurePctGDP: number | null; // % of GDP
  publicDebtPctGDP: number | null; // Central Government debt as % of GDP
  foreignReservesUSD: number | null; // Gross Official Reserves in Billions USD
  workerRemittancesUSD: number | null; // Billions USD
  touristArrivals: number | null; // Number of annual tourists
  unemploymentRatePct: number | null; // % of labour force
  labourForceCount: number | null; // in Millions
  agricultureSharePct: number | null; // % of GDP
  industrySharePct: number | null; // % of GDP
  servicesSharePct: number | null; // % of GDP
  methodologyNotes?: string;
  status: 'official' | 'estimated' | 'revised' | 'provisional';
  sourceId: string;
}

export interface DemographicYear {
  year: number;
  population: number; // exact count / estimate
  populationGrowthPct: number | null;
  densityPerKm2: number | null;
  isCensusYear: boolean;
  censusDetails?: {
    censusNumber: number;
    officialSuperintendent?: string;
    totalCount: number;
    keyObservation: string;
  };
  lifeExpectancyYears: number | null;
  urbanPct: number | null;
  ruralPct: number | null;
  medianAge: number | null;
  birthRatePer1000: number | null;
  deathRatePer1000: number | null;
  status: 'official_census' | 'official_estimate' | 'historical_reconstruction';
  sourceId: string;
}

export interface AgeCohort {
  ageRange: string;
  malePct: number;
  femalePct: number;
  maleCount: number;
  femaleCount: number;
}

export interface DistrictData {
  id: string;
  name: string;
  nameSi: string;
  nameTa: string;
  province: string;
  provinceSi: string;
  provinceTa: string;
  capital: string;
  areaKm2: number;
  population2024: number; // 2024 Census of Population & Housing preliminary/final DCS
  densityPerKm2: number;
  urbanizationPct: number;
  employmentAgriPct: number;
  employmentIndustryPct: number;
  employmentServicesPct: number;
  majorIndustries: string[];
  agricultureProducts: string[];
  historicalLandmarks: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  svgPathCoordinates?: string;
}

export type ConstitutionalEra = 
  | 'Soulbury Constitution (1947–1972)' 
  | 'First Republican Constitution (1972–1978)' 
  | 'Second Republican Constitution - Executive Presidency (1978–Present)';

export interface NationalLeader {
  id: string;
  name: string;
  nameSi: string;
  nameTa: string;
  title: string;
  office: 'Prime Minister (Head of Government)' | 'President (Head of State)' | 'Executive President (Head of State & Government)';
  constitutionalEra: ConstitutionalEra;
  termStart: string; // ISO date 'YYYY-MM-DD'
  termEnd: string;
  yearsActive: string;
  portraitUrl: string;
  summary: string;
  historicalContext: string;
  documentedMajorEvents: string[];
  majorInfrastructureAndPolicies: string[];
  economicIndicatorsDuringTerm: {
    startYear: number;
    endYear: number;
    startGDPUSD?: number;
    endGDPUSD?: number;
    startPerCapitaUSD?: number;
    endPerCapitaUSD?: number;
    avgGrowthPct?: number;
    startInflationPct?: number;
    endInflationPct?: number;
    startDebtPctGDP?: number;
    endDebtPctGDP?: number;
    startExchangeRate?: number;
    endExchangeRate?: number;
    notes: string;
  };
  sourceIds: string[];
}

export type TimelineCategory = 
  | 'Ancient Era'
  | 'Medieval Kingdoms'
  | 'Colonial Period'
  | 'Independence'
  | 'Republic'
  | 'Executive Presidency'
  | 'Modern Era'
  | 'Current Era'
  | 'Future';

export type EventFilterCategory = 
  | 'All'
  | 'Politics'
  | 'Economy'
  | 'War / Conflict'
  | 'Technology'
  | 'Infrastructure'
  | 'Population'
  | 'Education'
  | 'Healthcare'
  | 'Environment'
  | 'Culture'
  | 'International Relations';

export interface TimelineEventItem {
  id: string;
  year: number;
  displayDate: string;
  title: string;
  titleSi: string;
  titleTa: string;
  era: TimelineCategory;
  category: EventFilterCategory;
  description: string;
  significance: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  imageUrl?: string;
  imageCaption?: string;
  imageCredit?: string;
  license?: string;
  relatedLeaderId?: string;
  relatedIndicators?: {
    gdpUSD?: string;
    population?: string;
    inflation?: string;
    exchangeRate?: string;
  };
  sources: string[];
}

export interface HistoricalMapEra {
  id: string;
  year: number;
  label: string;
  periodName: string;
  description: string;
  territorialDivisions: {
    name: string;
    entityType: 'Kingdom' | 'Colonial Territory' | 'Vanniar Chieftaincy' | 'Sovereign Republic';
    rulerOrPower: string;
    capital: string;
    color: string;
    description: string;
    keyCenters: { name: string; lat: number; lng: number }[];
  }[];
  strategicPorts: {
    name: string;
    lat: number;
    lng: number;
    role: string;
    controlledBy: string;
  }[];
  disclaimer: string;
}

export interface FutureScenario {
  year: number;
  type: 'Official Forecast' | 'UN Population Projection' | 'World Bank Medium-term Outlook' | 'Interactive Model Scenario' | 'Institutional Projection';
  gdpUSD: number;
  gdpRealGrowthPct: number;
  gdpPerCapitaUSD: number;
  populationMillions: number;
  urbanizationPct: number;
  renewableEnergyPct: number;
  notes: string;
  source: string;
}

export interface ArchiveImage {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  location: string;
  credit: string;
  license: string;
  imageUrl: string;
  sourceUrl: string;
}
