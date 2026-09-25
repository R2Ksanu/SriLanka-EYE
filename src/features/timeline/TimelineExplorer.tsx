import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  BookOpen, 
  Filter, 
  X, 
  ChevronRight, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  UserCheck, 
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { TimelineEventItem, EventFilterCategory, TimelineCategory, Language } from '@/types';
import { TIMELINE_EVENTS } from '@/data/history/timeline';
import { NATIONAL_LEADERS } from '@/data/leadership/leaders';
import { DATA_SOURCES } from '@/data/sources/sources';

interface TimelineExplorerProps {
  lang: Language;
  onNavigateToLeader?: (leaderId: string) => void;
}

export const TimelineExplorer: React.FC<TimelineExplorerProps> = ({
  lang,
  onNavigateToLeader
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventFilterCategory>('All');
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<TimelineEventItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const categories: EventFilterCategory[] = [
    'All',
    'Politics',
    'Economy',
    'War / Conflict',
    'Technology',
    'Infrastructure',
    'Population',
    'Education',
    'Healthcare',
    'Environment',
    'Culture',
    'International Relations'
  ];

  const eras = [
    'All',
    'Ancient Era',
    'Medieval Kingdoms',
    'Colonial Period',
    'Independence',
    'Republic',
    'Executive Presidency',
    'Modern Era',
    'Current Era'
  ];

  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter(event => {
      const matchCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchEra = selectedEra === 'All' || event.era === selectedEra;
      return matchCategory && matchEra;
    });
  }, [selectedCategory, selectedEra]);

  const getLeaderName = (leaderId?: string) => {
    if (!leaderId) return null;
    const leader = NATIONAL_LEADERS.find(l => l.id === leaderId);
    return leader ? leader.name : null;
  };

  const getSourceInfo = (sourceId: string) => {
    return DATA_SOURCES.find(s => s.id === sourceId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Interactive National Chronology</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            TIMELINE OF THE NATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Chronological documentation of major constitutional, demographic, economic, and geopolitical milestones from ancient hydraulic civilizations through the 2024 general election.
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 mr-2 font-mono">Zoom View:</span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 w-12 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-3">
        {/* Era Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-mono flex items-center mr-1">
            <Layers className="w-3.5 h-3.5 mr-1" />
            Era:
          </span>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedEra === era
                  ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {era}
            </button>
          ))}
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-mono flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-slate-100 font-medium border border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontally Scrollable Timeline Track */}
      <div className="relative w-full overflow-x-auto pb-6 pt-4 border-y border-slate-800/80 bg-museum-950/60 rounded-xl p-4">
        <div 
          className="flex items-stretch space-x-6 min-w-max transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {filteredEvents.map((event, index) => {
            const isSelected = activeEvent?.id === event.id;
            return (
              <div
                key={event.id}
                onClick={() => setActiveEvent(event)}
                className={`relative w-72 sm:w-80 rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-850 border-2 border-lanka-gold shadow-lg shadow-lanka-gold/10'
                    : 'bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Year Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-museum-950 border border-slate-700 text-lanka-gold font-mono font-bold text-xs tracking-wider">
                    {event.displayDate}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {event.category}
                  </span>
                </div>

                {/* Event Image if available */}
                {event.imageUrl && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                )}

                {/* Title & Description preview */}
                <div className="space-y-2 flex-grow">
                  <h3 className="font-serif font-semibold text-slate-100 text-base leading-snug line-clamp-2">
                    {lang === 'si' ? event.titleSi : lang === 'ta' ? event.titleTa : event.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center truncate max-w-[170px]">
                    <MapPin className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                  <span className="text-lanka-gold flex items-center font-medium">
                    Details
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Slide-Over Modal / Inspector */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-museum-950/80 backdrop-blur-sm flex justify-end">
          <div className="relative w-full max-w-xl bg-museum-900 border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-lanka-gold font-mono font-bold text-sm">
                {activeEvent.displayDate}
              </span>
              <button
                onClick={() => setActiveEvent(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Era */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="text-lanka-gold">{activeEvent.era}</span>
                <span>•</span>
                <span>{activeEvent.category}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-100 leading-snug">
                {lang === 'si' ? activeEvent.titleSi : lang === 'ta' ? activeEvent.titleTa : activeEvent.title}
              </h2>
              {lang !== 'en' && (
                <p className="text-xs text-slate-400 font-sans italic">
                  EN: {activeEvent.title}
                </p>
              )}
            </div>

            {/* High-res Image Preview */}
            {activeEvent.imageUrl && (
              <div className="space-y-2">
                <div className="w-full rounded-xl overflow-hidden border border-slate-800 max-h-72 bg-slate-950">
                  <img 
                    src={activeEvent.imageUrl} 
                    alt={activeEvent.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85';
                    }}
                  />
                </div>
                {activeEvent.imageCaption && (
                  <p className="text-[11px] text-slate-400 italic">
                    {activeEvent.imageCaption} {activeEvent.imageCredit && `(${activeEvent.imageCredit})`}
                  </p>
                )}
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Historical Record</h4>
              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                {activeEvent.description}
              </p>
            </div>

            {/* National Significance */}
            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-lanka-gold">Significance & Impact</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activeEvent.significance}
              </p>
            </div>

            {/* Related Leader in Office */}
            {activeEvent.relatedLeaderId && (
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-4 h-4 text-lanka-gold" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Head of State in Office</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {getLeaderName(activeEvent.relatedLeaderId)}
                    </span>
                  </div>
                </div>
                {onNavigateToLeader && (
                  <button
                    onClick={() => {
                      onNavigateToLeader(activeEvent.relatedLeaderId!);
                      setActiveEvent(null);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-lanka-gold transition-colors"
                  >
                    View Biography
                  </button>
                )}
              </div>
            )}

            {/* Connected Macroeconomic & Demographic Indicators at that Time */}
            {activeEvent.relatedIndicators && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-lanka-gold" />
                  <span>Synchronised National Data at Time of Event</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeEvent.relatedIndicators.gdpUSD && (
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">National GDP</span>
                      <span className="text-slate-100 font-semibold">{activeEvent.relatedIndicators.gdpUSD}</span>
                    </div>
                  )}
                  {activeEvent.relatedIndicators.population && (
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Island Population</span>
                      <span className="text-slate-100 font-semibold">{activeEvent.relatedIndicators.population}</span>
                    </div>
                  )}
                  {activeEvent.relatedIndicators.inflation && (
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Headline Inflation (CCPI)</span>
                      <span className="text-slate-100 font-semibold">{activeEvent.relatedIndicators.inflation}</span>
                    </div>
                  )}
                  {activeEvent.relatedIndicators.exchangeRate && (
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Exchange Rate</span>
                      <span className="text-slate-100 font-semibold">{activeEvent.relatedIndicators.exchangeRate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verified Sources */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <h4 className="font-mono text-slate-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Verified Historical Citations</span>
              </h4>
              <ul className="space-y-1.5">
                {activeEvent.sources.map(srcId => {
                  const source = getSourceInfo(srcId);
                  return (
                    <li key={srcId} className="p-2 rounded bg-slate-950 border border-slate-800/80 text-[11px]">
                      <span className="text-slate-200 font-medium block">
                        {source ? source.title : srcId}
                      </span>
                      {source && (
                        <span className="text-slate-400 block mt-0.5">
                          {source.organization} • {source.datasetDate}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
