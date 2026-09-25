import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Sun, 
  Building2, 
  HelpCircle,
  Sliders,
  RotateCcw,
  Coins,
  Globe2
} from 'lucide-react';
import { Language } from '@/types';
import { INSTITUTIONAL_PROJECTIONS, calculateEducationalScenario } from '@/data/projections/futureScenarios';
import { I18N_STRINGS } from '@/lib/i18n';
import { formatCurrency, formatPerCapita } from '@/lib/utils';
import { FutureWealthSimulator } from './FutureWealthSimulator';
import { fetchLiveUSDToLKR } from '@/lib/forexService';

interface FutureSectionProps {
  lang: Language;
}

export const FutureSection: React.FC<FutureSectionProps> = ({ lang }) => {
  // Active Future View Tab: 'wealth' (Rupee & USDT Growth) or 'macro' (UN & World Bank Scenarios)
  const [activeTab, setActiveTab] = useState<'wealth' | 'macro'>('wealth');

  // Scenario Simulator Interactive Parameters
  const [targetYear, setTargetYear] = useState<number>(2035);
  const [gdpGrowthPct, setGdpGrowthPct] = useState<number>(4.5);
  const [popGrowthPct, setPopGrowthPct] = useState<number>(-0.1);
  const [renewableTransition, setRenewableTransition] = useState<'moderate' | 'accelerated' | 'slow'>('moderate');
  const [liveUsdRate, setLiveUsdRate] = useState<number>(329.81);

  useEffect(() => {
    fetchLiveUSDToLKR().then((res) => {
      if (res && res.rate) {
        setLiveUsdRate(res.rate);
      }
    });
  }, []);

  // Base year 2024 verified numbers
  const baseYearData = {
    year: 2024,
    gdpUSD: 91.20,
    populationMillions: 21.72
  };

  const simulatedResult = calculateEducationalScenario(baseYearData, targetYear, {
    gdpGrowthPct,
    annualPopulationGrowthPct: popGrowthPct,
    renewableEnergyTransitionSpeed: renewableTransition,
    exportGrowthPct: 5.0
  });

  const resetToDefault = () => {
    setTargetYear(2035);
    setGdpGrowthPct(4.5);
    setPopGrowthPct(-0.1);
    setRenewableTransition('moderate');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Horizon 2026 – 2050 Predictive & Financial Modeling</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            FUTURE OF SRI LANKA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Simulate national macroeconomic and demographic horizons, or model your capital's purchasing power growth across Sri Lankan Rupees and USDT Digital Dollars.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('wealth')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono transition-all ${
              activeTab === 'wealth'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Rupee & USDT Growth</span>
          </button>
          <button
            onClick={() => setActiveTab('macro')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-mono transition-all ${
              activeTab === 'macro'
                ? 'bg-lanka-gold text-slate-950 font-bold shadow-lg shadow-lanka-gold/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>National Horizon 2050</span>
          </button>
        </div>
      </div>

      {/* View 1: Rupee & USDT Wealth Growth Simulator */}
      {activeTab === 'wealth' && (
        <div className="space-y-8 animate-fadeIn">
          <FutureWealthSimulator lang={lang} liveUsdRate={liveUsdRate} />
        </div>
      )}

      {/* View 2: Macroeconomic National Projections & Educational Scenarios */}
      {activeTab === 'macro' && (
        <div className="space-y-10 animate-fadeIn">
          {/* Mandatory Non-Forecast Legal & Scientific Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 flex items-start space-x-3.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-serif font-bold text-amber-300 text-sm">
                MANDATORY NOTICE: PROJECTIONS ARE SCENARIOS, NEVER GUARANTEED OUTCOMES
              </p>
              <p className="text-slate-300 font-sans leading-relaxed text-xs">
                Future values must never be interpreted as certainty, official promises, or guaranteed state outcomes. Long-range indicators are subject to unpredictable global energy shifts, climatic events, domestic policy choices, and demographic transitions. Projections are clearly partitioned into <strong>Official Forecasts</strong>, <strong>Institutional Projections</strong>, and <strong>User-Created Illustrative Scenarios</strong>.
              </p>
            </div>
          </div>

          {/* Verified Institutional Projections (2026, 2030, 2035, 2040, 2050) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-slate-100 text-lg flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-lanka-gold" />
                <span>Institutional Projections (UN DESA & Multilateral Agencies)</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Cohort-Component & Macro-Consistency Models
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {INSTITUTIONAL_PROJECTIONS.map((proj) => (
                <div 
                  key={proj.year}
                  className="p-5 rounded-2xl bg-museum-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-serif font-bold text-lanka-gold">
                        {proj.year}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase truncate max-w-[110px]">
                        {proj.type}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Projected GDP</span>
                        <span className="text-sm font-serif font-bold text-slate-100">
                          ${proj.gdpUSD}B USD
                        </span>
                        <span className="text-[10px] text-emerald-400 block">
                          +{proj.gdpRealGrowthPct}% avg annual
                        </span>
                      </div>

                      <div className="p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Per Capita GDP</span>
                        <span className="text-sm font-serif font-bold text-slate-100">
                          {formatPerCapita(proj.gdpPerCapitaUSD)}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Projected Population</span>
                        <span className="text-sm font-serif font-bold text-slate-100">
                          {proj.populationMillions}M citizens
                        </span>
                        <span className="text-[10px] text-slate-400 block">UN Median Variant</span>
                      </div>

                      <div className="p-2 rounded bg-slate-950 border border-slate-850">
                        <span className="text-[10px] text-slate-400 block">Renewable Power</span>
                        <span className="text-sm font-serif font-bold text-teal-300">
                          {proj.renewableEnergyPct}% of Grid
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-850 text-[10px] text-slate-400 space-y-1">
                    <p className="line-clamp-3">{proj.notes}</p>
                    <span className="text-[9px] text-slate-400 block truncate">
                      Source: {proj.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Educational Scenario Builder */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-museum-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4 text-lanka-gold" />
                  <span>Interactive Scenario Simulator</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
                  Explore Macroeconomic Horizons (Illustrative Scenario Modeler)
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                  Illustrative Scenario — NOT a forecast
                </span>
                <button
                  onClick={resetToDefault}
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Reset parameters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Parameter 1: Target Year */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 uppercase">Target Horizon Year:</span>
                  <span className="font-serif font-bold text-lanka-gold text-base">{targetYear}</span>
                </div>
                <input
                  type="range"
                  min="2026"
                  max="2050"
                  step="1"
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lanka-gold"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>2026</span>
                  <span>2035</span>
                  <span>2050</span>
                </div>
              </div>

              {/* Parameter 2: Annual Real GDP Growth */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 uppercase">Annual GDP Growth Rate:</span>
                  <span className="font-serif font-bold text-emerald-400 text-base">+{gdpGrowthPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.1"
                  value={gdpGrowthPct}
                  onChange={(e) => setGdpGrowthPct(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>1.0% (Stagnant)</span>
                  <span>4.5% (Baseline)</span>
                  <span>8.0% (High Growth)</span>
                </div>
              </div>

              {/* Parameter 3: Population Trajectory */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 uppercase">Annual Population Change:</span>
                  <span className="font-serif font-bold text-sky-400 text-base">
                    {popGrowthPct > 0 ? '+' : ''}{popGrowthPct.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-0.8"
                  max="0.8"
                  step="0.05"
                  value={popGrowthPct}
                  onChange={(e) => setPopGrowthPct(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>-0.8% (Net Outflow)</span>
                  <span>-0.1% (UN Trend)</span>
                  <span>+0.8% (Rebound)</span>
                </div>
              </div>
            </div>

            {/* Calculated Simulation Output Display */}
            {simulatedResult && (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <span className="text-xs font-mono uppercase text-slate-400">
                    Mathematical Model Output for Horizon {targetYear} (Base: 2024 $91.2B GDP, 21.72M Pop)
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">
                    {simulatedResult.disclaimer}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Simulated Output (GDP)</span>
                    <span className="text-2xl font-serif font-bold text-lanka-gold block mt-1">
                      ${simulatedResult.gdpUSD} Billion
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Assumes constant compound growth of {gdpGrowthPct}%
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Simulated Per Capita GDP</span>
                    <span className="text-2xl font-serif font-bold text-slate-100 block mt-1">
                      {formatPerCapita(simulatedResult.gdpPerCapitaUSD)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Output divided by modeled resident population
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Simulated Resident Population</span>
                    <span className="text-2xl font-serif font-bold text-sky-400 block mt-1">
                      {simulatedResult.populationMillions} Million
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Annual drift: {popGrowthPct}% per annum
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
