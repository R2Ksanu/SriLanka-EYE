import React, { useState } from 'react';
import { 
  Landmark, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Scale, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  X,
  ExternalLink
} from 'lucide-react';
import { Language, NationalLeader } from '@/types';
import { NATIONAL_LEADERS } from '@/data/leadership/leaders';
import { DATA_SOURCES } from '@/data/sources/sources';
import { I18N_STRINGS } from '@/lib/i18n';
import { formatCurrency, formatPerCapita, formatPercent } from '@/lib/utils';

interface LeadershipExplorerProps {
  lang: Language;
}

const getMedallionSvg = (name: string) => {
  const initials = name
    .split(' ')
    .filter(n => !n.startsWith('(') && n.length > 0)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240' width='200' height='240'>
    <defs>
      <linearGradient id='bgGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='#0f172a'/>
        <stop offset='50%' stop-color='#020617'/>
        <stop offset='100%' stop-color='#1e1b4b'/>
      </linearGradient>
      <linearGradient id='goldGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='#fbbf24'/>
        <stop offset='100%' stop-color='#d97706'/>
      </linearGradient>
    </defs>
    <rect width='200' height='240' fill='url(%23bgGrad)'/>
    <circle cx='100' cy='105' r='55' fill='none' stroke='url(%23goldGrad)' stroke-width='2' stroke-dasharray='4,2'/>
    <circle cx='100' cy='105' r='48' fill='#0f172a' stroke='url(%23goldGrad)' stroke-width='1.5'/>
    <text x='100' y='116' fill='#fbbf24' font-family='serif' font-weight='bold' font-size='28' text-anchor='middle' letter-spacing='2'>${initials}</text>
    <text x='100' y='185' fill='#94a3b8' font-family='sans-serif' font-size='10' text-anchor='middle' letter-spacing='1.5' font-weight='600'>STATE ARCHIVE</text>
    <text x='100' y='200' fill='#d97706' font-family='sans-serif' font-size='8' text-anchor='middle' letter-spacing='2'>SRI LANKA</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getLeaderImageSrc = (leaderId: string) => {
  return `${import.meta.env.BASE_URL}images/leaders/${leaderId}.jpg`;
};

export const LeadershipExplorer: React.FC<LeadershipExplorerProps> = ({ lang }) => {
  const [selectedLeader, setSelectedLeader] = useState<NationalLeader>(NATIONAL_LEADERS[NATIONAL_LEADERS.length - 1]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [leaderAId, setLeaderAId] = useState<string>(NATIONAL_LEADERS[3].id); // J.R. Jayewardene
  const [leaderBId, setLeaderBId] = useState<string>(NATIONAL_LEADERS[NATIONAL_LEADERS.length - 2].id); // Ranil Wickremesinghe
  const t = I18N_STRINGS[lang];

  const leaderA = NATIONAL_LEADERS.find(l => l.id === leaderAId) || NATIONAL_LEADERS[0];
  const leaderB = NATIONAL_LEADERS.find(l => l.id === leaderBId) || NATIONAL_LEADERS[1];

  const getSource = (sourceId: string) => DATA_SOURCES.find(s => s.id === sourceId);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, leader: NationalLeader) => {
    const target = e.currentTarget;
    if (!target.dataset.triedRemote && target.src !== leader.portraitUrl) {
      target.dataset.triedRemote = 'true';
      target.src = leader.portraitUrl;
    } else {
      target.src = getMedallionSvg(leader.name);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Constitutional Governance & Leadership Chronology</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            HEADS OF STATE & GOVERNMENT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Empirical historical documentation across the Soulbury, First Republican, and Second Republican Constitutions. Presented with neutral indicators and zero political scorecards.
          </p>
        </div>

        {/* Toggle Era Comparison Tool */}
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center space-x-2 transition-all shadow-md ${
            compareMode
              ? 'bg-lanka-gold text-slate-950 font-semibold'
              : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4 text-lanka-gold" />
          <span>{compareMode ? 'Exit Era Comparison' : 'Launch Era Comparison Tool'}</span>
        </button>
      </div>

      {/* Non-Causation Neutrality Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            Neutrality Protocol & Non-Causal Measurement Rule
          </p>
          <p className="text-slate-400 leading-relaxed font-sans">
            Indicators recorded during a leadership administration are shown as temporal contextual measurements. They do not imply that an administration alone caused those changes. Macroeconomic and social outcomes are determined by international commodity cycles, climatic shocks, long-term multi-decade infrastructure investments, and external geopolitical events. No performance scores or political rankings are generated.
          </p>
        </div>
      </div>

      {/* ERA COMPARISON TOOL VIEW */}
      {compareMode ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-museum-900/90 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-serif font-bold text-slate-100 text-lg flex items-center space-x-2">
                <Scale className="w-5 h-5 text-lanka-gold" />
                <span>Side-by-Side Administration Era Comparison</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select two historical administrations to contrast contemporaneous macroeconomic parameters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                DATA AVAILABLE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                NOMINAL / REAL NOTED
              </span>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Era A */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Administration A:
              </label>
              <select
                value={leaderAId}
                onChange={(e) => setLeaderAId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-lanka-gold"
              >
                {NATIONAL_LEADERS.map(leader => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name} ({leader.yearsActive}) — {leader.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Era B */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Administration B:
              </label>
              <select
                value={leaderBId}
                onChange={(e) => setLeaderBId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-lanka-gold"
              >
                {NATIONAL_LEADERS.map(leader => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name} ({leader.yearsActive}) — {leader.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs font-sans text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-1/3">Indicator / Dimension</th>
                  <th className="py-3 px-4 w-1/3 text-lanka-gold font-bold">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-950 border border-lanka-gold/60 flex-shrink-0">
                        <img
                          src={getLeaderImageSrc(leaderA.id)}
                          alt={leaderA.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, leaderA)}
                        />
                      </div>
                      <div>
                        <div className="text-slate-100 text-xs font-semibold">{leaderA.name}</div>
                        <div className="text-[10px] font-mono text-lanka-gold font-normal">{leaderA.yearsActive}</div>
                      </div>
                    </div>
                  </th>
                  <th className="py-3 px-4 w-1/3 text-sky-400 font-bold">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-950 border border-sky-400/60 flex-shrink-0">
                        <img
                          src={getLeaderImageSrc(leaderB.id)}
                          alt={leaderB.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, leaderB)}
                        />
                      </div>
                      <div>
                        <div className="text-slate-100 text-xs font-semibold">{leaderB.name}</div>
                        <div className="text-[10px] font-mono text-sky-400 font-normal">{leaderB.yearsActive}</div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Constitutional Office</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{leaderA.office}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{leaderB.office}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Constitutional Era</td>
                  <td className="py-3 px-4 text-slate-300">{leaderA.constitutionalEra}</td>
                  <td className="py-3 px-4 text-slate-300">{leaderB.constitutionalEra}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Term Duration</td>
                  <td className="py-3 px-4 font-mono">{leaderA.termStart} to {leaderA.termEnd}</td>
                  <td className="py-3 px-4 font-mono">{leaderB.termStart} to {leaderB.termEnd}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Nominal GDP Span (Current USD)</td>
                  <td className="py-3 px-4 font-mono">
                    ${leaderA.economicIndicatorsDuringTerm.startGDPUSD}B → ${leaderA.economicIndicatorsDuringTerm.endGDPUSD}B
                  </td>
                  <td className="py-3 px-4 font-mono">
                    ${leaderB.economicIndicatorsDuringTerm.startGDPUSD}B → ${leaderB.economicIndicatorsDuringTerm.endGDPUSD}B
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">GDP Per Capita (Current USD)</td>
                  <td className="py-3 px-4 font-mono">
                    ${leaderA.economicIndicatorsDuringTerm.startPerCapitaUSD} → ${leaderA.economicIndicatorsDuringTerm.endPerCapitaUSD}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    ${leaderB.economicIndicatorsDuringTerm.startPerCapitaUSD} → ${leaderB.economicIndicatorsDuringTerm.endPerCapitaUSD}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Average Real GDP Growth</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                    +{leaderA.economicIndicatorsDuringTerm.avgGrowthPct}%
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                    +{leaderB.economicIndicatorsDuringTerm.avgGrowthPct}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Inflation Range (CCPI %)</td>
                  <td className="py-3 px-4 font-mono">
                    {leaderA.economicIndicatorsDuringTerm.startInflationPct}% → {leaderA.economicIndicatorsDuringTerm.endInflationPct}%
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {leaderB.economicIndicatorsDuringTerm.startInflationPct}% → {leaderB.economicIndicatorsDuringTerm.endInflationPct}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Central Gov Debt (% of GDP)</td>
                  <td className="py-3 px-4 font-mono">
                    {leaderA.economicIndicatorsDuringTerm.startDebtPctGDP}% → {leaderA.economicIndicatorsDuringTerm.endDebtPctGDP}%
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {leaderB.economicIndicatorsDuringTerm.startDebtPctGDP}% → {leaderB.economicIndicatorsDuringTerm.endDebtPctGDP}%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400">Exchange Rate (LKR / USD)</td>
                  <td className="py-3 px-4 font-mono">
                    Rs. {leaderA.economicIndicatorsDuringTerm.startExchangeRate} → Rs. {leaderA.economicIndicatorsDuringTerm.endExchangeRate}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    Rs. {leaderB.economicIndicatorsDuringTerm.startExchangeRate} → Rs. {leaderB.economicIndicatorsDuringTerm.endExchangeRate}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono text-slate-400 align-top">Historical Context Notes</td>
                  <td className="py-3 px-4 text-slate-400 leading-relaxed text-[11px]">
                    {leaderA.economicIndicatorsDuringTerm.notes}
                  </td>
                  <td className="py-3 px-4 text-slate-400 leading-relaxed text-[11px]">
                    {leaderB.economicIndicatorsDuringTerm.notes}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Chronological Leadership Selector Bar */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
          Chronological Leadership Timeline (Click to View Archival Record)
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs no-scrollbar">
          {NATIONAL_LEADERS.map((leader) => {
            const isSelected = selectedLeader.id === leader.id;
            return (
              <button
                key={leader.id}
                onClick={() => setSelectedLeader(leader)}
                className={`p-3 rounded-xl whitespace-nowrap text-left transition-all border flex-shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 border-lanka-gold shadow-md shadow-lanka-gold/10'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-700">
                    <img 
                      src={getLeaderImageSrc(leader.id)} 
                      alt={leader.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, leader)}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-100 block text-xs truncate max-w-[150px]">
                      {leader.name}
                    </span>
                    <span className="text-[10px] font-mono text-lanka-gold block">
                      {leader.yearsActive}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Leader In-Depth Dossier Card */}
      <div className="rounded-2xl bg-museum-900/80 border border-slate-800 p-6 sm:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-start space-x-5">
            <div className="w-24 h-28 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-slate-950 border-2 border-slate-700 shadow-xl flex-shrink-0">
              <img 
                src={getLeaderImageSrc(selectedLeader.id)} 
                alt={selectedLeader.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, selectedLeader)}
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 inline-block">
                {selectedLeader.office}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                {selectedLeader.name}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                {selectedLeader.nameSi} • {selectedLeader.nameTa}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-400">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-lanka-gold mr-1" />
                  {selectedLeader.termStart} to {selectedLeader.termEnd} ({selectedLeader.yearsActive})
                </span>
                <span>•</span>
                <span className="text-slate-300">{selectedLeader.constitutionalEra}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-right self-stretch lg:self-auto">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Gazetted Term</span>
            <span className="text-base font-serif font-bold text-lanka-gold block">
              {selectedLeader.yearsActive}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Parliament of Sri Lanka Record
            </span>
          </div>
        </div>

        {/* Historical Context & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Historical Context of Administration
              </h4>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {selectedLeader.summary}
              </p>
              <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                {selectedLeader.historicalContext}
              </p>
            </div>

            {/* Documented Major Events */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-lanka-gold flex items-center space-x-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-lanka-gold" />
                <span>Documented Historical Milestones During Term</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedLeader.documentedMajorEvents.map((evt, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-850 flex items-start space-x-2">
                    <span className="text-lanka-gold font-mono">•</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Economic Measurements During Period */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-lanka-gold" />
                <span>Macroeconomic Indicators During Administration</span>
              </h4>
              <p className="text-[11px] text-slate-400 font-sans italic">
                {selectedLeader.economicIndicatorsDuringTerm.notes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">GDP Movement (USD)</span>
                <span className="text-sm font-serif font-bold text-slate-100 block mt-0.5">
                  ${selectedLeader.economicIndicatorsDuringTerm.startGDPUSD}B → ${selectedLeader.economicIndicatorsDuringTerm.endGDPUSD}B
                </span>
                <span className="text-[10px] text-slate-400 block">Current USD</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">GDP Per Capita (USD)</span>
                <span className="text-sm font-serif font-bold text-slate-100 block mt-0.5">
                  ${selectedLeader.economicIndicatorsDuringTerm.startPerCapitaUSD} → ${selectedLeader.economicIndicatorsDuringTerm.endPerCapitaUSD}
                </span>
                <span className="text-[10px] text-slate-400 block">Per Person Annual</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Average Real Growth</span>
                <span className="text-sm font-serif font-bold text-emerald-400 block mt-0.5">
                  +{selectedLeader.economicIndicatorsDuringTerm.avgGrowthPct}%
                </span>
                <span className="text-[10px] text-slate-400 block">Constant Prices YoY</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Inflation (CCPI)</span>
                <span className="text-sm font-serif font-bold text-slate-100 block mt-0.5">
                  {selectedLeader.economicIndicatorsDuringTerm.startInflationPct}% → {selectedLeader.economicIndicatorsDuringTerm.endInflationPct}%
                </span>
                <span className="text-[10px] text-slate-400 block">Annual Headline</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Central Gov Debt</span>
                <span className="text-sm font-serif font-bold text-slate-100 block mt-0.5">
                  {selectedLeader.economicIndicatorsDuringTerm.startDebtPctGDP}% → {selectedLeader.economicIndicatorsDuringTerm.endDebtPctGDP}%
                </span>
                <span className="text-[10px] text-slate-400 block">% of GDP</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Exchange Rate</span>
                <span className="text-sm font-serif font-bold text-purple-300 block mt-0.5">
                  Rs. {selectedLeader.economicIndicatorsDuringTerm.startExchangeRate} → Rs. {selectedLeader.economicIndicatorsDuringTerm.endExchangeRate}
                </span>
                <span className="text-[10px] text-slate-400 block">LKR per USD</span>
              </div>
            </div>

            {/* Major Infrastructure Policies */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Documented Public Infrastructure & Policy Programs
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedLeader.majorInfrastructureAndPolicies.map((pol, idx) => (
                  <li key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2">
                    <span className="text-sky-400 font-mono">▪</span>
                    <span>{pol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Citations & Sources */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-lanka-gold" />
            <span>Primary Sources:</span>
            {selectedLeader.sourceIds.map(srcId => {
              const src = getSource(srcId);
              return (
                <span key={srcId} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                  {src ? src.title : srcId}
                </span>
              );
            })}
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Parliamentary Register of Sri Lanka
          </span>
        </div>
      </div>
    </div>
  );
};
