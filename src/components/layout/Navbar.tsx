import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  TrendingUp, 
  Users, 
  Landmark, 
  Map as MapIcon, 
  Clock, 
  Sparkles, 
  Database, 
  BookOpen, 
  Film, 
  Search, 
  Menu, 
  X, 
  Globe, 
  Calendar
} from 'lucide-react';
import { Language } from '@/types';
import { I18N_STRINGS } from '@/lib/i18n';
import { fetchLiveUSDToLKR, LiveForexData } from '@/lib/forexService';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  onOpenSearch: () => void;
  onOpenStoryMode: () => void;
  onOpenYearExplorer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  lang,
  onLangChange,
  onOpenSearch,
  onOpenStoryMode,
  onOpenYearExplorer
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forex, setForex] = useState<LiveForexData | null>(null);
  const t = I18N_STRINGS[lang];

  useEffect(() => {
    fetchLiveUSDToLKR().then(setForex);
  }, []);

  const navItems = [
    { id: 'home', label: t.navHome, icon: Compass },
    { id: 'timeline', label: t.navTimeline, icon: Clock },
    { id: 'economy', label: t.navEconomy, icon: TrendingUp },
    { id: 'people', label: t.navPeople, icon: Users },
    { id: 'leadership', label: t.navLeadership, icon: Landmark },
    { id: 'map', label: t.navMap, icon: MapIcon },
    { id: 'future', label: t.navFuture, icon: Sparkles },
    { id: 'data', label: t.navData, icon: Database },
    { id: 'sources', label: t.navSources, icon: BookOpen }
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-museum-950/90 border-b border-slate-800/80 transition-all duration-300">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand / Logo (Strictly unclipped, vertically centered, non-wrapping) */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0 select-none mr-1"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br from-slate-900 to-museum-900 border border-lanka-gold/40 flex items-center justify-center shadow-lg group-hover:border-lanka-gold transition-colors flex-shrink-0">
              <span className="text-lanka-gold font-serif font-bold text-sm tracking-widest">SL</span>
            </div>
            <div className="flex flex-col justify-center flex-shrink-0">
              <span className="font-serif font-semibold text-sm sm:text-base text-slate-100 tracking-wider group-hover:text-lanka-goldLight transition-colors whitespace-nowrap leading-tight">
                SRI LANKA
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-sans uppercase tracking-widest hidden sm:block whitespace-nowrap leading-none mt-0.5">
                The Journey of a Nation
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-0.5 2xl:space-x-1 flex-shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-2 2xl:px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'text-lanka-gold bg-lanka-gold/10 border border-lanka-gold/30 shadow-sm'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lanka-gold' : 'text-slate-400'} flex-shrink-0`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utilities & Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Live Forex & USDT Quick Ticker Pill (Never wraps, compact & single line) */}
            <button
              onClick={() => handleNavClick('economy')}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono transition-colors whitespace-nowrap flex-shrink-0"
              title="Click to open Real-Time Forex & USDT Purchasing Power Terminal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="whitespace-nowrap font-medium">$1 = Rs. {forex ? forex.rate.toFixed(0) : '330'}</span>
              <span className="text-emerald-500/50">•</span>
              <span className="text-teal-300 whitespace-nowrap font-medium">₮1 = Rs. {forex ? (forex.rate * 1.015).toFixed(0) : '335'}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs transition-colors whitespace-nowrap flex-shrink-0"
              title="Search Archive (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden 2xl:inline-block ml-1 px-1 py-0.2 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-400">⌘K</kbd>
            </button>

            {/* Time Machine / Year Jump */}
            <button
              onClick={onOpenYearExplorer}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-lanka-gold text-xs transition-colors whitespace-nowrap flex-shrink-0"
              title="Time Machine (Year Explorer)"
            >
              <Calendar className="w-3.5 h-3.5 text-lanka-gold flex-shrink-0" />
              <span className="hidden 2xl:inline">{t.yearExplorer}</span>
            </button>

            {/* Visual Story Mode Button */}
            <button
              onClick={onOpenStoryMode}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-lanka-maroon/20 hover:bg-lanka-maroon/30 border border-lanka-maroonLight/40 text-rose-200 text-xs transition-colors whitespace-nowrap flex-shrink-0"
              title="Enter Cinematic Documentary Story Mode"
            >
              <Film className="w-3.5 h-3.5 text-lanka-maroonLight flex-shrink-0" />
              <span className="hidden 2xl:inline">{t.storyMode}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-900/80 border border-slate-800 rounded-md p-0.5 text-xs whitespace-nowrap flex-shrink-0">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1 flex-shrink-0" />
              <button
                onClick={() => onLangChange('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  lang === 'en' ? 'bg-slate-700 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLangChange('si')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  lang === 'si' ? 'bg-slate-700 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                සිං
              </button>
              <button
                onClick={() => onLangChange('ta')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  lang === 'ta' ? 'bg-slate-700 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                த
              </button>
            </div>

            {/* Mobile / Tablet Hamburger Button */}
            <div className="flex xl:hidden flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-museum-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {/* Mobile Forex Pill */}
          <div 
            onClick={() => handleNavClick('economy')}
            className="flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE RATES</span>
            </div>
            <span>$1 = Rs. {forex ? forex.rate.toFixed(0) : '330'} • ₮1 = Rs. {forex ? (forex.rate * 1.015).toFixed(0) : '335'}</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-lanka-gold bg-lanka-gold/10 border border-lanka-gold/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-lanka-gold' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
