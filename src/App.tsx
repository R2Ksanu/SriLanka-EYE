import React, { useState, useEffect } from 'react';
import { Language } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThreeIslandHero } from '@/features/hero/ThreeIslandHero';
import { TimelineExplorer } from '@/features/timeline/TimelineExplorer';
import { EconomicDashboard } from '@/features/economy/EconomicDashboard';
import { PeopleExplorer } from '@/features/population/PeopleExplorer';
import { LeadershipExplorer } from '@/features/leadership/LeadershipExplorer';
import { MapExplorer } from '@/features/maps/MapExplorer';
import { FutureSection } from '@/features/future/FutureSection';
import { DataAuditView } from '@/features/data/DataAuditView';
import { SourcesPage } from '@/features/sources/SourcesPage';
import { YearExplorer } from '@/features/year/YearExplorer';
import { ArchiveGallery } from '@/features/archive/ArchiveGallery';
import { GlobalSearchModal } from '@/features/search/GlobalSearchModal';
import { VisualStoryMode } from '@/features/story/VisualStoryMode';
import { Image as ImageIcon, Sparkles, Check } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [storyModeOpen, setStoryModeOpen] = useState<boolean>(false);
  const [scenicBg, setScenicBg] = useState<'sigiriya' | 'tea' | 'ella' | 'minimal'>('sigiriya');
  const [showBgMenu, setShowBgMenu] = useState<boolean>(false);

  const baseUrl = (import.meta as any).env?.BASE_URL || './';
  const BG_IMAGES: Record<string, string> = {
    sigiriya: `${baseUrl}images/background/sigiriya-dawn.jpg`,
    tea: `${baseUrl}images/background/tea-hills-mist.jpg`,
    ella: `${baseUrl}images/background/ella-bridge-valley.jpg`,
  };

  // Sync with URL Hash for seamless GitHub Pages navigation and sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setCurrentView(hash);
      }
    };

    // Check initial hash on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    window.location.hash = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-museum-950 text-slate-200 flex flex-col font-sans selection:bg-lanka-gold/30 selection:text-lanka-goldLight relative">
      {/* Serene Sri Lanka Scenic Background Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {scenicBg !== 'minimal' && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-[1.02]"
            style={{ 
              backgroundImage: `url(${BG_IMAGES[scenicBg]})`,
              opacity: 0.16,
              filter: 'saturate(0.92) brightness(0.9)'
            }}
          />
        )}
        {/* Museum Dark Grading Scrims for 100% typography contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-museum-950/92 via-museum-950/80 to-museum-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-museum-950/60" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        lang={lang}
        onLangChange={setLang}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenStoryMode={() => setStoryModeOpen(true)}
        onOpenYearExplorer={() => handleViewChange('year-explorer')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {currentView === 'home' && (
          <div className="space-y-12">
            {/* 3D WebGL Island Hero */}
            <ThreeIslandHero
              lang={lang}
              onExplore={() => handleViewChange('timeline')}
              onQuickNavigate={handleViewChange}
            />

            {/* Quick Exhibit Cards on Homepage */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold">
                  Explore The National Exhibits
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
                  HOW SRI LANKA CHANGED
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  Choose a domain to investigate verifiable historical facts, macroeconomic long-series, and demographic transitions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Timeline */}
                <div 
                  onClick={() => handleViewChange('timeline')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-lanka-gold">Chronology</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                    National Timeline (c. 250 BCE – Present)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Ancient hydraulic kingdoms, Portuguese, Dutch, British colonial eras, Independence (1948), Republic (1972), and post-crisis recovery.
                  </p>
                  <div className="text-xs text-lanka-gold font-medium pt-2 flex items-center">
                    Enter Timeline →
                  </div>
                </div>

                {/* Card 2: Economy */}
                <div 
                  onClick={() => handleViewChange('economy')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-sky-400/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-sky-400">Intelligence</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    Economic Evolution Dashboard
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    20+ indicator charts including GDP (USD & LKR), Real Growth, Inflation, Exchange Rate, Trade Balance, Debt, and FX Reserves.
                  </p>
                  <div className="text-xs text-sky-400 font-medium pt-2 flex items-center">
                    Analyze Economy →
                  </div>
                </div>

                {/* Card 3: People */}
                <div 
                  onClick={() => handleViewChange('people')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-emerald-400/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-emerald-400">Demographics</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    People & 2024 Census Insights
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    153 years of national census counts (1871–2024), 21.72M citizen distribution, age pyramid, and life expectancy doubling.
                  </p>
                  <div className="text-xs text-emerald-400 font-medium pt-2 flex items-center">
                    Explore Demographics →
                  </div>
                </div>

                {/* Card 4: Leadership */}
                <div 
                  onClick={() => handleViewChange('leadership')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-amber-400/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-amber-400">Governance</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    Heads of State & Era Comparison
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Constitutional leadership chronology with side-by-side comparative tool and zero political scorecards.
                  </p>
                  <div className="text-xs text-amber-400 font-medium pt-2 flex items-center">
                    View Governance →
                  </div>
                </div>

                {/* Card 5: Map & Time Map */}
                <div 
                  onClick={() => handleViewChange('map')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-purple-400/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-purple-400">Cartography</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                    Interactive 2D Atlas & Time Map
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Explore 25 districts, density choropleth, ports, and historical kingdom boundary reconstructions (1500–2024).
                  </p>
                  <div className="text-xs text-purple-400 font-medium pt-2 flex items-center">
                    Launch Atlas →
                  </div>
                </div>

                {/* Card 6: Future Horizon & Wealth Simulator */}
                <div 
                  onClick={() => handleViewChange('future')}
                  className="p-6 rounded-2xl bg-museum-900/85 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/60 cursor-pointer transition-all space-y-3 group shadow-xl"
                >
                  <span className="text-xs font-mono uppercase text-emerald-400">Horizon 2026–2050</span>
                  <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Future Wealth & National Scenarios
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Rupee vs USDT purchasing power growth engine (2026–2036), UN demographic trajectories, and educational simulation models.
                  </p>
                  <div className="text-xs text-emerald-400 font-medium pt-2 flex items-center">
                    Simulate Wealth & Horizon →
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'timeline' && <TimelineExplorer lang={lang} onNavigateToLeader={(leaderId) => handleViewChange('leadership')} />}
        {currentView === 'economy' && <EconomicDashboard lang={lang} onNavigate={handleViewChange} />}
        {currentView === 'people' && <PeopleExplorer lang={lang} />}
        {currentView === 'leadership' && <LeadershipExplorer lang={lang} />}
        {currentView === 'map' && <MapExplorer lang={lang} />}
        {currentView === 'history' && <ArchiveGallery lang={lang} />}
        {currentView === 'future' && <FutureSection lang={lang} />}
        {currentView === 'data' && <DataAuditView lang={lang} />}
        {currentView === 'sources' && <SourcesPage lang={lang} />}
        {currentView === 'year-explorer' && <YearExplorer lang={lang} />}
      </main>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleViewChange}
      />

      <VisualStoryMode
        isOpen={storyModeOpen}
        onClose={() => setStoryModeOpen(false)}
        lang={lang}
      />

      {/* Floating Atmosphere & Scenic Backdrop Switcher */}
      <div className="fixed bottom-5 right-5 z-40">
        <div className="relative">
          {showBgMenu && (
            <div className="absolute bottom-12 right-0 mb-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-2.5 shadow-2xl space-y-1 text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-lanka-gold border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>Scenic Ambience</span>
                <Sparkles className="w-3 h-3 text-lanka-gold" />
              </div>
              {[
                { id: 'sigiriya', label: 'Sigiriya Dawn', emoji: '🌅', desc: 'Misty Lion Rock sunrise' },
                { id: 'tea', label: 'Highland Mist', emoji: '🍃', desc: 'Rolling emerald tea hills' },
                { id: 'ella', label: 'Ella Valley', emoji: '🌉', desc: 'Lush tropical mountain range' },
                { id: 'minimal', label: 'Minimal Dark', emoji: '🌑', desc: 'Deep museum obsidian' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setScenicBg(theme.id as any);
                    setShowBgMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    scenicBg === theme.id
                      ? 'bg-lanka-gold/20 text-lanka-gold border border-lanka-gold/40'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{theme.emoji}</span>
                    <div>
                      <div className="font-medium text-slate-100">{theme.label}</div>
                      <div className="text-[10px] text-slate-400">{theme.desc}</div>
                    </div>
                  </div>
                  {scenicBg === theme.id && <Check className="w-3.5 h-3.5 text-lanka-gold flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowBgMenu(!showBgMenu)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-md transition-all hover:border-lanka-gold/60 hover:text-lanka-gold"
            title="Change Scenic Backdrop Ambience"
          >
            <ImageIcon className="w-3.5 h-3.5 text-lanka-gold" />
            <span className="hidden sm:inline">Ambience</span>
            <span className="text-xs">
              {scenicBg === 'sigiriya' ? '🌅' : scenicBg === 'tea' ? '🍃' : scenicBg === 'ella' ? '🌉' : '🌑'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer lang={lang} onViewChange={handleViewChange} />
    </div>
  );
};
