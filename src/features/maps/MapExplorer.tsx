import React, { useState, useMemo } from 'react';
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
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plane,
  Train,
  Mountain,
  Droplets,
  Search
} from 'lucide-react';
import { Language, DistrictData, HistoricalMapEra } from '@/types';
import { SRI_LANKA_DISTRICTS } from '@/data/maps/districts';
import { HISTORICAL_MAP_ERAS } from '@/data/maps/historicalEras';
import { I18N_STRINGS } from '@/lib/i18n';
import { ThreeTerrainMap } from './ThreeTerrainMap';
import { 
  projectGeoToSvg, 
  buildCoastlineSvgPath, 
  SATELLITE_ISLANDS, 
  MAJOR_RIVERS, 
  HIGHLANDS_ELEVATION, 
  STRATEGIC_INFRASTRUCTURE, 
  RAILWAY_CORRIDORS, 
  PROVINCES_DATA 
} from '@/lib/geoCartography';

interface MapExplorerProps {
  lang: Language;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ lang }) => {
  const [mapMode, setMapMode] = useState<'modern' | 'historical' | '3d'>('modern');
  const [activeLayer, setActiveLayer] = useState<'districts' | 'density' | 'economy' | 'infrastructure' | 'terrain'>('districts');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(SRI_LANKA_DISTRICTS[0]); // Colombo default
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(HISTORICAL_MAP_ERAS.length - 1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const t = I18N_STRINGS[lang];

  const activeEra: HistoricalMapEra = HISTORICAL_MAP_ERAS[selectedEraIndex];

  // Precomputed authentic 68-point coastline path
  const coastlinePathD = useMemo(() => buildCoastlineSvgPath(), []);

  // Filtered districts for search
  const filteredDistricts = useMemo(() => {
    if (!searchFilter.trim()) return SRI_LANKA_DISTRICTS;
    const q = searchFilter.toLowerCase();
    return SRI_LANKA_DISTRICTS.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.nameSi.includes(q) || 
      d.province.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Color scale for population density layer
  const getDensityColor = (density: number) => {
    if (density > 2500) return '#e11d48'; // High density (Colombo: 3,383)
    if (density > 1000) return '#ea580c'; // Gampaha: 1,661
    if (density > 600) return '#f59e0b';  // Kalutara, Kandy, Galle
    if (density > 300) return '#0ea5e9';  // Kurunegala, Matara, Nuwara Eliya
    return '#10b981';                     // Dry zone (<300: Monaragala, Mullaitivu)
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.85));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Mode Switcher */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-lanka-gold" />
            <span>Geographic Information Systems (GIS) & Authentic Atlas</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 tracking-tight mt-1">
            SRI LANKA CARTOGRAPHIC EXPLORER
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            Explore authentic GPS-projected coastlines, 25 administrative districts, demographic density choropleths, river basins, infrastructure, and 500 years of historical kingdom borders.
          </p>
        </div>

        {/* Mode Toggle: Modern 2D vs Historical Time Map vs 3D */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs self-start md:self-auto">
          <button
            onClick={() => setMapMode('modern')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
              mapMode === 'modern'
                ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Modern 2D GIS Atlas</span>
          </button>
          <button
            onClick={() => setMapMode('historical')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
              mapMode === 'historical'
                ? 'bg-lanka-gold text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historical Kingdoms</span>
          </button>
          <button
            onClick={() => setMapMode('3d')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
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
          <div className="lg:col-span-7 rounded-2xl bg-museum-900/90 border border-slate-800 p-5 space-y-4 shadow-2xl relative">
            {/* Layer Bar (Modern Mode) */}
            {mapMode === 'modern' ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center">
                  <Layers className="w-3.5 h-3.5 text-lanka-gold mr-1.5" />
                  Map Intelligence Layer:
                </span>
                <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setActiveLayer('districts')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeLayer === 'districts' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Districts (25)
                  </button>
                  <button
                    onClick={() => setActiveLayer('density')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeLayer === 'density' ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Density
                  </button>
                  <button
                    onClick={() => setActiveLayer('terrain')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeLayer === 'terrain' ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-800/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Highlands & Rivers
                  </button>
                  <button
                    onClick={() => setActiveLayer('economy')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeLayer === 'economy' ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-800/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Economic Zones
                  </button>
                  <button
                    onClick={() => setActiveLayer('infrastructure')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      activeLayer === 'infrastructure' ? 'bg-sky-950/60 text-sky-300 font-semibold border border-sky-800/40' : 'text-slate-400 hover:text-slate-200'
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
                    <span>Historical Sovereign Epoch: <strong>{activeEra.label}</strong></span>
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
                      className={`hover:text-lanka-gold transition-colors ${selectedEraIndex === i ? 'text-lanka-gold font-bold underline' : ''}`}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick District Finder Search Pill */}
            {mapMode === 'modern' && (
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Quick jump to district (e.g. Kandy, Galle)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lanka-gold transition-colors"
                  />
                </div>

                {/* Map Zoom Controls */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={handleZoomIn}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                    title="Reset view"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SVG Map Rendering Frame (500x700 authentic coordinate space) */}
            <div className="relative w-full h-[580px] bg-gradient-to-b from-[#060a12] via-[#090e1a] to-[#04070e] rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 select-none shadow-inner">
              <svg 
                viewBox="0 0 500 700" 
                className="w-full h-full max-h-[560px] transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                <defs>
                  {/* Continental Shelf Bathymetric Gradient */}
                  <radialGradient id="shelfGlow" cx="50%" cy="52%" r="50%">
                    <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.18" />
                    <stop offset="60%" stopColor="#0f172a" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#030712" stopOpacity="0.0" />
                  </radialGradient>

                  {/* Island Landmass Shading Gradient */}
                  <linearGradient id="landmassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#131c2e" />
                    <stop offset="50%" stopColor="#0e1726" />
                    <stop offset="100%" stopColor="#0a101d" />
                  </linearGradient>

                  {/* Highland Topography Gradient */}
                  <radialGradient id="highlandGlow" cx="44%" cy="66%" r="22%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#065f46" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#065f46" stopOpacity="0.0" />
                  </radialGradient>

                  {/* Drop Shadow for Selected District */}
                  <filter id="districtGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Ocean Ambient Glow */}
                <rect width="500" height="700" fill="url(#shelfGlow)" />

                {/* Geographic Graticule lines (Latitude & Longitude) */}
                <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 4">
                  {/* Latitudes: 9°N, 8°N, 7°N, 6°N */}
                  <line x1="20" y1="180" x2="480" y2="180" />
                  <line x1="20" y1="330" x2="480" y2="330" />
                  <line x1="20" y1="480" x2="480" y2="480" />
                  <line x1="20" y1="630" x2="480" y2="630" />
                  {/* Longitudes: 80°E, 81°E */}
                  <line x1="126" y1="20" x2="126" y2="680" />
                  <line x1="296" y1="20" x2="296" y2="680" />
                </g>

                {/* Graticule Text Labels */}
                <g fill="#475569" fontSize="8" fontFamily="monospace">
                  <text x="24" y="176">9°N</text>
                  <text x="24" y="326">8°N</text>
                  <text x="24" y="476">7°N</text>
                  <text x="24" y="626">6°N</text>
                  <text x="130" y="688">80°E</text>
                  <text x="300" y="688">81°E</text>
                </g>

                {/* Authentic Sri Lanka Coastline Landmass (68 GPS Points) */}
                <path
                  d={coastlinePathD}
                  fill="url(#landmassGradient)"
                  stroke="#334155"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Satellite Islands & Peninsulas (Delft, Mannar, Karaitivu) */}
                {SATELLITE_ISLANDS.map((island) => {
                  const islandD = island.path.map(([lat, lng], idx) => {
                    const { x, y } = projectGeoToSvg(lat, lng);
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ') + ' Z';
                  return (
                    <path
                      key={island.name}
                      d={islandD}
                      fill="#131c2e"
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* LAYER: Topography & River Basins */}
                {(activeLayer === 'terrain' || activeLayer === 'economy') && (
                  <g>
                    {/* Highland Elevation Contours */}
                    {HIGHLANDS_ELEVATION.map((contour) => {
                      const contourD = contour.coordinates.map(([lat, lng], idx) => {
                        const { x, y } = projectGeoToSvg(lat, lng);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ') + ' Z';
                      return (
                        <path
                          key={contour.level}
                          d={contourD}
                          fill="#10b981"
                          fillOpacity={contour.level === 'high-peaks' ? 0.22 : 0.08}
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray={contour.level === 'high-peaks' ? 'none' : '2 2'}
                        />
                      );
                    })}

                    {/* Major Rivers */}
                    {MAJOR_RIVERS.map((river) => {
                      const riverD = river.coordinates.map(([lat, lng], idx) => {
                        const { x, y } = projectGeoToSvg(lat, lng);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                      return (
                        <path
                          key={river.name}
                          d={riverD}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          opacity="0.75"
                        />
                      );
                    })}
                  </g>
                )}

                {/* LAYER: 9 Provincial Boundaries & Regional Territories */}
                {mapMode === 'modern' && (
                  <g>
                    {PROVINCES_DATA.map((prov) => {
                      const provD = prov.polygon.map(([lat, lng], idx) => {
                        const { x, y } = projectGeoToSvg(lat, lng);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ') + ' Z';

                      const isProvActive = selectedDistrict.province.toLowerCase().includes(prov.id.split('-')[0]);

                      return (
                        <path
                          key={prov.id}
                          d={provD}
                          fill={prov.color}
                          fillOpacity={isProvActive ? 0.14 : 0.04}
                          stroke={prov.color}
                          strokeWidth={isProvActive ? '1.5' : '0.8'}
                          strokeDasharray="3 3"
                          opacity="0.8"
                        />
                      );
                    })}
                  </g>
                )}

                {/* LAYER: Infrastructure (Rail & Seaports) */}
                {activeLayer === 'infrastructure' && (
                  <g>
                    {/* Railway Arteries */}
                    {RAILWAY_CORRIDORS.map((rail) => {
                      const railD = rail.path.map(([lat, lng], idx) => {
                        const { x, y } = projectGeoToSvg(lat, lng);
                        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                      return (
                        <path
                          key={rail.name}
                          d={railD}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          opacity="0.9"
                        />
                      );
                    })}

                    {/* Infrastructure Nodes (Ports & Airports) */}
                    {STRATEGIC_INFRASTRUCTURE.map((node) => {
                      const pos = projectGeoToSvg(node.lat, node.lng);
                      const isPort = node.type === 'seaport';
                      return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="7" fill={isPort ? '#0284c7' : '#059669'} fillOpacity="0.3" />
                          <circle cx="0" cy="0" r="3.5" fill={isPort ? '#38bdf8' : '#34d399'} stroke="#ffffff" strokeWidth="0.8" />
                          <text 
                            x="8" 
                            y="3" 
                            fill={isPort ? '#7dd3fc' : '#6ee7b7'} 
                            fontSize="8" 
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {isPort ? '⚓' : '✈'} {node.name.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* LAYER: Historical Kingdoms (When in Historical Mode) */}
                {mapMode === 'historical' && (
                  <g>
                    {activeEra.territorialDivisions.map((terr) => {
                      return (
                        <g key={terr.name}>
                          {terr.keyCenters.map((center, cIdx) => {
                            const pos = projectGeoToSvg(center.lat, center.lng);
                            return (
                              <g key={cIdx}>
                                <circle 
                                  cx={pos.x} 
                                  cy={pos.y} 
                                  r="11" 
                                  fill={terr.color} 
                                  fillOpacity="0.25" 
                                />
                                <circle 
                                  cx={pos.x} 
                                  cy={pos.y} 
                                  r="5" 
                                  fill={terr.color} 
                                  stroke="#ffffff"
                                  strokeWidth="1"
                                />
                                <text 
                                  x={pos.x + 8} 
                                  y={pos.y + 3} 
                                  fill="#f1f5f9" 
                                  fontSize="9" 
                                  fontFamily="sans-serif"
                                  fontWeight="bold"
                                >
                                  {center.name}
                                </text>
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}

                    {/* Strategic Historical Ports */}
                    {activeEra.strategicPorts.map((port) => {
                      const pos = projectGeoToSvg(port.lat, port.lng);
                      return (
                        <g key={port.name}>
                          <circle cx={pos.x} cy={pos.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                          <text x={pos.x + 7} y={pos.y - 4} fill="#38bdf8" fontSize="8" fontStyle="italic" fontWeight="bold">
                            ⚓ {port.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Modern District Nodes (Accurately projected on coastline) */}
                {mapMode === 'modern' && (
                  <g>
                    {filteredDistricts.map((district) => {
                      const pos = projectGeoToSvg(district.coordinates.lat, district.coordinates.lng);
                      const isSelected = selectedDistrict.id === district.id;
                      const isHovered = hoveredDistrict?.id === district.id;

                      const fillColor = activeLayer === 'density' 
                        ? getDensityColor(district.densityPerKm2)
                        : isSelected 
                          ? '#f59e0b' 
                          : '#94a3b8';

                      return (
                        <g 
                          key={district.id}
                          className="cursor-pointer transition-transform duration-150"
                          onClick={() => setSelectedDistrict(district)}
                          onMouseEnter={() => setHoveredDistrict(district)}
                          onMouseLeave={() => setHoveredDistrict(null)}
                        >
                          {/* Outer pulse target */}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isSelected || isHovered ? 13 : 8}
                            fill={fillColor}
                            fillOpacity={isSelected || isHovered ? 0.4 : 0.15}
                            filter={isSelected ? 'url(#districtGlow)' : undefined}
                          />

                          {/* Central Node */}
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={isSelected ? 6 : 3.8}
                            fill={fillColor}
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 2 : 0.8}
                          />

                          {/* District Label */}
                          <text
                            x={pos.x + 8}
                            y={pos.y + 3.5}
                            fill={isSelected ? '#fef08a' : isHovered ? '#f1f5f9' : '#cbd5e1'}
                            fontSize={isSelected || isHovered ? '10' : '8.5'}
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
                <g transform="translate(420, 580)">
                  <circle cx="0" cy="0" r="18" fill="#0b0f17" stroke="#334155" strokeWidth="1" />
                  <path d="M 0 -13 L 3 -3 L 13 0 L 3 3 L 0 13 L -3 3 L -13 0 L -3 -3 Z" fill="#cfa935" />
                  <text x="-4" y="-15" fill="#94a3b8" fontSize="8" fontWeight="bold">N</text>
                </g>
              </svg>

              {/* Floating Hover HUD Card */}
              {hoveredDistrict && (
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/95 border border-lanka-gold/60 shadow-2xl pointer-events-none text-xs space-y-1 z-20 backdrop-blur-md">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-lanka-gold animate-pulse" />
                    <span className="font-serif font-bold text-slate-100 text-sm">{hoveredDistrict.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({hoveredDistrict.nameSi})</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Province: <strong className="text-lanka-gold">{hoveredDistrict.province}</strong>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    2024 Population: <strong>{hoveredDistrict.population2024.toLocaleString()}</strong> ({hoveredDistrict.densityPerKm2}/km²)
                  </div>
                </div>
              )}
            </div>

            {/* Density Scale Legend (When Density layer is selected) */}
            {activeLayer === 'density' && mapMode === 'modern' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-slate-400 text-[11px] uppercase">
                  Population Density Key (2024 DCS Census):
                </span>
                <div className="flex items-center space-x-4 text-[10px] font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span>&lt;300 /km²</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]" />
                    <span>300–600</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span>600–1,000</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                    <span>1,000–2,500</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                    <span>&gt;2,500 (Metro)</span>
                  </span>
                </div>
              </div>
            )}

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
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">2024 Population</span>
                    <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                      {selectedDistrict.population2024.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">DCS 2024 Census</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Population Density</span>
                    <span className="text-base font-serif font-bold text-lanka-gold block mt-0.5">
                      {selectedDistrict.densityPerKm2} / km²
                    </span>
                    <span className="text-[10px] text-slate-400 block">Island Avg: 331</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Land Area</span>
                    <span className="text-base font-serif font-bold text-slate-100 block mt-0.5">
                      {selectedDistrict.areaKm2.toLocaleString()} km²
                    </span>
                    <span className="text-[10px] text-slate-400 block">Survey Dept</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Urbanization</span>
                    <span className="text-base font-serif font-bold text-sky-400 block mt-0.5">
                      {selectedDistrict.urbanizationPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">Urban Agglomeration</span>
                  </div>
                </div>

                {/* Sector Employment Breakdown */}
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Labor Force Distribution (DCS Survey)
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Services & Finance:</span>
                      <span className="text-slate-200 font-bold">{selectedDistrict.employmentServicesPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${selectedDistrict.employmentServicesPct}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono pt-1">
                      <span className="text-slate-400">Industry & Manufacturing:</span>
                      <span className="text-slate-200 font-bold">{selectedDistrict.employmentIndustryPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedDistrict.employmentIndustryPct}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono pt-1">
                      <span className="text-slate-400">Agriculture & Plantations:</span>
                      <span className="text-slate-200 font-bold">{selectedDistrict.employmentAgriPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedDistrict.employmentAgriPct}%` }} />
                    </div>
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
