import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, Filter, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { Language, ArchiveImage } from '@/types';
import { HISTORICAL_ARCHIVE_IMAGES } from '@/data/archive/images';

interface ArchiveGalleryProps {
  lang: Language;
}

export const ArchiveGallery: React.FC<ArchiveGalleryProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<ArchiveImage | null>(null);

  const categories = ['All', 'Ancient Sri Lanka', 'Kingdoms', 'Colonial Sri Lanka', 'Independence', 'Transportation', 'Agriculture'];

  const filteredImages = HISTORICAL_ARCHIVE_IMAGES.filter(img => 
    selectedCategory === 'All' || img.category === selectedCategory
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Curated Historical Image Archive</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            VISUAL HERITAGE ARCHIVE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Verified public-domain and open-license photographic records documenting ancient monuments, colonial infrastructure, and national independence.
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-lanka-gold text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredImages.map(image => (
          <div
            key={image.id}
            onClick={() => setActiveImage(image)}
            className="group rounded-2xl bg-museum-900 border border-slate-800 overflow-hidden cursor-pointer hover:border-lanka-gold/60 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-museum-950/80 backdrop-blur-sm border border-slate-700 text-lanka-gold font-mono text-[10px]">
                  {image.date}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                  {image.category}
                </span>
                <h3 className="font-serif font-bold text-slate-100 text-sm leading-snug line-clamp-1 group-hover:text-lanka-goldLight transition-colors">
                  {image.title}
                </h3>
                <p className="text-slate-400 text-xs font-sans line-clamp-2 leading-relaxed">
                  {image.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="truncate max-w-[150px]">{image.credit}</span>
              <span className="text-lanka-gold">{image.license}</span>
            </div>
          </div>
        ))}
      </div>

      {/* High-res Image Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-museum-950/85 backdrop-blur-md">
          <div className="max-w-3xl w-full bg-museum-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="relative w-full max-h-[60vh] bg-slate-950 overflow-hidden flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-full max-h-[60vh] object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85';
                }}
              />
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-museum-950/80 text-slate-300 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                  <span className="text-lanka-gold">{activeImage.category}</span>
                  <span>•</span>
                  <span>{activeImage.date}</span>
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-lanka-gold mr-1" />
                  {activeImage.location}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-slate-100">
                {activeImage.title}
              </h3>

              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {activeImage.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Credit: {activeImage.credit} ({activeImage.license})</span>
                <a
                  href={activeImage.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-lanka-gold hover:text-lanka-goldLight font-medium"
                >
                  <span>Wikimedia Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
