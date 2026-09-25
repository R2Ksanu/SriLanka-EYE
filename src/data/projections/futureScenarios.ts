import { FutureScenario } from '@/types';

export const INSTITUTIONAL_PROJECTIONS: FutureScenario[] = [
  {
    year: 2026,
    type: 'Official Forecast',
    gdpUSD: 98.5,
    gdpRealGrowthPct: 4.8,
    gdpPerCapitaUSD: 4540,
    populationMillions: 21.70,
    urbanizationPct: 19.8,
    renewableEnergyPct: 52.0,
    notes: 'CBSL and IMF medium-term baseline scenario projecting fiscal consolidation and export recovery post-debt restructuring.',
    source: 'Central Bank of Sri Lanka & IMF EFF Review 2024'
  },
  {
    year: 2030,
    type: 'World Bank Medium-term Outlook',
    gdpUSD: 118.0,
    gdpRealGrowthPct: 4.5,
    gdpPerCapitaUSD: 5460,
    populationMillions: 21.60,
    urbanizationPct: 22.0,
    renewableEnergyPct: 70.0,
    notes: 'Benchmark scenario assuming adherence to fiscal targets, full integration of Colombo Port City financial centre, and expansion of renewable power.',
    source: 'World Bank Sri Lanka Development Update & UN DESA 2024'
  },
  {
    year: 2035,
    type: 'UN Population Projection',
    gdpUSD: 148.0,
    gdpRealGrowthPct: 4.2,
    gdpPerCapitaUSD: 6915,
    populationMillions: 21.40,
    urbanizationPct: 25.5,
    renewableEnergyPct: 80.0,
    notes: 'Reflects demographic transition: Sri Lanka transitions into an aged society (over 20% aged 60+), necessitating higher labour productivity and female labour force participation.',
    source: 'UN Department of Economic and Social Affairs (DESA) Population Division (Medium Variant)'
  },
  {
    year: 2040,
    type: 'Institutional Projection',
    gdpUSD: 185.0,
    gdpRealGrowthPct: 3.8,
    gdpPerCapitaUSD: 8760,
    populationMillions: 21.10,
    urbanizationPct: 29.0,
    renewableEnergyPct: 88.0,
    notes: 'Long-term development scenario projecting high-value logistics, digital exports, and regional green energy interconnection with India.',
    source: 'Asian Development Bank / National Physical Planning Department 2040 Vision'
  },
  {
    year: 2050,
    type: 'UN Population Projection',
    gdpUSD: 240.0,
    gdpRealGrowthPct: 3.2,
    gdpPerCapitaUSD: 11760,
    populationMillions: 20.40,
    urbanizationPct: 35.0,
    renewableEnergyPct: 100.0,
    notes: 'Net-zero carbon target year. Population stabilizes around 20.4 million with high dependency ratios. Illustrative long-range projection based on UN median fertility trends.',
    source: 'UN DESA Long-Range Demographic Framework & National Climate Change Policy'
  }
];

export interface ScenarioParameters {
  gdpGrowthPct: number; // e.g. 2.0 to 7.0
  annualPopulationGrowthPct: number; // e.g. -0.5 to 0.8
  renewableEnergyTransitionSpeed: 'moderate' | 'accelerated' | 'slow';
  exportGrowthPct: number;
}

export function calculateEducationalScenario(
  baseYearData: { year: number; gdpUSD: number; populationMillions: number },
  targetYear: number,
  params: ScenarioParameters
) {
  const yearsDelta = targetYear - baseYearData.year;
  if (yearsDelta <= 0) return null;

  // Compound Growth Model
  const projectedGDP = baseYearData.gdpUSD * Math.pow(1 + params.gdpGrowthPct / 100, yearsDelta);
  const projectedPop = baseYearData.populationMillions * Math.pow(1 + params.annualPopulationGrowthPct / 100, yearsDelta);
  const projectedPerCapita = (projectedGDP * 1e9) / (projectedPop * 1e6);

  return {
    year: targetYear,
    gdpUSD: parseFloat(projectedGDP.toFixed(2)),
    populationMillions: parseFloat(projectedPop.toFixed(2)),
    gdpPerCapitaUSD: Math.round(projectedPerCapita),
    disclaimer: 'Illustrative mathematical simulation — NOT an official forecast or guaranteed outcome.'
  };
}
