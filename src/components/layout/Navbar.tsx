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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-museum-950/85 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-slate-900 to-museum-900 border border-lanka-gold/40 flex items-center justify-center shadow-lg group-hover:border-lanka-gold transition-colors">
              <span className="text-lanka-gold font-serif font-bold text-sm tracking-widest">SL</span>
            </div>
            <div>
              <span className="block font-serif font-semibold text-sm sm:text-base text-slate-100 tracking-wider group-hover:text-lanka-goldLight transition-colors">
                SRI LANKA
              </span>
              <span className="block text-[10px] text-slate-400 font-sans uppercase tracking-widest -mt-1 hidden sm:block">
                The Journey of a Nation
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'text-lanka-gold bg-lanka-gold/10 border border-lanka-gold/30 shadow-sm'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lanka-gold' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utilities & Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Live Forex & USDT Quick Ticker Pill */}
            <button
              onClick={() => handleNavClick('economy')}
              className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono transition-colors"
              title="Click to open Real-Time Forex & USDT Purchasing Power Terminal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>$1 = Rs. {forex ? forex.rate.toFixed(1) : '329.8'}</span>
              <span className="text-emerald-500/50">•</span>
              <span className="text-teal-300">₮1 = Rs. {forex ? (forex.rate * 1.015).toFixed(1) : '334.8'}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs transition-colors"
              title="Search Archive (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block ml-1 px-1 py-0.2 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-400">⌘K</kbd>
            </button>

            {/* Time Machine / Year Jump */}
            <button
              onClick={onOpenYearExplorer}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-lanka-gold text-xs transition-colors"
              title="Time Machine (Year Explorer)"
            >
              <Calendar className="w-3.5 h-3.5 text-lanka-gold" />
              <span className="hidden lg:inline">{t.yearExplorer}</span>
            </button>

            {/* Visual Story Mode Button */}
            <button
              onClick={onOpenStoryMode}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-lanka-maroon/20 hover:bg-lanka-maroon/30 border border-lanka-maroonLight/40 text-rose-200 text-xs transition-colors"
              title="Enter Cinematic Documentary Story Mode"
            >
              <Film className="w-3.5 h-3.5 text-lanka-maroonLight" />
              <span className="hidden sm:inline">{t.storyMode}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-900/80 border border-slate-800 rounded-md p-0.5 text-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1" />
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

            {/* Mobile Hamburger Button */}
            <div className="flex xl:hidden">
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
