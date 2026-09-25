import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink, GitBranch, Heart } from 'lucide-react';
import { Language } from '@/types';
import { I18N_STRINGS } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
  onViewChange: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onViewChange }) => {
  const t = I18N_STRINGS[lang];

  return (
    <footer className="w-full bg-museum-950 border-t border-slate-800/80 text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Identity & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-lanka-gold/20 border border-lanka-gold/40 flex items-center justify-center">
                <span className="text-lanka-gold font-serif font-bold text-xs">SL</span>
              </div>
              <h3 className="font-serif font-semibold text-slate-200 text-sm tracking-wider">
                {t.siteTitle}
              </h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              {t.sourceDisclaimer}
            </p>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-normal flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{t.nonCausationNote}</span>
            </div>
          </div>

          {/* Column 2: Navigation Hubs */}
          <div className="space-y-2">
            <h4 className="font-medium text-slate-200 text-xs uppercase tracking-wider">Exhibits & Data</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onViewChange('timeline')} className="hover:text-lanka-gold transition-colors">
                  National Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('economy')} className="hover:text-lanka-gold transition-colors">
                  Economic Evolution Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('people')} className="hover:text-lanka-gold transition-colors">
                  People of Sri Lanka & 2024 Census
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('leadership')} className="hover:text-lanka-gold transition-colors">
                  Leadership & Era Comparison
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('map')} className="hover:text-lanka-gold transition-colors">
                  Interactive 2D/3D Atlas & Historical Map
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('future')} className="hover:text-lanka-gold transition-colors">
                  Future Scenarios (2026–2050)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Transparency & Policies */}
          <div className="space-y-2">
            <h4 className="font-medium text-slate-200 text-xs uppercase tracking-wider">Documentation</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onViewChange('data')} className="hover:text-lanka-gold transition-colors flex items-center space-x-1">
                  <span>Data Integrity Audit</span>
                </button>
              </li>
              <li>
                <button onClick={() => onViewChange('sources')} className="hover:text-lanka-gold transition-colors flex items-center space-x-1">
                  <span>Primary Research Sources</span>
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/RuTwoK/SriLanka-EYE/blob/main/DATA_POLICY.md" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-slate-200 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Data Policy</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/RuTwoK/SriLanka-EYE/blob/main/SERVICE_POLICY.md" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-slate-200 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Terms & Service Policy</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/RuTwoK/SriLanka-EYE/blob/main/CONTRIBUTING.md" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-slate-200 transition-colors inline-flex items-center space-x-1"
                >
                  <span>Contributing Guidelines</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <span>© 2026 RuTwoK Labs. Open-access educational repository.</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              GitHub Pages Live Build
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/RuTwoK/SriLanka-EYE" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-lanka-gold" />
              <span>GitHub Repository</span>
            </a>
            <span>•</span>
            <span className="text-slate-400 flex items-center">
              Crafted for Sri Lanka <Heart className="w-3 h-3 text-rose-500 mx-1 fill-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
