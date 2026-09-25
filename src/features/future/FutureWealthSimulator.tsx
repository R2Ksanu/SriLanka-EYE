import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2,
  Landmark,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Language } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { getUsdtPricing } from '@/lib/forexService';

interface FutureWealthSimulatorProps {
  lang: Language;
  liveUsdRate?: number;
}

export const FutureWealthSimulator: React.FC<FutureWealthSimulatorProps> = ({
  liveUsdRate = 329.81
}) => {
  // Simulator Parameters
  const [initialCapitalLkr, setInitialCapitalLkr] = useState<number>(100000);
  const [horizonYears, setHorizonYears] = useState<number>(5);
  const [annualInflationPct, setAnnualInflationPct] = useState<number>(5.0);
  const [annualDepreciationPct, setAnnualDepreciationPct] = useState<number>(3.0);
  const [enableUsdtYield, setEnableUsdtYield] = useState<boolean>(true);
  const [usdtYieldPct, setUsdtYieldPct] = useState<number>(4.5);

  const usdtPricing = useMemo(() => {
    return getUsdtPricing(liveUsdRate, 1.5);
  }, [liveUsdRate]);

  // Nominal annual yields
  const T_BILL_YIELD_PCT = 8.5; // CBSL / Primary dealer benchmark
  const CSE_EQUITY_CAGR_PCT = 13.5; // Productive national equity recovery

  // Preset amounts for quick selection
  const capitalPresets = [25000, 100000, 500000, 1000000, 5000000];

  // Starting USDT purchased
  const initialUsdt = useMemo(() => {
    return initialCapitalLkr / usdtPricing.usdtP2pRate;
  }, [initialCapitalLkr, usdtPricing.usdtP2pRate]);

  // Time-series trajectory data generation
  const trajectoryData = useMemo(() => {
    const data = [];
    const baseYear = 2026;

    for (let yr = 0; yr <= horizonYears; yr++) {
      const currentYear = baseYear + yr;
      // Future USD/LKR rate after compounding annual depreciation
      const futureUsdRate = liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, yr);

      // Strategy 1: Cash LKR (constant nominal, decaying real purchasing power)
      const cashLkrNominal = initialCapitalLkr;
      const cashLkrReal = initialCapitalLkr / Math.pow(1 + annualInflationPct / 100, yr);
      const cashUsdtEquiv = cashLkrNominal / futureUsdRate;

      // Strategy 2: LKR T-Bills / Bank Fixed Deposit (8.5% p.a.)
      const tbillsNominal = initialCapitalLkr * Math.pow(1 + T_BILL_YIELD_PCT / 100, yr);
      const tbillsReal = tbillsNominal / Math.pow(1 + annualInflationPct / 100, yr);
      const tbillsUsdtEquiv = tbillsNominal / futureUsdRate;

      // Strategy 3: USDT Digital Dollars
      const effectiveYield = enableUsdtYield ? usdtYieldPct : 0;
      const usdtHolding = initialUsdt * Math.pow(1 + effectiveYield / 100, yr);
      // USDT converted back to LKR at future rate
      const usdtLkrNominal = usdtHolding * futureUsdRate;
      const usdtLkrReal = usdtLkrNominal / Math.pow(1 + annualInflationPct / 100, yr);

      // Strategy 4: Sri Lanka Productive Equities / National Growth (13.5% CAGR)
      const equityNominal = initialCapitalLkr * Math.pow(1 + CSE_EQUITY_CAGR_PCT / 100, yr);
      const equityReal = equityNominal / Math.pow(1 + annualInflationPct / 100, yr);
      const equityUsdtEquiv = equityNominal / futureUsdRate;

      data.push({
        year: currentYear,
        yearLabel: yr === 0 ? '2026 (Now)' : `+${yr}y (${currentYear})`,
        futureUsdRate: Math.round(futureUsdRate),
        // Nominal values in LKR
        cashNominal: Math.round(cashLkrNominal),
        cashReal: Math.round(cashLkrReal),
        cashUsdt: Math.round(cashUsdtEquiv),

        tbillsNominal: Math.round(tbillsNominal),
        tbillsReal: Math.round(tbillsReal),
        tbillsUsdt: Math.round(tbillsUsdtEquiv),

        usdtHolding: Math.round(usdtHolding),
        usdtLkrNominal: Math.round(usdtLkrNominal),
        usdtLkrReal: Math.round(usdtLkrReal),

        equityNominal: Math.round(equityNominal),
        equityReal: Math.round(equityReal),
        equityUsdt: Math.round(equityUsdtEquiv)
      });
    }

    return data;
  }, [
    initialCapitalLkr,
    horizonYears,
    annualInflationPct,
    annualDepreciationPct,
    enableUsdtYield,
    usdtYieldPct,
    liveUsdRate,
    initialUsdt,
    T_BILL_YIELD_PCT,
    CSE_EQUITY_CAGR_PCT
  ]);

  const endData = trajectoryData[trajectoryData.length - 1];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-museum-950 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Coins className="w-3 h-3 mr-1 text-emerald-400" />
              FINANCIAL SOVEREIGNTY ENGINE (2026 – 2036)
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              • Purchasing Power & Growth Simulator
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            Rupee Purchasing Power & USDT Future Growth Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-3xl">
            Simulate how your capital evolves under domestic Sri Lankan inflation, currency depreciation, Treasury yields, and USDT digital dollar hedging over a 1 to 10-year horizon.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Live Benchmark Peg</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              1 USDT = Rs. {usdtPricing.usdtP2pRate.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              Spot: Rs. {liveUsdRate.toFixed(2)} (+{usdtPricing.p2pSpreadPct}% P2P spread)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Control 1: Initial Capital */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 uppercase flex items-center space-x-1">
              <Wallet className="w-3.5 h-3.5 text-lanka-gold" />
              <span>Starting Capital:</span>
            </span>
            <span className="font-mono font-bold text-lanka-gold text-base">
              Rs. {initialCapitalLkr.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min="10000"
            max="2000000"
            step="10000"
            value={initialCapitalLkr}
            onChange={(e) => setInitialCapitalLkr(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lanka-gold"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {capitalPresets.map((amt) => (
              <button
                key={amt}
                onClick={() => setInitialCapitalLkr(amt)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                  initialCapitalLkr === amt
                    ? 'bg-lanka-gold text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-emerald-400/90 pt-1 border-t border-slate-850 flex items-center justify-between">
            <span>Instant USDT Power:</span>
            <strong>~{initialUsdt.toFixed(1)} USDT</strong>
          </div>
        </div>

        {/* Control 2: Time Horizon */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 uppercase flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Horizon Duration:</span>
            </span>
            <span className="font-mono font-bold text-sky-400 text-base">
              {horizonYears} {horizonYears === 1 ? 'Year' : 'Years'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-2">
            {[1, 3, 5, 10].map((yr) => (
              <button
                key={yr}
                onClick={() => setHorizonYears(yr)}
                className={`py-2 text-xs font-mono font-semibold rounded-xl border transition-all ${
                  horizonYears === yr
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>

          <div className="text-[10px] font-mono text-slate-400 text-center pt-2">
            Simulates through <strong>{2026 + horizonYears}</strong> economic cycle
          </div>
        </div>

        {/* Control 3: Macro Drag (Inflation & Depreciation) */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <span className="font-mono text-[11px] text-slate-400 uppercase block">
            Macro Drag Assumptions
          </span>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">LKR Inflation (Target):</span>
              <span className="text-rose-400 font-bold">+{annualInflationPct.toFixed(1)}%/yr</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={annualInflationPct}
              onChange={(e) => setAnnualInflationPct(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">LKR/USD Depreciation:</span>
              <span className="text-amber-400 font-bold">+{annualDepreciationPct.toFixed(1)}%/yr</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="10.0"
              step="0.5"
              value={annualDepreciationPct}
              onChange={(e) => setAnnualDepreciationPct(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Control 4: USDT Yield / Staking */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-400 uppercase">
              USDT Staking / APY
            </span>
            <button
              onClick={() => setEnableUsdtYield(!enableUsdtYield)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                enableUsdtYield
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {enableUsdtYield ? 'ENABLED' : 'OFF (Idle)'}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Stablecoin Yield:</span>
              <span className="text-emerald-400 font-bold">
                {enableUsdtYield ? `+${usdtYieldPct.toFixed(1)}%/yr` : '0.0%'}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              disabled={!enableUsdtYield}
              value={usdtYieldPct}
              onChange={(e) => setUsdtYieldPct(parseFloat(e.target.value))}
              className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${
                !enableUsdtYield ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div className="text-[10px] text-slate-400 leading-snug pt-1">
            {enableUsdtYield
              ? 'Conservative institutional DeFi or exchange earn APY compounding annually.'
              : 'Pure cold storage / self-custody holding without counterparty yield.'}
          </div>
        </div>
      </div>

      {/* Outcome Cards Grid: 4 Competing Strategies at Horizon End */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Strategy A: Physical Cash LKR */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/20 to-slate-950 border border-rose-900/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                Uninvested Cash LKR
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
                Mattress / Zero Yield
              </span>
            </div>
            <span className="text-2xl font-serif font-bold text-slate-200 block">
              Rs. {initialCapitalLkr.toLocaleString()}
            </span>
            <span className="text-xs text-rose-400 font-mono block mt-0.5">
              Real Value: Rs. {endData.cashReal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-850 text-xs">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Purchasing Power Loss:</span>
              <span className="text-rose-400 font-bold">
                -{((1 - endData.cashReal / initialCapitalLkr) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">USDT Worth ({2026 + horizonYears}):</span>
              <span className="text-slate-300 font-bold">{endData.cashUsdt} USDT</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Inflation relentlessly erodes the purchasing power of idle domestic banknotes.
            </p>
          </div>
        </div>

        {/* Strategy B: Sri Lanka T-Bills / Bank Fixed Deposit */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-950/20 to-slate-950 border border-sky-900/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center">
                <Landmark className="w-3 h-3 mr-1 text-sky-400" />
                T-Bills / Bank FD
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/40">
                8.5% p.a. Compound
              </span>
            </div>
            <span className="text-2xl font-serif font-bold text-sky-300 block">
              Rs. {endData.tbillsNominal.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono block mt-0.5">
              Real Value: Rs. {endData.tbillsReal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-850 text-xs">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Total Nominal Gain:</span>
              <span className="text-emerald-400 font-bold">
                +{((endData.tbillsNominal / initialCapitalLkr - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">USDT Worth ({2026 + horizonYears}):</span>
              <span className="text-slate-300 font-bold">{endData.tbillsUsdt} USDT</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Risk-free domestic rate beats inflation, producing positive local real wealth.
            </p>
          </div>
        </div>

        {/* Strategy C: USDT Digital Dollars */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-950 border border-emerald-700/60 shadow-lg shadow-emerald-950/40 space-y-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center">
                <Coins className="w-3 h-3 mr-1 text-emerald-400" />
                USDT Digital Dollars
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                {enableUsdtYield ? '+4.5% APY' : 'Pure Hedge'}
              </span>
            </div>
            <span className="text-2xl font-serif font-bold text-emerald-300 block">
              {endData.usdtHolding.toLocaleString()} USDT
            </span>
            <span className="text-xs text-emerald-400 font-mono block mt-0.5">
              LKR Equiv: Rs. {endData.usdtLkrNominal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-850 text-xs">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Rupee Value Growth:</span>
              <span className="text-emerald-400 font-bold">
                +{((endData.usdtLkrNominal / initialCapitalLkr - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Sovereign FX Protection:</span>
              <span className="text-emerald-300 font-bold">100% Protected</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Global hard-currency liquidity protects fully against unexpected Rupee devaluation shocks.
            </p>
          </div>
        </div>

        {/* Strategy D: Productive Sri Lankan Equities / CSE Growth */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-950 border border-amber-900/40 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-lanka-gold font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-lanka-gold" />
                CSE / Productive Equities
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                13.5% CAGR Recovery
              </span>
            </div>
            <span className="text-2xl font-serif font-bold text-lanka-gold block">
              Rs. {endData.equityNominal.toLocaleString()}
            </span>
            <span className="text-xs text-amber-400 font-mono block mt-0.5">
              Real Value: Rs. {endData.equityReal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-850 text-xs">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Total Nominal Gain:</span>
              <span className="text-lanka-gold font-bold">
                +{((endData.equityNominal / initialCapitalLkr - 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">USDT Worth ({2026 + horizonYears}):</span>
              <span className="text-slate-300 font-bold">{endData.equityUsdt} USDT</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Participates in national industrial rebound, exports, and corporate enterprise expansion.
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Chart: Nominal LKR Value of Each Path */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-lanka-gold" />
            <h4 className="text-base font-serif font-bold text-slate-100">
              Wealth Accumulation Trajectory (Nominal LKR Value)
            </h4>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Initial Capital: Rs. {initialCapitalLkr.toLocaleString()} ({initialUsdt.toFixed(0)} USDT)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectoryData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="yearLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `Rs. ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
                formatter={(val: number, name: string) => [
                  `Rs. ${val.toLocaleString()}`,
                  name
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="equityNominal"
                name="CSE Productive Equities (13.5%)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="usdtLkrNominal"
                name="USDT Digital Dollars (in LKR)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="tbillsNominal"
                name="T-Bills / Fixed Deposit (8.5%)"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="cashReal"
                name="Cash LKR (Real Purchasing Power)"
                stroke="#f43f5e"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Purchasing Power Reality Comparison Matrix */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <h4 className="text-base font-serif font-bold text-slate-100">
            Purchasing Power Reality Check: 1 USDT vs 1,000 LKR
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          Comparing how global purchasing power compares between hard digital currency (USDT) and Sri Lankan domestic currency across the horizon.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2026 Snapshot */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-serif font-bold text-slate-200">2026 (Current Benchmark)</span>
              <span className="font-mono text-emerald-400 font-bold">1 USDT ≈ Rs. {liveUsdRate.toFixed(0)}</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">1,000 LKR Buys:</span>
                <span className="text-slate-300 font-sans">
                  ~3.03 USDT • 1 modest lunch packet or 2.5 litres petrol
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 block uppercase">100 USDT Buys:</span>
                <span className="text-slate-300 font-sans">
                  Rs. {Math.round(100 * liveUsdRate).toLocaleString()} • 1 month global software stack or Starlink subscription
                </span>
              </div>
            </div>
          </div>

          {/* 2030 Snapshot */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-serif font-bold text-slate-200">2030 (Projected 4Y)</span>
              <span className="font-mono text-amber-400 font-bold">
                1 USDT ≈ Rs. {Math.round(liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 4))}
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">1,000 LKR Buys:</span>
                <span className="text-slate-300 font-sans">
                  ~{(1000 / (liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 4))).toFixed(2)} USDT • Basic small grocery staple
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 block uppercase">100 USDT Buys:</span>
                <span className="text-slate-300 font-sans">
                  Rs. {Math.round(100 * liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 4)).toLocaleString()} • Full international exam accreditation
                </span>
              </div>
            </div>
          </div>

          {/* 2035 Snapshot */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-serif font-bold text-slate-200">2035 (Projected 9Y)</span>
              <span className="font-mono text-rose-400 font-bold">
                1 USDT ≈ Rs. {Math.round(liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 9))}
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">1,000 LKR Buys:</span>
                <span className="text-slate-300 font-sans">
                  ~{(1000 / (liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 9))).toFixed(2)} USDT • Bottled water or commuter train ticket
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 block uppercase">100 USDT Buys:</span>
                <span className="text-slate-300 font-sans">
                  Rs. {Math.round(100 * liveUsdRate * Math.pow(1 + annualDepreciationPct / 100, 9)).toLocaleString()} • High-tier hardware component or cloud compute
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Takeaway Advice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-serif font-bold text-emerald-300 text-sm">
            Optimal Financial Strategy for Sri Lankan Technologists & Businesses
          </p>
          <p className="text-slate-300 font-sans leading-relaxed text-xs">
            1. <strong>Working Capital:</strong> Maintain 3–6 months of essential operational expenses in domestic T-Bills / Bank Fixed Deposits (~8.5%) to earn risk-free local interest while covering domestic bills.<br />
            2. <strong>Capital Preservation:</strong> Retain freelance, tech consulting, or surplus reserves in <strong>USDT (Digital USD)</strong> to immunize capital from sovereign exchange shocks and purchase global software without foreign exchange quotas.<br />
            3. <strong>Wealth Expansion:</strong> Channel long-term capital into productive Sri Lankan enterprises and equities (CSE ASPI) to capture upside as national GDP expands toward the \$100B+ threshold.
          </p>
        </div>
      </div>
    </div>
  );
};
