import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';
import { Language, DataSource } from '@/types';
import { DATA_SOURCES } from '@/data/sources/sources';
import { I18N_STRINGS } from '@/lib/i18n';

interface SourcesPageProps {
  lang: Language;
}

export const SourcesPage: React.FC<SourcesPageProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = I18N_STRINGS[lang];

  const filteredSources = DATA_SOURCES.filter(src => {
    const q = searchQuery.toLowerCase();
    return (
      src.title.toLowerCase().includes(q) ||
      src.organization.toLowerCase().includes(q) ||
      src.indicator.toLowerCase().includes(q) ||
      src.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Empirical Traceability & Open Science</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            PRIMARY DATA SOURCES & REPOSITORIES
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Complete institutional catalog of official government statistical bodies, parliamentary gazettes, and multilateral repositories utilized across the platform.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">Verified Repositories</span>
          <span className="text-xs font-medium text-emerald-400">{DATA_SOURCES.length} Official Series</span>
        </div>
      </div>

      {/* Sourcing Principles Card */}
      <div className="p-5 rounded-2xl bg-museum-900 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-lanka-gold font-serif font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 text-lanka-gold" />
          <span>Hierarchy of Evidence & Verification Protocol</span>
        </div>
        <p className="text-slate-400 leading-relaxed font-sans">
          All macroeconomic, demographic, constitutional, and cartographic facts strictly adhere to primary official documentation. Preference is given to statutory Sri Lankan authorities (Central Bank of Sri Lanka, Department of Census and Statistics, Sri Lanka Parliament) followed by internationally standardized statistical datasets (World Bank, International Monetary Fund, United Nations). No secondary interpretations or political scorecards are incorporated.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by organization, indicator, or keywords..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lanka-gold transition-colors font-sans"
        />
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="p-6 rounded-2xl bg-museum-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-lanka-gold font-mono text-[10px] uppercase font-semibold">
                  {source.organization}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Updated: {source.publicationDate}
                </span>
              </div>

              <h3 className="font-serif font-bold text-slate-100 text-base leading-snug">
                {source.title}
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Indicators Covered:</span>
                  <span className="text-slate-200 font-medium block mt-0.5">{source.indicator}</span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Methodology:</span>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">{source.methodology}</p>
                </div>

                {source.notes && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Archival Notes:</span>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans italic">{source.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                {source.license}
              </span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-lanka-gold hover:text-lanka-goldLight font-medium transition-colors"
              >
                <span>Visit Repository</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
