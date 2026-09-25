import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Download, 
  AlertCircle, 
  Info, 
  Layers, 
  Ship, 
  Plane, 
  Briefcase, 
  Scale, 
  Percent, 
  Landmark, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ArrowRightLeft,
  Coins,
  Sparkles,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { Language, EconomicIndicatorYear } from '@/types';
import { ECONOMIC_INDICATORS } from '@/data/economy/indicators';
import { I18N_STRINGS } from '@/lib/i18n';
import { 
  formatCurrency, 
  formatPerCapita, 
  formatPercent, 
  formatExchangeRate, 
  downloadCsvFile, 
  downloadJsonFile 
} from '@/lib/utils';
import { 
  fetchLiveUSDToLKR, 
  LiveForexData, 
  getUsdtPricing, 
  HISTORICAL_RUPEE_POWER, 
  USDT_GLOBAL_PURCHASING_POWER_TIERS 
} from '@/lib/forexService';

interface EconomicDashboardProps {
  lang: Language;
  onNavigate?: (view: any) => void;
}

export const EconomicDashboard: React.FC<EconomicDashboardProps> = ({ lang, onNavigate }) => {
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'LKR'>('USD');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);
  const [forex, setForex] = useState<LiveForexData | null>(null);
  const [isRefreshingForex, setIsRefreshingForex] = useState(false);
  const [usdInput, setUsdInput] = useState<string>('100');
  const [lkrInput, setLkrInput] = useState<string>('32981.00');

  // USDT & Purchasing Power States
  const [forexSubTab, setForexSubTab] = useState<'USDT' | 'USD'>('USDT');
  const [usdtLkrInput, setUsdtLkrInput] = useState<string>('50000');
  const [useP2pSpread, setUseP2pSpread] = useState<boolean>(true);
  const t = I18N_STRINGS[lang];

  const spotRate = forex?.rate || 329.81;
  const usdtPricing = useMemo(() => {
    return getUsdtPricing(spotRate, 1.5);
  }, [spotRate]);

  const effectiveUsdtRate = useP2pSpread ? usdtPricing.usdtP2pRate : usdtPricing.spotRate;
  const calculatedUsdt = useMemo(() => {
    const lkr = parseFloat(usdtLkrInput);
    if (isNaN(lkr) || lkr <= 0) return 0;
    return Number((lkr / effectiveUsdtRate).toFixed(2));
  }, [usdtLkrInput, effectiveUsdtRate]);

  const loadForex = async () => {
    setIsRefreshingForex(true);
    try {
      const data = await fetchLiveUSDToLKR();
      setForex(data);
      if (data && data.rate) {
        const usdVal = parseFloat(usdInput);
        if (!isNaN(usdVal)) {
          setLkrInput((usdVal * data.rate).toFixed(2));
        }
      }
    } finally {
      setIsRefreshingForex(false);
    }
  };

  useEffect(() => {
    loadForex();
    const timer = setInterval(loadForex, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleUsdChange = (val: string) => {
    setUsdInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && forex && forex.rate) {
      setLkrInput((num * forex.rate).toFixed(2));
    } else if (val === '') {
      setLkrInput('');
    }
  };

  const handleLkrChange = (val: string) => {
    setLkrInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && forex && forex.rate) {
      setUsdInput((num / forex.rate).toFixed(2));
    } else if (val === '') {
      setUsdInput('');
    }
  };

  // Get active data point for selected year
  const activeDataPoint = useMemo(() => {
    return ECONOMIC_INDICATORS.find(d => d.year === selectedYear) || ECONOMIC_INDICATORS[ECONOMIC_INDICATORS.length - 1];
  }, [selectedYear]);

  // Export handlers
  const handleExportCsv = () => {
    const headers = [
      'Year',
      'GDP_USD_Billions',
      'GDP_LKR_Billions',
      'Real_GDP_Growth_Pct',
      'GDP_Per_Capita_USD',
      'Inflation_CCPI_Pct',
      'Exchange_Rate_LKR_USD',
      'Exports_USD_Billions',
      'Imports_USD_Billions',
      'Trade_Balance_USD_Billions',
      'Public_Debt_Pct_GDP',
      'Foreign_Reserves_USD_Billions',
      'Tourist_Arrivals',
      'Status'
    ];
    const rows = ECONOMIC_INDICATORS.map(d => [
      d.year,
      d.gdpNominalUSD,
      d.gdpNominalLKR,
      d.gdpRealGrowthPct,
      d.gdpPerCapitaUSD,
      d.inflationCCPI,
      d.exchangeRateLKRUSD,
      d.exportsUSD,
      d.importsUSD,
      d.tradeBalanceUSD,
      d.publicDebtPctGDP,
      d.foreignReservesUSD,
      d.touristArrivals,
      d.status
    ]);
    downloadCsvFile(headers, rows, 'sri-lanka-economic-indicators-1950-2024.csv');
  };

  const handleExportJson = () => {
    downloadJsonFile(ECONOMIC_INDICATORS, 'sri-lanka-economic-indicators-1950-2024.json');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Controls */}
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Verified Macroeconomic Intelligence Archive</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            ECONOMIC EVOLUTION DASHBOARD
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Retrospective time-series tracking seven decades of production, trade balance, external debt, foreign reserves, and monetary indicators compiled from official Central Bank of Sri Lanka records.
          </p>
        </div>

        {/* Global Dashboard Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setCurrencyMode('USD')}
              className={`px-3 py-1.5 rounded-md font-mono transition-colors ${
                currencyMode === 'USD'
                  ? 'bg-lanka-gold text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrencyMode('LKR')}
              className={`px-3 py-1.5 rounded-md font-mono transition-colors ${
                currencyMode === 'LKR'
                  ? 'bg-lanka-gold text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LKR (Rs.)
            </button>
          </div>

          {/* Methodology Info Button */}
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-lanka-gold" />
            <span>Methodology</span>
          </button>

          {/* Export Dropdowns */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 transition-colors"
              title="Download full series as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 transition-colors"
              title="Download full series as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Live Forex & USDT Purchasing Power Terminal */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-museum-900 to-slate-950 border border-emerald-800/70 p-6 shadow-xl relative overflow-hidden space-y-6">
        {/* Terminal Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                REAL-TIME LIVE CURRENCY & PURCHASING POWER FEED
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                • Free Open Exchange Rates API
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
              Live Currency Exchange & USDT Purchasing Power Terminal
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track real-time Sri Lankan Rupee valuation against interbank USD and calculate exact Tether (USDT) purchasing power for domestic capital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Mode Switcher: USDT Power vs USD Spot */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setForexSubTab('USDT')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                  forexSubTab === 'USDT'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>USDT Power (₮)</span>
              </button>
              <button
                onClick={() => setForexSubTab('USD')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono font-bold transition-all ${
                  forexSubTab === 'USD'
                    ? 'bg-lanka-gold text-slate-950 shadow-md shadow-lanka-gold/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>USD Spot ($)</span>
              </button>
            </div>

            <div className="text-right pl-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {forexSubTab === 'USDT' ? 'USDT Market Benchmark' : 'CBSL Spot Benchmark'}
              </span>
              <span className="text-xl font-serif font-bold text-emerald-300 font-mono">
                {forexSubTab === 'USDT' 
                  ? `1 USDT = Rs. ${effectiveUsdtRate.toFixed(2)}`
                  : `1 USD = Rs. ${spotRate.toFixed(2)}`}
              </span>
              <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[190px]">
                {forex?.lastUpdatedUtc ? `Refreshed: ${forex.lastUpdatedUtc}` : 'Real-time feed'}
              </span>
            </div>

            <button
              onClick={loadForex}
              disabled={isRefreshingForex}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-300 hover:text-emerald-300 transition-colors flex items-center justify-center"
              title="Refresh live rate now"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingForex ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab 1: USDT (Tether) Purchasing Power & Growth */}
        {forexSubTab === 'USDT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Rupee to USDT Power Calculator */}
              <div className="lg:col-span-6 bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 font-bold">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>How Much USDT Does Your Rupee Get?</span>
                  </span>
                  
                  {/* Spread Toggle */}
                  <div className="flex items-center space-x-1 text-[10px] font-mono bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setUseP2pSpread(true)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        useP2pSpread ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-500'
                      }`}
                      title="Includes retail OTC P2P spread of ~1.5%"
                    >
                      P2P (+1.5%)
                    </button>
                    <button
                      onClick={() => setUseP2pSpread(false)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        !useP2pSpread ? 'bg-slate-800 text-slate-200 font-bold' : 'text-slate-500'
                      }`}
                      title="Uses interbank exact spot without retail fee"
                    >
                      Spot Parity
                    </button>
                  </div>
                </div>

                {/* Input Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    Enter Amount in Sri Lankan Rupees (LKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">Rs.</span>
                    <input
                      type="number"
                      value={usdtLkrInput}
                      onChange={(e) => setUsdtLkrInput(e.target.value)}
                      placeholder="50000"
                      min="0"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-lg focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">Presets:</span>
                  {[5000, 10000, 25000, 50000, 100000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setUsdtLkrInput(amt.toString())}
                      className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      Rs. {amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>

                {/* Big Result Display */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400/90 block">
                    Instant Digital Dollar Power
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-emerald-300">
                      {calculatedUsdt.toLocaleString()}
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-400">USDT</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono pt-1">
                    Rate: 1 USDT = Rs. {effectiveUsdtRate.toFixed(2)} {useP2pSpread ? '(P2P market rate)' : '(Spot parity)'}
                  </p>
                </div>

                {/* Direct CTA to Future Wealth Simulator */}
                <button
                  onClick={() => onNavigate ? onNavigate('future') : window.location.hash = '#future'}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-600/40 text-xs font-mono font-semibold text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-lanka-gold group-hover:rotate-12 transition-transform" />
                  <span>Simulate 10-Year Future Wealth in Rupee vs USDT →</span>
                </button>
              </div>

              {/* Right Column: Global Purchasing Power Matrix */}
              <div className="lg:col-span-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
                    Global Purchasing Power Matrix
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    What does your USDT unlock?
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USDT_GLOBAL_PURCHASING_POWER_TIERS.map((tier) => {
                    const isUnlocked = calculatedUsdt >= tier.amountUsdt;
                    return (
                      <div
                        key={tier.amountUsdt}
                        className={`p-3 rounded-lg border transition-all ${
                          isUnlocked
                            ? 'bg-emerald-950/20 border-emerald-600/40'
                            : 'bg-slate-900/60 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-bold text-slate-100">
                            {tier.amountUsdt} USDT
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                            isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isUnlocked ? '✓ Unlocked' : `Need ${(tier.amountUsdt - calculatedUsdt).toFixed(0)} more`}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-200 block mt-1 line-clamp-1">
                          {tier.label}
                        </span>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                          {tier.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Historical Rupee Purchasing Power Timeline (1950 - 2026) */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-lanka-gold font-bold block">
                    Historical Rupee Purchasing Power Trajectory (1950 – 2026)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    How much hard digital currency (USD/USDT) could Rs. 1,000 buy over Sri Lanka's monetary history?
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Source: CBSL Historical Archive
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                {HISTORICAL_RUPEE_POWER.filter(p => [1950, 1977, 2000, 2015, 2022, 2026].includes(p.year)).map((hp) => (
                  <div key={hp.year} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-slate-200">{hp.year}</span>
                      <span className="text-[10px] font-mono text-slate-400">Rs. {hp.lkrPerUsd.toFixed(1)}</span>
                    </div>
                    <div className="text-lg font-serif font-bold text-emerald-400">
                      ${hp.usdtFor1000Lkr.toFixed(2)}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">
                      Yield of Rs. 1,000
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-2 pt-1 border-t border-slate-850">
                      {hp.realPurchasingPowerContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: USD Interbank Exchange & Converter */}
        {forexSubTab === 'USD' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-center">
            {/* Interactive Calculator */}
            <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-lanka-gold block">
                Instant Interbank Currency Converter
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                {/* USD Input */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block">Amount in USD ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-sm">$</span>
                    <input
                      type="number"
                      value={usdInput}
                      onChange={(e) => handleUsdChange(e.target.value)}
                      placeholder="100"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-base focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Transfer Icon */}
                <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-4">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                </div>

                {/* LKR Output/Input */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 block">Amount in LKR (Rs.)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">Rs.</span>
                    <input
                      type="number"
                      value={lkrInput}
                      onChange={(e) => handleLkrChange(e.target.value)}
                      placeholder="32981.00"
                      min="0"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-base focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-400">Quick presets:</span>
                {[1, 10, 50, 100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleUsdChange(amt.toString())}
                    className="px-2 py-0.5 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Historical Rupee Milestones */}
            <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Historical Peg & Float Benchmarks (CBSL Archive)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 block">1950 (Post-Indep)</span>
                  <span className="font-mono font-bold text-slate-200">Rs. 4.76</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 block">1977 (Open Econ)</span>
                  <span className="font-mono font-bold text-slate-200">Rs. 15.56</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 block">2000 (Millennium)</span>
                  <span className="font-mono font-bold text-slate-200">Rs. 75.78</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 block">2015 (Pre-Crisis)</span>
                  <span className="font-mono font-bold text-slate-200">Rs. 135.94</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-850">
                  <span className="text-[10px] font-mono text-rose-400 block">2022 (Crisis Float)</span>
                  <span className="font-mono font-bold text-rose-400">Rs. 363.11</span>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60">
                  <span className="text-[10px] font-mono text-emerald-400 block">2026 (Live Now)</span>
                  <span className="font-mono font-bold text-emerald-300">Rs. {forex ? forex.rate.toFixed(0) : '330'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Methodology & Data Quality Warning Banner */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-3">
        <AlertCircle className="w-4 h-4 text-lanka-gold flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            Statistical Methodology Disclosure: Base Year Rebasing & Vintage Revisions
          </p>
          <p className="text-slate-400 leading-relaxed">
            Historical GDP series have undergone periodic official rebasing by the Department of Census and Statistics (DCS base years: 1982, 1996, 2002, 2010, and 2015). Growth rates are chain-linked where applicable. Nominal comparisons in USD reflect contemporaneous market exchange rates published in the CBSL Annual Economic Review.
          </p>
        </div>
      </div>

      {/* Main Metric Cards (Top 10 Key Indicators for Selected Year) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Selected Year Snapshot: <strong className="text-lanka-gold font-bold">{selectedYear}</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Status: {activeDataPoint.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. GDP */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">GDP (Nominal)</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {currencyMode === 'USD' 
                ? formatCurrency(activeDataPoint.gdpNominalUSD, 'USD')
                : formatCurrency(activeDataPoint.gdpNominalLKR, 'LKR')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {currencyMode === 'USD' ? 'Billions Current USD' : 'Billions LKR'}
            </span>
          </div>

          {/* 2. Real GDP Growth */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Real GDP Growth</span>
            <span className={`text-xl font-serif font-bold block mt-1 ${
              (activeDataPoint.gdpRealGrowthPct || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {formatPercent(activeDataPoint.gdpRealGrowthPct)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Year-on-Year %</span>
          </div>

          {/* 3. GDP Per Capita */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">GDP Per Capita</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {formatPerCapita(activeDataPoint.gdpPerCapitaUSD)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">USD / Person</span>
          </div>

          {/* 4. Inflation CCPI */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Inflation (CCPI)</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {activeDataPoint.inflationCCPI !== null ? `${activeDataPoint.inflationCCPI.toFixed(1)}%` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Colombo Consumer Price Index</span>
          </div>

          {/* 5. Exchange Rate */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Exchange Rate</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {formatExchangeRate(activeDataPoint.exchangeRateLKRUSD)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">LKR per 1 USD</span>
          </div>

          {/* 6. Exports */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Merchandise Exports</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {formatCurrency(activeDataPoint.exportsUSD, 'USD')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tea, Garments, Rubber</span>
          </div>

          {/* 7. Imports */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Merchandise Imports</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {formatCurrency(activeDataPoint.importsUSD, 'USD')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Fuel, Food, Capital Goods</span>
          </div>

          {/* 8. Public Debt % of GDP */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Central Gov Debt</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {activeDataPoint.publicDebtPctGDP !== null ? `${activeDataPoint.publicDebtPctGDP.toFixed(1)}%` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">% of GDP</span>
          </div>

          {/* 9. Gross Foreign Reserves */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Official Reserves</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {formatCurrency(activeDataPoint.foreignReservesUSD, 'USD')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Gross Official FX</span>
          </div>

          {/* 10. Tourist Arrivals */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Tourism Arrivals</span>
            <span className="text-xl font-serif font-bold text-slate-100 block mt-1">
              {activeDataPoint.touristArrivals !== null ? activeDataPoint.touristArrivals.toLocaleString() : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Annual Visitors</span>
          </div>
        </div>
      </div>

      {/* Year Scrubbing Slider */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono uppercase text-lanka-gold tracking-wider">Inspect Year:</span>
          <span className="text-lg font-serif font-bold text-slate-100 bg-slate-800 px-3 py-0.5 rounded border border-slate-700">
            {selectedYear}
          </span>
        </div>
        <div className="flex-1 max-w-xl">
          <input
            type="range"
            min="1950"
            max="2024"
            step="1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lanka-gold"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>1950</span>
            <span>1977</span>
            <span>2004</span>
            <span>2009</span>
            <span>2022</span>
            <span>2024</span>
          </div>
        </div>
      </div>

      {/* Detailed Interactive Chart Suite (20 Indicators) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: GDP Evolution (USD & LKR) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                1. Gross Domestic Product (1950–2024)
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: {currencyMode === 'USD' ? 'Billions USD (Current)' : 'Billions LKR (Nominal)'} • Source: CBSL
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-lanka-gold">
              CBSL Series
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cfa935" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#cfa935" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [currencyMode === 'USD' ? `$${val}B` : `Rs. ${val}B`, 'GDP']}
                />
                <Area 
                  type="monotone" 
                  dataKey={currencyMode === 'USD' ? 'gdpNominalUSD' : 'gdpNominalLKR'} 
                  stroke="#cfa935" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#gdpGrad)" 
                />
                <ReferenceLine x={1977} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: '1977 Open Economy', fill: '#38bdf8', fontSize: 10 }} />
                <ReferenceLine x={2009} stroke="#10b981" strokeDasharray="3 3" label={{ value: '2009 End of Conflict', fill: '#10b981', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Reflects expansion from $0.88B in 1950 to $91.20B in 2024. Sharp rupee depreciation in 2022 contracted the dollar GDP despite nominal rupee growth.
          </div>
        </div>

        {/* CHART 2: Real GDP Growth % */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                2. Real GDP Growth Rate (% YoY)
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Percentage (%) Constant Prices • Source: DCS / CBSL
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
              Constant Prices
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val > 0 ? '+' : ''}${val}%`, 'Real Growth']}
                />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <Bar 
                  dataKey="gdpRealGrowthPct" 
                  fill="#38bdf8"
                  radius={[3, 3, 0, 0]}
                />
                <ReferenceLine x={2001} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '2001 (-1.5%)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine x={2022} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '2022 (-7.3%)', fill: '#f43f5e', fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Contractions occurred in 2001 (-1.5%), 2019 (-0.2%), 2020 (-3.5%), and 2022 (-7.3%), followed by positive recovery to +4.4% in 2024.
          </div>
        </div>

        {/* CHART 3: Inflation Trajectory (CCPI %) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                3. Colombo Consumer Price Index (CCPI) Inflation
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Annual Headline % • Source: Department of Census & Statistics
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400">
              CCPI Index
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Inflation']}
                />
                <Line 
                  type="monotone" 
                  dataKey="inflationCCPI" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <ReferenceLine x={2022} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '2022 Peak (46.4% avg, 69.8% YoY)', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine x={2024} stroke="#10b981" strokeDasharray="3 3" label={{ value: '2024 Disinflation (1.8%)', fill: '#10b981', fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Headline CCPI inflation spiked to historic heights of 69.8% in September 2022 amidst reserve shortages, disinflating rapidly under tight monetary conditions by 2024.
          </div>
        </div>

        {/* CHART 4: Exchange Rate (LKR / USD) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                4. Exchange Rate (LKR per 1 USD)
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Rupees per US Dollar • Source: CBSL Daily Indicative Rate
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              LKR / USD
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`Rs. ${val.toFixed(2)}`, 'Exchange Rate']}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="exchangeRateLKRUSD" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine x={1977} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: '1977 Float (Rs. 15.6)', fill: '#38bdf8', fontSize: 10 }} />
                <ReferenceLine x={2022} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '2022 (Rs. 363)', fill: '#f43f5e', fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Fixed peg at Rs. 4.76 from 1950 until 1967. Managed float began in November 1977. Depreciated from ~200 to 363 in early 2022 before appreciating back to ~298 in 2024.
          </div>
        </div>

        {/* CHART 5: Merchandise Trade (Exports vs Imports & Deficit) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                5. Merchandise Trade Balance (Exports vs Imports)
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Billions USD • Source: CBSL External Trade Statistics
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
              External Sector
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number, name: string) => [`$${val}B`, name === 'exportsUSD' ? 'Exports' : 'Imports']}
                />
                <Legend />
                <Bar dataKey="exportsUSD" name="Exports" fill="#10b981" />
                <Bar dataKey="importsUSD" name="Imports" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Sri Lanka has maintained a persistent structural merchandise trade deficit since 1978, historically offset by worker remittances and tourism service inflows.
          </div>
        </div>

        {/* CHART 6: Public Debt (% of GDP) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                6. Central Government Debt-to-GDP Ratio
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Percentage of GDP (%) • Source: Ministry of Finance / CBSL
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
              Fiscal Sustainability
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val.toFixed(1)}%`, 'Public Debt % GDP']}
                />
                <ReferenceLine y={100} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '100% Threshold', fill: '#f43f5e', fontSize: 10 }} />
                <Area 
                  type="monotone" 
                  dataKey="publicDebtPctGDP" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#debtGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Public debt climbed above 100% of GDP in 2001 and peaked at 115.3% in 2022. Domestic debt optimization and bilateral restructuring in 2023–2024 brought debt to ~104.5%.
          </div>
        </div>

        {/* CHART 7: Gross Official Reserves (USD Billions) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                7. Gross Official Foreign Reserves (1950–2024)
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Billions USD • Source: Central Bank of Sri Lanka
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400">
              FX Liquidity Buffer
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`$${val}B`, 'Gross Reserves']}
                />
                <Area 
                  type="monotone" 
                  dataKey="foreignReservesUSD" 
                  stroke="#0d9488" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#resGrad)" 
                />
                <ReferenceLine x={2018} stroke="#10b981" strokeDasharray="3 3" label={{ value: '2018 Peak ($6.9B)', fill: '#10b981', fontSize: 10 }} />
                <ReferenceLine x={2022} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '2022 Trough (<$50M usable)', fill: '#f43f5e', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Gross reserves dropped from $7.64B (2019) to under $50 million in usable foreign currency in April 2022, rebounding to over $6.47B by late 2024.
          </div>
        </div>

        {/* CHART 8: Tourism & Worker Remittances */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                8. Tourist Arrivals & Worker Remittances
              </h3>
              <p className="text-[11px] text-slate-400">
                Units: Remittances (Billions USD) vs Annual Visitors • Source: SLTDA / CBSL
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-lanka-gold">
              Service Receipts
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ECONOMIC_INDICATORS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number, name: string) => [
                    name === 'workerRemittancesUSD' ? `$${val}B` : val.toLocaleString(),
                    name === 'workerRemittancesUSD' ? 'Remittances (USD)' : 'Tourist Arrivals'
                  ]}
                />
                <Legend />
                <Bar dataKey="workerRemittancesUSD" name="Remittances ($B)" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Worker remittances peaked at over $7.1B in 2020. Tourist arrivals surpassed 2.33 million in 2018, fell during 2019–2021, and recovered to 2.05M in 2024.
          </div>
        </div>
      </div>

      {/* Methodology Explainer Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-museum-950/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-museum-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-slate-100 text-lg flex items-center space-x-2">
                <Info className="w-5 h-5 text-lanka-gold" />
                <span>Economic Data Methodology & Nomenclature</span>
              </h3>
              <button 
                onClick={() => setShowMethodologyModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto pr-2">
              <p>
                <strong>1. Nominal vs. Real Indicators:</strong> Nominal GDP measures the total monetary value of goods and services produced at current market prices without adjusting for inflation. Real GDP is measured at constant prices using fixed base year weights to isolate physical volume changes from price inflation.
              </p>
              <p>
                <strong>2. National Accounts Base Years:</strong> Sri Lanka's Department of Census and Statistics (DCS) has historically updated the base year to accurately reflect changing economic structures:
                <br />• 1950–1982: Base year 1958 & 1982
                <br />• 1982–1996: Base year 1996
                <br />• 1996–2010: Base year 2002
                <br />• 2010–2015: Base year 2010
                <br />• 2015–Present: Base year 2015
              </p>
              <p>
                <strong>3. Inflation Measures:</strong> Historical inflation prior to 2003 utilizes the old Colombo Consumer Price Index (1952=100). Modern series use the rebased CCPI (2013=100 and 2021=100) and the National Consumer Price Index (NCPI).
              </p>
              <p>
                <strong>4. Exchange Rate Conversions:</strong> Figures in current US Dollars are converted from Rupee series using the contemporaneous annual average exchange rate reported in the CBSL Annual Economic Review.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-4 py-2 rounded-lg bg-lanka-gold text-slate-950 font-medium text-xs hover:bg-lanka-goldLight transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
