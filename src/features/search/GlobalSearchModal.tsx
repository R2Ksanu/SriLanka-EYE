import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Landmark, 
  MapPin, 
  BookOpen, 
  ArrowRight,
  Calendar
} from 'lucide-react';
import { TIMELINE_EVENTS } from '@/data/history/timeline';
import { NATIONAL_LEADERS } from '@/data/leadership/leaders';
import { SRI_LANKA_DISTRICTS } from '@/data/maps/districts';
import { DATA_SOURCES } from '@/data/sources/sources';
import { ECONOMIC_INDICATORS } from '@/data/economy/indicators';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // Search Timeline Events
    const events = TIMELINE_EVENTS.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.titleSi.includes(q) ||
      e.titleTa.includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.year.toString().includes(q)
    ).slice(0, 5);

    // Search Leaders
    const leaders = NATIONAL_LEADERS.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.nameSi.includes(q) ||
      l.nameTa.includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.yearsActive.includes(q)
    ).slice(0, 3);

    // Search Districts
    const districts = SRI_LANKA_DISTRICTS.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.nameSi.includes(q) ||
      d.nameTa.includes(q) ||
      d.province.toLowerCase().includes(q) ||
      d.majorIndustries.some(ind => ind.toLowerCase().includes(q))
    ).slice(0, 4);

    // Search Sources
    const sources = DATA_SOURCES.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.organization.toLowerCase().includes(q) ||
      s.indicator.toLowerCase().includes(q)
    ).slice(0, 3);

    // Search Year Match in Economy
    const yearMatch = ECONOMIC_INDICATORS.find(ec => ec.year.toString() === q);

    return {
      events,
      leaders,
      districts,
      sources,
      yearMatch
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-museum-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-museum-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-800 p-4 flex items-center">
          <Search className="w-5 h-5 text-lanka-gold mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, presidents, indicators, districts, years (e.g. 2009, Kandy, GDP)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          {!searchResults ? (
            <div className="py-12 text-center space-y-2 text-slate-500">
              <p>Type to search across Sri Lanka's entire history and database</p>
              <div className="flex justify-center gap-2 text-[11px] font-mono text-slate-400">
                <span>Try: "1977"</span>
                <span>•</span>
                <span>"Kandy"</span>
                <span>•</span>
                <span>"Census"</span>
                <span>•</span>
                <span>"Exports"</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Year Direct Match Card */}
              {searchResults.yearMatch && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-lanka-gold tracking-wider">Year Index</span>
                  <div 
                    onClick={() => {
                      onNavigate('year-explorer');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-lanka-gold cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-lanka-gold" />
                      <div>
                        <span className="text-sm font-serif font-bold text-slate-100 block">
                          Year {searchResults.yearMatch.year} Data Snapshot
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          GDP: ${searchResults.yearMatch.gdpNominalUSD}B • Per Capita: ${searchResults.yearMatch.gdpPerCapitaUSD} • Inflation: {searchResults.yearMatch.inflationCCPI}%
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              )}

              {/* Timeline Events Match */}
              {searchResults.events.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Historical Timeline Events ({searchResults.events.length})
                  </span>
                  <div className="space-y-1.5">
                    {searchResults.events.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onNavigate('timeline');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800/80 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-lanka-gold font-mono text-[11px] font-bold">{evt.displayDate}</span>
                            <span className="text-slate-200 font-medium">{evt.title}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] line-clamp-1">{evt.description}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leaders Match */}
              {searchResults.leaders.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    National Leadership ({searchResults.leaders.length})
                  </span>
                  <div className="space-y-1.5">
                    {searchResults.leaders.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          onNavigate('leadership');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800/80 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
                            <img src={lead.portraitUrl} alt={lead.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-slate-200 font-medium block">{lead.name}</span>
                            <span className="text-slate-400 text-[10px] font-mono">{lead.yearsActive} • {lead.office}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Districts Match */}
              {searchResults.districts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Districts & Geography ({searchResults.districts.length})
                  </span>
                  <div className="space-y-1.5">
                    {searchResults.districts.map(dist => (
                      <div
                        key={dist.id}
                        onClick={() => {
                          onNavigate('map');
                          onClose();
                        }}
                        className="p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-850 border border-slate-800/80 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-lanka-gold" />
                          <div>
                            <span className="text-slate-200 font-medium">{dist.name} ({dist.nameSi})</span>
                            <span className="text-slate-400 text-[10px] block">
                              {dist.province} Province • Pop: {dist.population2024.toLocaleString()} • {dist.densityPerKm2}/km²
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No matches */}
              {searchResults.events.length === 0 &&
               searchResults.leaders.length === 0 &&
               searchResults.districts.length === 0 &&
               !searchResults.yearMatch && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No matching historical records or indicators found for "{query}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
