import React, { useState } from 'react';
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
  Legend
} from 'recharts';
import { 
  Users, 
  Heart, 
  Activity, 
  MapPin, 
  Award, 
  Calendar, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Baby, 
  Crosshair 
} from 'lucide-react';
import { Language, DemographicYear } from '@/types';
import { HISTORICAL_DEMOGRAPHICS, POPULATION_PYRAMID_2024 } from '@/data/population/demographics';
import { SRI_LANKA_DISTRICTS } from '@/data/maps/districts';
import { I18N_STRINGS } from '@/lib/i18n';
import { formatPopulation } from '@/lib/utils';

interface PeopleExplorerProps {
  lang: Language;
}

export const PeopleExplorer: React.FC<PeopleExplorerProps> = ({ lang }) => {
  const [selectedCensusYear, setSelectedCensusYear] = useState<DemographicYear | null>(null);
  const t = I18N_STRINGS[lang];

  // Latest verified population loaded dynamically from data layer (21.72M)
  const latestDemo = HISTORICAL_DEMOGRAPHICS[HISTORICAL_DEMOGRAPHICS.length - 1];

  // Census years only
  const censusYears = HISTORICAL_DEMOGRAPHICS.filter(d => d.isCensusYear);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Demographic History & 2024 Census Insights</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            PEOPLE OF SRI LANKA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Tracing 153 years of national population enumerations from Ceylon's first census in 1871 to the final 2024 Census of Population and Housing.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400 block">Source Agency</span>
          <span className="text-xs font-medium text-slate-200">Department of Census & Statistics</span>
        </div>
      </div>

      {/* Main Animated Population Counter Card */}
      <div className="relative overflow-hidden rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 via-museum-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-lanka-gold/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-lanka-gold" />
              <span>National Population (2024 Final Census Enumeration)</span>
            </span>
            <div className="flex items-baseline space-x-4">
              <span className="text-5xl sm:text-7xl font-serif font-bold text-slate-100 tracking-tight">
                {formatPopulation(latestDemo.population)}
              </span>
              <span className="text-sm font-mono text-slate-400">
                ({latestDemo.population.toLocaleString('en-US')} citizens)
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl font-sans leading-relaxed">
              Enumerated under the 15th National Census of Population and Housing (DCS). Net contraction reflects sustained low fertility rates (1.9 births per woman) and heightened skilled external migration flows between 2022 and 2024.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Density</span>
              <span className="text-lg font-serif font-bold text-slate-100">
                {latestDemo.densityPerKm2} / km²
              </span>
              <span className="text-[10px] text-slate-400 block">Island Average</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Life Expectancy</span>
              <span className="text-lg font-serif font-bold text-emerald-400">
                {latestDemo.lifeExpectancyYears} years
              </span>
              <span className="text-[10px] text-slate-400 block">Birth Cohort</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Median Age</span>
              <span className="text-lg font-serif font-bold text-amber-400">
                {latestDemo.medianAge} years
              </span>
              <span className="text-[10px] text-slate-400 block">Demographic Shift</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Annual Growth</span>
              <span className="text-lg font-serif font-bold text-rose-400">
                {latestDemo.populationGrowthPct}%
              </span>
              <span className="text-[10px] text-slate-400 block">2023–2024 Intercensal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Census Milestone Timeline Bar (1871–2024) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-slate-100 text-lg flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-lanka-gold" />
            <span>Official Census Years of Ceylon & Sri Lanka (1871–2024)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Click any census year for field notes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2.5">
          {censusYears.map((census, idx) => (
            <div
              key={census.year}
              onClick={() => setSelectedCensusYear(census)}
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-lanka-gold/60 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-lanka-gold">
                  {census.year}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-lanka-gold/20 text-lanka-gold font-mono text-[9px] font-semibold">
                  CENSUS #{census.censusDetails?.censusNumber || idx + 1}
                </span>
              </div>
              <span className="text-sm font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight block truncate">
                {formatPopulation(census.population)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {census.densityPerKm2} / km²
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Population Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Population Trajectory (1871–2024) */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                1. Total National Population Growth (1871–2024)
              </h4>
              <p className="text-[11px] text-slate-400">
                Units: Millions of Citizens • Source: DCS Decennial Censuses
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-lanka-gold">
              DCS Series
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={HISTORICAL_DEMOGRAPHICS} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 11 }} 
                  tickFormatter={(val) => `${(val / 1e6).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [val.toLocaleString(), 'Population']}
                />
                <Area 
                  type="monotone" 
                  dataKey="population" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#popGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Population increased ninefold from 2.40 million in 1871 to peak over 22.1 million in 2022 before modern stabilizing trend.
          </div>
        </div>

        {/* CHART 2: Life Expectancy Progression */}
        <div className="p-5 rounded-2xl bg-museum-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                2. Life Expectancy at Birth (1871–2024)
              </h4>
              <p className="text-[11px] text-slate-400">
                Units: Years of Life • Source: Registrar General & DCS
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
              Social Indicator
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={HISTORICAL_DEMOGRAPHICS} 
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[30, 85]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} years`, 'Life Expectancy']}
                />
                <Line 
                  type="monotone" 
                  dataKey="lifeExpectancyYears" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
            Note: Life expectancy more than doubled from 34.0 years in 1871 to 77.2 years in 2024, driven by universal healthcare, maternal health clinics, and malaria eradication.
          </div>
        </div>
      </div>

      {/* DCS 2024 Population Age-Sex Pyramid */}
      <div className="p-6 rounded-2xl bg-museum-900/80 border border-slate-800 space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-slate-100 text-base sm:text-lg">
              3. DCS 2024 Census National Age-Sex Population Pyramid
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Reflects Sri Lanka’s transition into an aged society: expanding middle-aged cohorts and contracting base due to below-replacement fertility.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center text-sky-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 mr-1.5" />
              Male Cohort
            </span>
            <span className="flex items-center text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 mr-1.5" />
              Female Cohort
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={POPULATION_PYRAMID_2024} 
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis dataKey="ageRange" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={50} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: number, name: string) => [
                  `${val}% of population`,
                  name === 'malePct' ? 'Male' : 'Female'
                ]}
              />
              <Bar dataKey="malePct" name="Male %" fill="#38bdf8" />
              <Bar dataKey="femalePct" name="Female %" fill="#fb7185" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Provincial Summary Table */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-slate-100 text-lg">
          4. District Populations (2024 Census & Land Densities)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-museum-900/60">
          <table className="w-full text-left text-xs font-sans text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Province</th>
                <th className="py-3 px-4">2024 Census Population</th>
                <th className="py-3 px-4">Area (km²)</th>
                <th className="py-3 px-4">Density (/km²)</th>
                <th className="py-3 px-4">Primary Economy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {SRI_LANKA_DISTRICTS.slice(0, 10).map((dist) => (
                <tr key={dist.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-100 font-sans">
                    {dist.name} ({dist.nameSi})
                  </td>
                  <td className="py-2.5 px-4 text-slate-400">{dist.province}</td>
                  <td className="py-2.5 px-4 font-medium text-lanka-gold">{dist.population2024.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-slate-400">{dist.areaKm2.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-slate-300">{dist.densityPerKm2}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-sans text-[11px]">{dist.majorIndustries[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 bg-slate-950 text-center text-[11px] text-slate-400 border-t border-slate-800">
            Showing top 10 districts. Explore all 25 districts with full geographic layers in the Map Explorer.
          </div>
        </div>
      </div>

      {/* Census Modal Inspector */}
      {selectedCensusYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-museum-950/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-museum-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-lanka-gold/20 text-lanka-gold font-mono font-bold text-sm">
                  CENSUS {selectedCensusYear.year}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  # {selectedCensusYear.censusDetails?.censusNumber}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCensusYear(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Total Enumerated Count</span>
                  <span className="text-base font-serif font-bold text-slate-100">
                    {selectedCensusYear.population.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Population Density</span>
                  <span className="text-base font-serif font-bold text-slate-100">
                    {selectedCensusYear.densityPerKm2} / km²
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-lanka-gold block">Official Census Observation</span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">
                  {selectedCensusYear.censusDetails?.keyObservation}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div>• Urban Population Share: {selectedCensusYear.urbanPct}%</div>
                <div>• Estimated Life Expectancy: {selectedCensusYear.lifeExpectancyYears} years</div>
                <div>• Crude Birth Rate: {selectedCensusYear.birthRatePer1000} per 1,000</div>
                <div>• Crude Death Rate: {selectedCensusYear.deathRatePer1000} per 1,000</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCensusYear(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
