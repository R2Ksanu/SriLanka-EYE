import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Language } from '@/types';
import { TIMELINE_EVENTS } from '@/data/history/timeline';

interface VisualStoryModeProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VisualStoryMode: React.FC<VisualStoryModeProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Story Chapters based on pivotal historical milestones
  const storyEvents = TIMELINE_EVENTS.filter(e => 
    [
      'intro-buddhism',
      'sigiriya-fortress',
      'parakrama-samudraya',
      'portuguese-arrival',
      'dutch-expel-portuguese',
      'kandyan-convention',
      'independence-1948',
      'republic-constitution-1972',
      'open-economy-1977',
      'tsunami-2004',
      'end-of-war-2009',
      'economic-crisis-2022',
      'presidential-election-2024'
    ].includes(e.id)
  );

  const activeStory = storyEvents[currentSlideIndex] || storyEvents[0];

  // Auto-play slideshow timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % storyEvents.length);
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSlideIndex, isOpen, storyEvents.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-museum-950 flex flex-col justify-between overflow-hidden">
      {/* Background Cinematic Atmosphere Image */}
      <div className="absolute inset-0 z-0">
        {activeStory.imageUrl ? (
          <img
            src={activeStory.imageUrl}
            alt={activeStory.title}
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105 transition-all duration-1000"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-museum-900 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-museum-950 via-museum-950/70 to-museum-950/40" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-lanka-gold animate-pulse" />
          <span className="font-serif tracking-widest text-xs uppercase text-slate-300">
            SRI LANKA: A DOCUMENTARY ODYSSEY
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs font-mono text-slate-400">
            Chapter {currentSlideIndex + 1} of {storyEvents.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Play/Pause Autoplay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
            title={isPlaying ? 'Pause documentary' : 'Play automatic slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-lanka-gold" /> : <Play className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Close Story Mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Story Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center space-y-6 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-lanka-gold/30 text-lanka-gold font-mono text-xs self-center sm:self-start">
          <Calendar className="w-3.5 h-3.5" />
          <span>{activeStory.displayDate}</span>
          <span>•</span>
          <span className="uppercase">{activeStory.era}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-100 tracking-tight leading-tight">
          {lang === 'si' ? activeStory.titleSi : lang === 'ta' ? activeStory.titleTa : activeStory.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
          {activeStory.description}
        </p>

        {/* Synchronized Metrics Box if available */}
        {activeStory.relatedIndicators && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl">
            {activeStory.relatedIndicators.gdpUSD && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">National GDP</span>
                <span className="text-base font-serif font-bold text-lanka-gold">
                  {activeStory.relatedIndicators.gdpUSD}
                </span>
              </div>
            )}
            {activeStory.relatedIndicators.population && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Population</span>
                <span className="text-base font-serif font-bold text-slate-100">
                  {activeStory.relatedIndicators.population}
                </span>
              </div>
            )}
            {activeStory.relatedIndicators.inflation && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Inflation</span>
                <span className="text-base font-serif font-bold text-rose-400">
                  {activeStory.relatedIndicators.inflation}
                </span>
              </div>
            )}
            {activeStory.relatedIndicators.exchangeRate && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Exchange Rate</span>
                <span className="text-base font-serif font-bold text-purple-300">
                  {activeStory.relatedIndicators.exchangeRate}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400 font-sans">
          <MapPin className="w-3.5 h-3.5 text-lanka-gold" />
          <span>Location: {activeStory.location}</span>
          <span>•</span>
          <span>{activeStory.significance}</span>
        </div>
      </div>

      {/* Bottom Navigation & Progress Bar */}
      <div className="relative z-10 p-6 border-t border-slate-800/60 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Progress track */}
        <div className="flex items-center space-x-1 flex-1 max-w-md">
          {storyEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                currentSlideIndex === i 
                  ? 'bg-lanka-gold w-8' 
                  : i < currentSlideIndex 
                    ? 'bg-slate-600' 
                    : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Era</span>
          </button>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(storyEvents.length - 1, prev + 1))}
            disabled={currentSlideIndex === storyEvents.length - 1}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-lanka-gold hover:bg-lanka-goldLight text-slate-950 font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors text-xs"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
