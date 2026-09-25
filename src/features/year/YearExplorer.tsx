import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Percent, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Language } from '@/types';
import { ECONOMIC_INDICATORS } from '@/data/economy/indicators';
import { HISTORICAL_DEMOGRAPHICS } from '@/data/population/demographics';
import { TIMELINE_EVENTS } from '@/data/history/timeline';
import { NATIONAL_LEADERS } from '@/data/leadership/leaders';
import { I18N_STRINGS } from '@/lib/i18n';
import { formatCurrency, formatPerCapita, formatPopulation, formatExchangeRate } from '@/lib/utils';

interface YearExplorerProps {
  lang: Language;
  onNavigateToLeader?: (leaderId: string) => void;
}

export const YearExplorer: React.FC<YearExplorerProps> = ({ lang, onNavigateToLeader }) => {
  const [selectedYear, setSelectedYear] = useState<number>(1983);
  const t = I18N_STRINGS[lang];

  // Available landmark years for quick jumps
  const landmarkYears = [1948, 1960, 1972, 1977, 1983, 1987, 1994, 2001, 2004, 2009, 2015, 2019, 2022, 2024];

  // Retrieve economic data for year (or nearest available)
  const economicData = useMemo(() => {
    const exact = ECONOMIC_INDICATORS.find(d => d.year === selectedYear);
    if (exact) return exact;
    // Find closest year
    return ECONOMIC_INDICATORS.reduce((prev, curr) => {
      return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev;
    });
  }, [selectedYear]);

  // Retrieve population data for year (or interpolated/nearest)
  const populationData = useMemo(() => {
    const exact = HISTORICAL_DEMOGRAPHICS.find(d => d.year === selectedYear);
    if (exact) return exact;
    return HISTORICAL_DEMOGRAPHICS.reduce((prev, curr) => {
      return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev;
    });
  }, [selectedYear]);

  // Retrieve leader in office during that year
  const leaderInOffice = useMemo(() => {
    return NATIONAL_LEADERS.find(leader => {
      const startYear = parseInt(leader.termStart.split('-')[0]);
      const endYear = leader.termEnd === 'Incumbent' ? 2026 : parseInt(leader.termEnd.split('-')[0]);
      return selectedYear >= startYear && selectedYear <= endYear;
    });
  }, [selectedYear]);

  // Retrieve timeline events that took place in or around that year
  const eventsInYear = useMemo(() => {
    const directEvents = TIMELINE_EVENTS.filter(e => e.year === selectedYear);
    if (directEvents.length > 0) return directEvents;
    // If no direct event in exact year, return events within ±2 years
    return TIMELINE_EVENTS.filter(e => Math.abs(e.year - selectedYear) <= 2);
  }, [selectedYear]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Interactive Time Machine</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            YEAR EXPLORER: {selectedYear}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Select any year to instantly reconstruct Sri Lanka’s constitutional leadership, demographic count, macroeconomic indicators, and historical developments at that exact moment in time.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">Temporal Synchronizer</span>
          <span className="text-xs font-medium text-lanka-gold">1948 – 2024 Series</span>
        </div>
      </div>

      {/* Main Year Scrubber & Landmark Pills */}
      <div className="p-6 rounded-2xl bg-museum-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl sm:text-6xl font-serif font-bold text-lanka-gold tracking-tight">
              {selectedYear}
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase">
              {selectedYear === 2024 ? 'Current / Final Census' : 'Archival Year'}
            </span>
          </div>

          {/* Slider */}
          <div className="flex-1 max-w-xl">
            <input
              type="range"
              min="1948"
              max="2024"
              step="1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lanka-gold"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
              <span>1948 (Independence)</span>
              <span>1978 (2nd Republic)</span>
              <span>2009 (Post-Conflict)</span>
              <span>2024 (Present)</span>
            </div>
          </div>
        </div>

        {/* Quick Jump Buttons to Historic Milestone Years */}
        <div className="pt-2 border-t border-slate-800 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-400 font-mono mr-1">Milestones:</span>
          {landmarkYears.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                selectedYear === yr
                  ? 'bg-lanka-gold text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Synchronized National State at Selected Year */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Head of State & Snapshot (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-museum-900 border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-lanka-gold">
              Leadership in Office in {selectedYear}
            </span>
            {leaderInOffice ? (
              <div className="mt-3 flex items-start space-x-4">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 flex-shrink-0">
                  <img 
                    src={leaderInOffice.portraitUrl} 
                    alt={leaderInOffice.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {leaderInOffice.office}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-slate-100">
                    {leaderInOffice.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Term: {leaderInOffice.yearsActive}
                  </p>
                  <p className="text-[11px] text-slate-300 font-sans pt-1">
                    {leaderInOffice.constitutionalEra}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mt-2">
                Transitional constitutional governance period.
              </p>
            )}
          </div>

          {/* Synchronized Macroeconomic & Demographic Metric Grid */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              National Metrics in {selectedYear}
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Population */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Population</span>
                <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                  {formatPopulation(populationData.population)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {populationData.isCensusYear ? 'Official Census Count' : 'Intercensal Estimate'}
                </span>
              </div>

              {/* GDP */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">GDP (Current USD)</span>
                <span className="text-base font-serif font-bold text-lanka-gold block mt-0.5">
                  {formatCurrency(economicData.gdpNominalUSD, 'USD')}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Rs. {economicData.gdpNominalLKR}B LKR
                </span>
              </div>

              {/* Per Capita */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">GDP Per Capita</span>
                <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                  {formatPerCapita(economicData.gdpPerCapitaUSD)}
                </span>
                <span className="text-[10px] text-slate-400 block">Annual / Person</span>
              </div>

              {/* Inflation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Inflation (CCPI)</span>
                <span className="text-base font-serif font-bold text-rose-400 block mt-0.5">
                  {economicData.inflationCCPI !== null ? `${economicData.inflationCCPI.toFixed(1)}%` : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-400 block">Annual Headline</span>
              </div>

              {/* Exchange Rate */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Exchange Rate</span>
                <span className="text-base font-serif font-bold text-purple-300 block mt-0.5">
                  {formatExchangeRate(economicData.exchangeRateLKRUSD)}
                </span>
                <span className="text-[10px] text-slate-400 block">LKR per USD</span>
              </div>

              {/* Life Expectancy */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Life Expectancy</span>
                <span className="text-base font-serif font-bold text-emerald-400 block mt-0.5">
                  {populationData.lifeExpectancyYears ? `${populationData.lifeExpectancyYears} yrs` : 'N/A'}
                </span>
                <span className="text-[10px] text-slate-400 block">Demographic Indicator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Events in/around Selected Year (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-museum-900 border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lanka-gold" />
              <span>Historical Developments in or around {selectedYear}</span>
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-100 mt-1">
              Events Recorded in the National Archive
            </h3>
          </div>

          {eventsInYear.length > 0 ? (
            <div className="space-y-4">
              {eventsInYear.map(event => (
                <div 
                  key={event.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-lanka-gold font-mono font-bold text-xs">
                      {event.displayDate}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {event.category}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-slate-100 text-lg">
                    {lang === 'si' ? event.titleSi : lang === 'ta' ? event.titleTa : event.title}
                  </h4>

                  <p className="text-slate-300 text-xs font-sans leading-relaxed">
                    {event.description}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-850 text-[11px] text-slate-400 flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>Location: <strong>{event.location}</strong> • {event.significance}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
              No landmark crisis or constitutional reconstitution logged for {selectedYear}. Consult the continuous National Timeline for adjacent developments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
