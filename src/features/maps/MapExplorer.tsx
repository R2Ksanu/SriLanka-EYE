import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Clock, 
  MapPin, 
  Anchor, 
  Building2, 
  Trees, 
  Sparkles, 
  ShieldCheck, 
  Info,
  Compass
} from 'lucide-react';
import { Language, DistrictData, HistoricalMapEra } from '@/types';
import { SRI_LANKA_DISTRICTS } from '@/data/maps/districts';
import { HISTORICAL_MAP_ERAS } from '@/data/maps/historicalEras';
import { I18N_STRINGS } from '@/lib/i18n';
import { ThreeTerrainMap } from './ThreeTerrainMap';

interface MapExplorerProps {
  lang: Language;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ lang }) => {
  const [mapMode, setMapMode] = useState<'modern' | 'historical' | '3d'>('modern');
  const [activeLayer, setActiveLayer] = useState<'districts' | 'density' | 'economy' | 'infrastructure'>('districts');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(SRI_LANKA_DISTRICTS[0]); // Colombo
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(HISTORICAL_MAP_ERAS.length - 1);
  const t = I18N_STRINGS[lang];

  const activeEra: HistoricalMapEra = HISTORICAL_MAP_ERAS[selectedEraIndex];

  // Helper to calculate SVG coordinate projection from lat/lng for Sri Lanka
  // Sri Lanka bounds: Lat ~5.9°N to 9.8°N, Lng ~79.6°E to 81.9°E
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 5.8;
    const maxLat = 9.9;
    const minLng = 79.5;
    const maxLng = 82.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 20;
    return { x, y };
  };

  // Color gradient for population density layer
  const getDensityColor = (density: number) => {
    if (density > 2000) return '#e11d48'; // High density (Colombo, Gampaha)
    if (density > 700) return '#f97316';  // Kalutara, Kandy
    if (density > 400) return '#eab308';  // Galle, Matara, Nuwara Eliya
    if (density > 200) return '#0ea5e9';  // Kurunegala, Badulla
    return '#10b981';                     // Dry zone / Forested districts
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Mode Switcher */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Geographic Information Systems (GIS) & Historical Atlas</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            SRI LANKA CARTOGRAPHIC EXPLORER
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Explore Sri Lanka’s 25 administrative districts, demographic densities, ports, and historic kingdom territorial boundaries across five centuries.
          </p>
        </div>

        {/* Mode Toggle: Modern 2D vs Historical Time Map vs 3D */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs self-start md:self-auto">
          <button
            onClick={() => setMapMode('modern')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
              mapMode === 'modern'
                ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Modern Districts (2024)</span>
          </button>
          <button
            onClick={() => setMapMode('historical')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
              mapMode === 'historical'
                ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historical Time Map</span>
          </button>
          <button
            onClick={() => setMapMode('3d')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
              mapMode === '3d'
                ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Terrain Map</span>
          </button>
        </div>
      </div>

      {/* When 3D mode is active, render full 3D viewer */}
      {mapMode === '3d' ? (
        <ThreeTerrainMap />
      ) : (
      /* Main Map + Inspector Layout */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-museum-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          {/* Layer Bar (Modern Mode) */}
          {mapMode === 'modern' ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center">
                <Layers className="w-3.5 h-3.5 text-lanka-gold mr-1" />
                Active Map Layer:
              </span>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setActiveLayer('districts')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeLayer === 'districts' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Districts
                </button>
                <button
                  onClick={() => setActiveLayer('density')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeLayer === 'density' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Density
                </button>
                <button
                  onClick={() => setActiveLayer('economy')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeLayer === 'economy' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Economic Hubs
                </button>
                <button
                  onClick={() => setActiveLayer('infrastructure')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeLayer === 'infrastructure' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ports & Rail
                </button>
              </div>
            </div>
          ) : (
            /* Historical Era Slider */
            <div className="space-y-3 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-lanka-gold tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-lanka-gold" />
                  <span>Historical Period: <strong>{activeEra.label}</strong></span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeEra.periodName}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={HISTORICAL_MAP_ERAS.length - 1}
                step="1"
                value={selectedEraIndex}
                onChange={(e) => setSelectedEraIndex(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-lanka-gold"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                {HISTORICAL_MAP_ERAS.map((era, i) => (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEraIndex(i)}
                    className={`hover:text-lanka-gold ${selectedEraIndex === i ? 'text-lanka-gold font-bold' : ''}`}
                  >
                    {era.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SVG Map Rendering Frame */}
          <div className="relative w-full h-[520px] bg-slate-950/80 rounded-xl border border-slate-850 overflow-hidden flex items-center justify-center p-4">
            <svg 
              viewBox="0 0 400 560" 
              className="w-full h-full max-h-[500px]"
            >
              {/* Outer Ocean Background */}
              <rect width="400" height="560" fill="#090d16" />

              {/* Geographic Graticule lines */}
              <line x1="20" y1="140" x2="380" y2="140" stroke="#141c2c" strokeDasharray="3 3" />
              <line x1="20" y1="280" x2="380" y2="280" stroke="#141c2c" strokeDasharray="3 3" />
              <line x1="20" y1="420" x2="380" y2="420" stroke="#141c2c" strokeDasharray="3 3" />
              <line x1="140" y1="20" x2="140" y2="540" stroke="#141c2c" strokeDasharray="3 3" />
              <line x1="260" y1="20" x2="260" y2="540" stroke="#141c2c" strokeDasharray="3 3" />

              {/* Sri Lanka Stylized Landmass Silhouette Base */}
              <path
                d="M 195 40 
                   C 215 55, 235 90, 240 125
                   C 260 170, 275 220, 280 270
                   C 285 330, 260 380, 235 440
                   C 215 480, 185 510, 160 515
                   C 135 510, 105 480, 90 440
                   C 75 390, 65 320, 75 250
                   C 85 190, 115 130, 145 90
                   C 165 60, 180 45, 195 40 Z"
                fill="#101726"
                stroke="#1e293b"
                strokeWidth="2"
              />

              {/* Historical Territorial Zones when in Historical Mode */}
              {mapMode === 'historical' && (
                <g>
                  {activeEra.territorialDivisions.map((terr, idx) => {
                    return (
                      <g key={terr.name}>
                        {terr.keyCenters.map((center, cIdx) => {
                          const pos = projectCoords(center.lat, center.lng);
                          return (
                            <g key={cIdx}>
                              <circle 
                                cx={pos.x} 
                                cy={pos.y} 
                                r="9" 
                                fill={terr.color} 
                                fillOpacity="0.3" 
                              />
                              <circle 
                                cx={pos.x} 
                                cy={pos.y} 
                                r="4" 
                                fill={terr.color} 
                              />
                              <text 
                                x={pos.x + 8} 
                                y={pos.y + 4} 
                                fill="#e2e8f0" 
                                fontSize="9" 
                                fontFamily="sans-serif"
                                fontWeight="600"
                              >
                                {center.name}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* Strategic Ports */}
                  {activeEra.strategicPorts.map((port) => {
                    const pos = projectCoords(port.lat, port.lng);
                    return (
                      <g key={port.name}>
                        <circle cx={pos.x} cy={pos.y} r="5" fill="#38bdf8" />
                        <text x={pos.x + 7} y={pos.y - 4} fill="#38bdf8" fontSize="8" fontStyle="italic">
                          ⚓ {port.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Modern District Nodes when in Modern Mode */}
              {mapMode === 'modern' && (
                <g>
                  {SRI_LANKA_DISTRICTS.map((district) => {
                    const pos = projectCoords(district.coordinates.lat, district.coordinates.lng);
                    const isSelected = selectedDistrict.id === district.id;
                    const isHovered = hoveredDistrict?.id === district.id;

                    const fillColor = activeLayer === 'density' 
                      ? getDensityColor(district.densityPerKm2)
                      : isSelected 
                        ? '#cfa935' 
                        : '#334155';

                    return (
                      <g 
                        key={district.id}
                        className="cursor-pointer transition-transform duration-150"
                        onClick={() => setSelectedDistrict(district)}
                        onMouseEnter={() => setHoveredDistrict(district)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                      >
                        {/* Outer hit target circle */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected || isHovered ? 14 : 9}
                          fill={fillColor}
                          fillOpacity={isSelected || isHovered ? 0.35 : 0.15}
                        />

                        {/* Central Dot */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 6 : 4}
                          fill={fillColor}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 1.5 : 0.5}
                        />

                        {/* District Name Label */}
                        <text
                          x={pos.x + 7}
                          y={pos.y + 3}
                          fill={isSelected ? '#fef08a' : '#94a3b8'}
                          fontSize={isSelected || isHovered ? '10' : '8'}
                          fontFamily="sans-serif"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          {district.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Compass Rose */}
              <g transform="translate(350, 480)">
                <circle cx="0" cy="0" r="16" fill="#0b0f17" stroke="#334155" strokeWidth="1" />
                <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill="#cfa935" />
                <text x="-4" y="-14" fill="#94a3b8" fontSize="8" fontWeight="bold">N</text>
              </g>
            </svg>
          </div>

          {/* Historical Disclaimer Badge */}
          {mapMode === 'historical' && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-lanka-gold flex-shrink-0 mt-0.5" />
              <span>{activeEra.disclaimer}</span>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Inspector Card (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-museum-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
          {mapMode === 'modern' ? (
            /* Modern District Details Inspector */
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-lanka-gold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {selectedDistrict.province} Province
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Capital: {selectedDistrict.capital}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 mt-1">
                  {selectedDistrict.name} District
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {selectedDistrict.nameSi} • {selectedDistrict.nameTa}
                </p>
              </div>

              {/* 2024 Census Metric Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">2024 Population</span>
                  <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                    {selectedDistrict.population2024.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">DCS Final Census</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Population Density</span>
                  <span className="text-base font-serif font-bold text-lanka-gold block mt-0.5">
                    {selectedDistrict.densityPerKm2} / km²
                  </span>
                  <span className="text-[10px] text-slate-400 block">Island Avg: 331</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Total Area</span>
                  <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                    {selectedDistrict.areaKm2.toLocaleString()} km²
                  </span>
                  <span className="text-[10px] text-slate-400 block">Survey Dept</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block">Urbanization</span>
                  <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                    {selectedDistrict.urbanizationPct}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">Municipal Definition</span>
                </div>
              </div>

              {/* Primary Economic Sectors */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-lanka-gold" />
                  <span>Major Economic & Industrial Activities</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistrict.majorIndustries.map((ind, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Agriculture & Local Produce */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agricultural Output & Crops</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDistrict.agricultureProducts.map((prod, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 font-sans"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical & Cultural Heritage Landmarks */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prominent Cultural & Heritage Landmarks</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {selectedDistrict.historicalLandmarks.map((mark, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-lanka-gold font-mono">•</span>
                      <span>{mark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Historical Era Details Inspector */
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-lanka-gold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  Historical Map Epoch
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-100 mt-1">
                  {activeEra.label}: {activeEra.periodName}
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Geopolitical Configuration
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {activeEra.description}
                </p>
              </div>

              {/* Territorial Sovereignties */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-lanka-gold tracking-wider">
                  Territories & Sovereign Powers
                </h4>
                <div className="space-y-2.5">
                  {activeEra.territorialDivisions.map((terr, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: terr.color }} />
                          <span>{terr.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {terr.entityType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ruler: <strong className="text-slate-300">{terr.rulerOrPower}</strong> • Capital: {terr.capital}
                      </div>
                      <p className="text-[11px] text-slate-400 pt-0.5">
                        {terr.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
