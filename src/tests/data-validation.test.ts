import { describe, it, expect } from 'vitest';
import { ECONOMIC_INDICATORS } from '../data/economy/indicators';
import { HISTORICAL_DEMOGRAPHICS } from '../data/population/demographics';
import { NATIONAL_LEADERS } from '../data/leadership/leaders';
import { TIMELINE_EVENTS } from '../data/history/timeline';
import { SRI_LANKA_DISTRICTS } from '../data/maps/districts';
import { DATA_SOURCES } from '../data/sources/sources';
import { calculateEducationalScenario } from '../data/projections/futureScenarios';
import { 
  formatCurrency, 
  formatPopulation, 
  formatPercent, 
  formatExchangeRate,
  formatPerCapita 
} from '../lib/utils';

describe('Data Integrity & Macroeconomic Series Audits', () => {
  it('should verify all economic observations have positive GDP values', () => {
    ECONOMIC_INDICATORS.forEach(d => {
      expect(d.year).toBeGreaterThanOrEqual(1950);
      expect(d.year).toBeLessThanOrEqual(2026);
      if (d.gdpNominalUSD !== null) {
        expect(d.gdpNominalUSD).toBeGreaterThan(0);
      }
      if (d.gdpNominalLKR !== null) {
        expect(d.gdpNominalLKR).toBeGreaterThan(0);
      }
    });
  });

  it('should verify economic years are strictly sequential with no duplicates', () => {
    const years = ECONOMIC_INDICATORS.map(d => d.year);
    const uniqueYears = Array.from(new Set(years));
    expect(years.length).toBe(uniqueYears.length);
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeGreaterThan(years[i - 1]);
    }
  });

  it('should verify all demographic records have positive population counts', () => {
    HISTORICAL_DEMOGRAPHICS.forEach(d => {
      expect(d.population).toBeGreaterThan(2_000_000);
      expect(d.densityPerKm2).toBeGreaterThan(0);
      if (d.lifeExpectancyYears !== null) {
        expect(d.lifeExpectancyYears).toBeGreaterThan(30);
        expect(d.lifeExpectancyYears).toBeLessThan(100);
      }
    });
  });

  it('should ensure all 25 administrative districts exist across 9 provinces', () => {
    expect(SRI_LANKA_DISTRICTS.length).toBe(25);
    const provinces = new Set(SRI_LANKA_DISTRICTS.map(d => d.province));
    expect(provinces.size).toBe(9);

    SRI_LANKA_DISTRICTS.forEach(d => {
      expect(d.areaKm2).toBeGreaterThan(0);
      expect(d.population2024).toBeGreaterThan(50_000);
      expect(d.coordinates.lat).toBeGreaterThan(5.8);
      expect(d.coordinates.lat).toBeLessThan(10.0);
      expect(d.coordinates.lng).toBeGreaterThan(79.5);
      expect(d.coordinates.lng).toBeLessThan(82.0);
    });
  });

  it('should verify all heads of state have valid dates and neutral documentation', () => {
    NATIONAL_LEADERS.forEach(l => {
      expect(l.id).toBeDefined();
      expect(l.name).toBeDefined();
      expect(l.termStart).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(l.economicIndicatorsDuringTerm).toBeDefined();
      expect(l.documentedMajorEvents.length).toBeGreaterThan(0);
      expect(l.sourceIds.length).toBeGreaterThan(0);
    });
  });

  it('should verify timeline events have sources and valid categories', () => {
    TIMELINE_EVENTS.forEach(e => {
      expect(e.id).toBeDefined();
      expect(e.title).toBeDefined();
      expect(e.category).toBeDefined();
      expect(e.description.length).toBeGreaterThan(20);
      expect(e.sources.length).toBeGreaterThan(0);
    });
  });

  it('should verify all registered source IDs exist in DATA_SOURCES', () => {
    const validSourceIds = new Set(DATA_SOURCES.map(s => s.id));
    ECONOMIC_INDICATORS.forEach(d => {
      expect(validSourceIds.has(d.sourceId)).toBe(true);
    });
    HISTORICAL_DEMOGRAPHICS.forEach(d => {
      expect(validSourceIds.has(d.sourceId)).toBe(true);
    });
  });
});

describe('Formatting & Mathematical Utility Tests', () => {
  it('should format currency accurately in USD and LKR', () => {
    expect(formatCurrency(84.36, 'USD')).toBe('$84.36B');
    expect(formatCurrency(0.88, 'USD')).toBe('$880M');
    expect(formatCurrency(30120, 'LKR')).toBe('Rs. 30.12T');
    expect(formatCurrency(null, 'USD')).toBe('N/A');
  });

  it('should format per capita and population correctly', () => {
    expect(formatPerCapita(4198)).toBe('$4,198');
    expect(formatPopulation(21720000)).toBe('21.72M');
    expect(formatPopulation(583000)).toBe('583,000');
  });

  it('should format percentages with plus/minus sign', () => {
    expect(formatPercent(4.4)).toBe('+4.4%');
    expect(formatPercent(-7.3)).toBe('-7.3%');
    expect(formatPercent(null)).toBe('N/A');
  });

  it('should format exchange rates in LKR', () => {
    expect(formatExchangeRate(298.50)).toBe('Rs. 298.50');
    expect(formatExchangeRate(null)).toBe('N/A');
  });

  it('should calculate educational future scenarios correctly', () => {
    const base = { year: 2024, gdpUSD: 91.20, populationMillions: 21.72 };
    const scenario = calculateEducationalScenario(base, 2035, {
      gdpGrowthPct: 4.5,
      annualPopulationGrowthPct: -0.1,
      renewableEnergyTransitionSpeed: 'moderate',
      exportGrowthPct: 5.0
    });

    expect(scenario).not.toBeNull();
    if (scenario) {
      expect(scenario.year).toBe(2035);
      expect(scenario.gdpUSD).toBeGreaterThan(91.20);
      expect(scenario.populationMillions).toBeLessThan(21.72);
      expect(scenario.gdpPerCapitaUSD).toBeGreaterThan(4198);
      expect(scenario.disclaimer).toContain('Illustrative');
    }
  });
});
