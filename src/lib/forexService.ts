export interface LiveForexData {
  rate: number; // 1 USD in LKR
  previousClose?: number;
  change24hPct?: number;
  lastUpdatedUtc: string;
  source: string;
  isLive: boolean;
}

export interface UsdtPricing {
  spotRate: number; // Official interbank USD rate
  usdtP2pRate: number; // Indicative P2P market rate (typically ~1.5% premium)
  p2pSpreadPct: number;
  p2pSpreadLkr: number;
}

export interface UsdtPurchasingPowerItem {
  amountUsdt: number;
  label: string;
  category: 'Tech' | 'Education' | 'Living' | 'Global Service';
  description: string;
  lkrEquivalentApprox: number;
}

export interface HistoricalRupeePower {
  year: number;
  era: string;
  lkrPerUsd: number;
  usdtFor1000Lkr: number;
  usdtFor10000Lkr: number;
  realPurchasingPowerContext: string;
}

// Historical purchasing power trajectory of Sri Lankan Rupees over 7 decades
export const HISTORICAL_RUPEE_POWER: HistoricalRupeePower[] = [
  {
    year: 1950,
    era: 'Post-Independence Ceylon',
    lkrPerUsd: 4.76,
    usdtFor1000Lkr: 210.08,
    usdtFor10000Lkr: 2100.84,
    realPurchasingPowerContext: 'Could purchase imported British motorcycle, transatlantic ship passage, or months of commercial rent.',
  },
  {
    year: 1970,
    era: 'Pre-Liberalization Exchange Control',
    lkrPerUsd: 5.95,
    usdtFor1000Lkr: 168.07,
    usdtFor10000Lkr: 1680.67,
    realPurchasingPowerContext: 'Substantial middle-class purchasing power; high black-market premium over official FEECs peg.',
  },
  {
    year: 1977,
    era: 'Open Economy & Floating Exchange Rate',
    lkrPerUsd: 15.56,
    usdtFor1000Lkr: 64.27,
    usdtFor10000Lkr: 642.67,
    realPurchasingPowerContext: 'Could purchase luxury imported colour television, premium Japanese audio cassette system, or high-end watch.',
  },
  {
    year: 1990,
    era: 'Export-Oriented Industrialization',
    lkrPerUsd: 40.06,
    usdtFor1000Lkr: 24.96,
    usdtFor10000Lkr: 249.63,
    realPurchasingPowerContext: 'Monthly family grocery budget, full school term uniform/stationery supplies, or premium bicycle.',
  },
  {
    year: 2000,
    era: 'Millennium Transition',
    lkrPerUsd: 75.78,
    usdtFor1000Lkr: 13.20,
    usdtFor10000Lkr: 131.96,
    realPurchasingPowerContext: 'Weekly high-end supermarket groceries, 2 full tanks of motorcycle petrol, or domestic flight ticket.',
  },
  {
    year: 2010,
    era: 'Post-Conflict Infrastructure Phase',
    lkrPerUsd: 113.06,
    usdtFor1000Lkr: 8.84,
    usdtFor10000Lkr: 88.45,
    realPurchasingPowerContext: 'Fine-dining dinner for two, monthly high-speed broadband ADSL subscription, or 3 cinema tickets.',
  },
  {
    year: 2015,
    era: 'Pre-Crisis Sovereign Bond Era',
    lkrPerUsd: 135.94,
    usdtFor1000Lkr: 7.36,
    usdtFor10000Lkr: 73.56,
    realPurchasingPowerContext: 'Single restaurant lunch, mid-tier 4G mobile data bundle, or pair of branded footwear on discount.',
  },
  {
    year: 2020,
    era: 'Pre-Default Dollar Pegging',
    lkrPerUsd: 185.52,
    usdtFor1000Lkr: 5.39,
    usdtFor10000Lkr: 53.90,
    realPurchasingPowerContext: 'Short Uber/PickMe city ride, 5kg packet of rice, or 1 fast-food combo meal.',
  },
  {
    year: 2022,
    era: 'Sovereign Default & Currency Float',
    lkrPerUsd: 363.11,
    usdtFor1000Lkr: 2.75,
    usdtFor10000Lkr: 27.54,
    realPurchasingPowerContext: '2-3 litres of auto petrol, single loaf of specialty bread + eggs, or two cups of cafe coffee.',
  },
  {
    year: 2024,
    era: 'IMF Stabilization & Disinflation',
    lkrPerUsd: 302.50,
    usdtFor1000Lkr: 3.31,
    usdtFor10000Lkr: 33.06,
    realPurchasingPowerContext: 'Two large coconut milk cartons, modest lunch packet, or 1.5 litres of standard 92 octane petrol.',
  },
  {
    year: 2026,
    era: 'Live Recovery & Restructuring Horizon',
    lkrPerUsd: 329.81,
    usdtFor1000Lkr: 3.03,
    usdtFor10000Lkr: 30.32,
    realPurchasingPowerContext: '1 modest fast-food snack, small bottle of olive oil, or basic mobile top-up card.',
  },
];

// What USDT unlocks in global purchasing power
export const USDT_GLOBAL_PURCHASING_POWER_TIERS: UsdtPurchasingPowerItem[] = [
  {
    amountUsdt: 5,
    label: 'Cloud Domain / VPS Server',
    category: 'Tech',
    description: '1 month of cloud server compute (DigitalOcean / Hetzner) or annual .com domain renewal.',
    lkrEquivalentApprox: 1675,
  },
  {
    amountUsdt: 12,
    label: 'Global Streaming / Media Subscription',
    category: 'Living',
    description: '1 month Spotify Premium Family or Netflix standard 1080p subscription.',
    lkrEquivalentApprox: 4015,
  },
  {
    amountUsdt: 20,
    label: 'AI & Developer Tooling (ChatGPT Plus / GitHub Copilot)',
    category: 'Tech',
    description: 'Monthly unlimited access to world-class frontier AI coding and reasoning models.',
    lkrEquivalentApprox: 6695,
  },
  {
    amountUsdt: 50,
    label: 'Professional Accreditation Exam / Tech Course',
    category: 'Education',
    description: 'Global Coursera Plus / Udemy Pro track or entry-level cloud certification exam voucher.',
    lkrEquivalentApprox: 16738,
  },
  {
    amountUsdt: 100,
    label: 'Starlink Satellite Kit Monthly Tier or Freelance Hardware',
    category: 'Global Service',
    description: 'Unlimited high-speed low-latency satellite internet or pro developer mechanical keyboard.',
    lkrEquivalentApprox: 33475,
  },
  {
    amountUsdt: 500,
    label: 'Professional Workstation / Laptop or Tech Stack Reserve',
    category: 'Tech',
    description: 'Modern developer laptop (Apple M-series refurbished / Ryzen workstation) or 1 year of full cloud infra.',
    lkrEquivalentApprox: 167375,
  },
];

export function getUsdtPricing(spotRate: number, p2pPremiumPct: number = 1.5): UsdtPricing {
  const spreadMultiplier = 1 + (p2pPremiumPct / 100);
  const usdtP2pRate = Number((spotRate * spreadMultiplier).toFixed(2));
  return {
    spotRate: Number(spotRate.toFixed(2)),
    usdtP2pRate,
    p2pSpreadPct: p2pPremiumPct,
    p2pSpreadLkr: Number((usdtP2pRate - spotRate).toFixed(2)),
  };
}

const PRIMARY_API = 'https://open.er-api.com/v6/latest/USD';
const FALLBACK_API = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';

// Cached baseline if network is temporarily offline
let cachedForex: LiveForexData = {
  rate: 329.81,
  change24hPct: 0.12,
  lastUpdatedUtc: new Date().toISOString(),
  source: 'Open Exchange Rates (ER-API Live Feed)',
  isLive: false,
};

export async function fetchLiveUSDToLKR(): Promise<LiveForexData> {
  // 1. Try Primary API (open.er-api.com)
  try {
    const response = await fetch(PRIMARY_API, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data && data.rates && typeof data.rates.LKR === 'number') {
        const liveRate = data.rates.LKR;
        cachedForex = {
          rate: Number(liveRate.toFixed(2)),
          lastUpdatedUtc: data.time_last_update_utc || new Date().toUTCString(),
          source: 'Open Exchange Rates (Global Interbank Rate)',
          isLive: true,
        };
        return cachedForex;
      }
    }
  } catch (err) {
    console.warn('Primary forex API failed, attempting fallback...', err);
  }

  // 2. Try Fallback API (jsdelivr currency-api)
  try {
    const response = await fetch(FALLBACK_API, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data && data.usd && typeof data.usd.lkr === 'number') {
        const liveRate = data.usd.lkr;
        cachedForex = {
          rate: Number(liveRate.toFixed(2)),
          lastUpdatedUtc: data.date ? new Date(data.date).toUTCString() : new Date().toUTCString(),
          source: 'Currencies Feed (Interbank)',
          isLive: true,
        };
        return cachedForex;
      }
    }
  } catch (err) {
    console.warn('Fallback forex API also failed, using cached baseline', err);
  }

  return cachedForex;
}
