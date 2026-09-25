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

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [storyModeOpen, setStoryModeOpen] = useState<boolean>(false);

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
    <div className="min-h-screen bg-museum-950 text-slate-200 flex flex-col font-sans selection:bg-lanka-gold/30 selection:text-lanka-goldLight">
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
      <main className="flex-1 w-full">
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-lanka-gold/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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
                  className="p-6 rounded-2xl bg-museum-900 border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all space-y-3 group shadow-xl"
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

      {/* Footer */}
      <Footer lang={lang} onViewChange={handleViewChange} />
    </div>
  );
};
