import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Compass, Shield, Database, Sparkles, TrendingUp, Users, MapPin } from 'lucide-react';
import { Language } from '@/types';
import { I18N_STRINGS } from '@/lib/i18n';
import { ECONOMIC_INDICATORS } from '@/data/economy/indicators';
import { HISTORICAL_DEMOGRAPHICS } from '@/data/population/demographics';
import { formatCurrency, formatPerCapita, formatPopulation } from '@/lib/utils';
import { createSriLankaIslandShape } from '@/lib/sriLankaCoastline';
import { fetchLiveUSDToLKR, LiveForexData } from '@/lib/forexService';

interface ThreeIslandHeroProps {
  lang: Language;
  onExplore: () => void;
  onQuickNavigate: (viewId: string) => void;
}

export const ThreeIslandHero: React.FC<ThreeIslandHeroProps> = ({
  lang,
  onExplore,
  onQuickNavigate
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [forex, setForex] = useState<LiveForexData | null>(null);
  const [isRefreshingForex, setIsRefreshingForex] = useState(false);
  const t = I18N_STRINGS[lang];

  // Latest verified stats from data layer (2026 latest)
  const latestEcon = ECONOMIC_INDICATORS[ECONOMIC_INDICATORS.length - 1];
  const latestDemo = HISTORICAL_DEMOGRAPHICS[HISTORICAL_DEMOGRAPHICS.length - 1];

  const loadForex = async () => {
    setIsRefreshingForex(true);
    try {
      const data = await fetchLiveUSDToLKR();
      setForex(data);
    } finally {
      setIsRefreshingForex(false);
    }
  };

  useEffect(() => {
    loadForex();
    const timer = setInterval(loadForex, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 7, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Group for Island
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Authentic Sri Lanka Island Topography generated from 68 coastal boundary points
    const islandShape = createSriLankaIslandShape();

    // Create 3D Extruded Topographic Geometry
    const extrudeSettings = {
      steps: 6,
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.10,
      bevelSegments: 4
    };

    const islandGeometry = new THREE.ExtrudeGeometry(islandShape, extrudeSettings);
    // Rotate to lie horizontally on X-Z plane
    islandGeometry.rotateX(-Math.PI / 2);
    islandGeometry.center();

    // Deform vertices to authentically elevate the Central Highlands
    // (Pidurutalagala massif at south-central, Knuckles range north-east)
    const positionAttribute = islandGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      if (y > 0) {
        // Main Highlands Massif (Pidurutalagala 2524m, Nuwara Eliya, Adam's Peak)
        const distHighlands = Math.sqrt(Math.pow((x + 0.12) * 1.15, 2) + Math.pow(z - 1.55, 2));
        // Knuckles Conservation Forest
        const distKnuckles = Math.sqrt(Math.pow((x - 0.22) * 1.25, 2) + Math.pow(z - 0.9, 2));

        let elevationBonus = 0;
        if (distHighlands < 1.75) {
          elevationBonus += Math.pow((1.75 - distHighlands) / 1.75, 1.8) * 1.45;
        }
        if (distKnuckles < 0.95) {
          elevationBonus += Math.pow((0.95 - distKnuckles) / 0.95, 1.6) * 0.75;
        }

        positionAttribute.setY(i, y + elevationBonus);
      }
    }
    islandGeometry.computeVertexNormals();

    // Material for Island: Deep slate titanium terrain with emerald tint
    const islandMaterial = new THREE.MeshStandardMaterial({
      color: 0x152030,
      roughness: 0.62,
      metalness: 0.28,
      flatShading: true,
    });

    const islandMesh = new THREE.Mesh(islandGeometry, islandMaterial);
    islandGroup.add(islandMesh);

    // Highland Topographic Contour Wireframe
    const highlandWireframe = new THREE.WireframeGeometry(islandGeometry);
    const wireframeLine = new THREE.LineSegments(
      highlandWireframe,
      new THREE.LineBasicMaterial({ color: 0xcfa935, transparent: true, opacity: 0.22 })
    );
    islandGroup.add(wireframeLine);

    // Surrounding Ocean Ring (Subtle concentric disk)
    const oceanGeo = new THREE.RingGeometry(5.2, 9.2, 64);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshBasicMaterial({
      color: 0x070b14,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.position.y = -0.2;
    scene.add(oceanMesh);

    // Authentic City & Landmark Hotspot Nodes (mapped to true geographic 3D space)
    const hotspots = [
      { id: 'colombo', name: 'Colombo (Commercial Capital & Port)', x: -1.95, z: 1.85, y: 0.45 },
      { id: 'kandy', name: 'Kandy (Central Highlands & Temple of Tooth)', x: -0.30, z: 1.15, y: 1.25 },
      { id: 'galle', name: 'Galle (Dutch Fort & Southern Port)', x: -1.25, z: 3.75, y: 0.42 },
      { id: 'dondra', name: 'Dondra Head (Southernmost Tip)', x: -0.42, z: 4.10, y: 0.40 },
      { id: 'jaffna', name: 'Jaffna (Northern Peninsula & Fort)', x: -1.65, z: -3.75, y: 0.38 },
      { id: 'trincomalee', name: 'Trincomalee (Natural Deepwater Harbor)', x: 0.98, z: -1.45, y: 0.42 },
      { id: 'anuradhapura', name: 'Anuradhapura (Ancient Sacred Capital)', x: -0.82, z: -1.05, y: 0.55 },
      { id: 'hambantota', name: 'Hambantota (Southern International Port)', x: 0.75, z: 3.65, y: 0.40 },
    ];

    const hotspotMeshes: THREE.Mesh[] = [];
    hotspots.forEach(pt => {
      const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xcfa935 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(pt.x, pt.y, pt.z);
      islandGroup.add(pin);
      hotspotMeshes.push(pin);

      // Light ring around pin
      const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe6c764,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(pt.x, pt.y - 0.02, pt.z);
      islandGroup.add(ring);
    });

    // Atmospheric Particle Dust Stars
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = Math.random() * 10 - 2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x819ec4,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    sunLight.position.set(8, 12, 6);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    // Interactive Drag / Orbit Mechanics
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = -0.3;
    let targetRotationX = 0.25;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;
      targetRotationY += deltaX * 0.005;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      previousMouseX = e.touches[0].clientX;
      targetRotationY += deltaX * 0.006;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Window Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow subtle auto-rotation when not user-dragging
      if (!isDragging) {
        targetRotationY += 0.0012;
      }

      // Smooth damping interpolation
      islandGroup.rotation.y += (targetRotationY - islandGroup.rotation.y) * 0.05;
      islandGroup.rotation.x += (targetRotationX - islandGroup.rotation.x) * 0.05;

      // Subtle vertical floating motion
      islandGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Subtle particle drift
      particles.rotation.y = elapsedTime * 0.02;

      // Pulse pin nodes
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.15;
      hotspotMeshes.forEach(mesh => {
        mesh.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      islandGeometry.dispose();
      islandMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-museum-950 via-museum-900 to-museum-950">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Subtle vignette and gradient overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-museum-950/40 to-museum-950" />

      {/* Hero Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pointer-events-none">
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-lanka-gold/30 backdrop-blur-sm pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-lanka-gold animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-lanka-gold uppercase">
              Official Digital Museum & Macroeconomic Archive
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-slate-100 tracking-tight leading-[1.08]">
            SRI LANKA
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-slate-300 font-sans tracking-wide mt-2">
              THE JOURNEY OF A NATION
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 font-sans font-light leading-relaxed max-w-xl">
            {t.heroTagline} An interactive, non-partisan exploration of seven eras of governance, demography, macroeconomic indicators, and historical cartography.
          </p>

          {/* CTA & Actions */}
          <div className="pt-4 flex flex-wrap items-center gap-3 pointer-events-auto">
            <button
              onClick={onExplore}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-lanka-gold hover:bg-lanka-goldLight text-slate-950 font-medium text-sm transition-all duration-200 shadow-lg shadow-lanka-gold/15 group"
            >
              <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
              <span className="tracking-wide uppercase font-semibold">{t.exploreButton}</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onQuickNavigate('timeline')}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 text-sm transition-colors"
            >
              <span>Explore Timeline</span>
            </button>

            <button
              onClick={() => onQuickNavigate('economy')}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 text-sm transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-lanka-gold" />
              <span>Economic Indicators</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Interaction Hint */}
      <div className="relative z-10 text-center py-2 pointer-events-none hidden sm:block">
        <span className="text-[11px] font-mono text-slate-400/80 tracking-widest uppercase">
          ✦ Drag to rotate 3D Island • Elevation indicates Central Highlands
        </span>
      </div>

      {/* "SRI LANKA AT A GLANCE" Visual Stat Bar */}
      <div className="relative z-10 w-full border-t border-slate-800/80 bg-museum-950/85 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-lanka-gold flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lanka-gold" />
              <span>{t.atAGlance}</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Source: CBSL & DCS (2024–2026 Series)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
            {/* Real-Time Live Forex (USD to LKR) */}
            <div 
              onClick={() => onQuickNavigate('economy')}
              className="p-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/80 hover:border-emerald-600 cursor-pointer transition-all group relative overflow-hidden"
              title="Click to open Real-Time Currency Converter"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-mono font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  Live Forex & USDT
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadForex();
                  }}
                  className={`text-[10px] font-mono text-emerald-400/80 hover:text-emerald-200 transition-transform ${isRefreshingForex ? 'animate-spin' : ''}`}
                  title="Refresh live exchange rate from free API"
                >
                  ↻
                </button>
              </div>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-emerald-300 transition-colors block">
                Rs. {forex ? forex.rate.toFixed(2) : '329.81'}
              </span>
              <span className="text-[10px] text-emerald-400/80 block -mt-0.5 truncate font-mono">
                1 USD • ₮1 ≈ Rs. {forex ? (forex.rate * 1.015).toFixed(1) : '334.8'}
              </span>
            </div>

            {/* Population */}
            <div 
              onClick={() => onQuickNavigate('people')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.population}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                {formatPopulation(latestDemo.population)}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">2024 Census</span>
            </div>

            {/* GDP USD */}
            <div 
              onClick={() => onQuickNavigate('economy')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.gdpNominal}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                {formatCurrency(latestEcon.gdpNominalUSD, 'USD')}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">2026 Proj USD</span>
            </div>

            {/* GDP Per Capita */}
            <div 
              onClick={() => onQuickNavigate('economy')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.gdpPerCapita}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                {formatPerCapita(latestEcon.gdpPerCapitaUSD)}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Annual / Person</span>
            </div>

            {/* Area */}
            <div 
              onClick={() => onQuickNavigate('map')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.area}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                65,610 km²
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Island Territory</span>
            </div>

            {/* Divisions */}
            <div 
              onClick={() => onQuickNavigate('map')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Divisions</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                9 Prov / 25 Dist
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Administrative</span>
            </div>

            {/* Life Expectancy */}
            <div 
              onClick={() => onQuickNavigate('people')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.lifeExpectancy}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                {latestDemo.lifeExpectancyYears} yrs
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Highest in SAARC</span>
            </div>

            {/* Currency */}
            <div 
              onClick={() => onQuickNavigate('economy')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.currency}</span>
              <span className="text-lg font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors">
                LKR (Rs)
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">CBSL Regulated</span>
            </div>

            {/* Capital */}
            <div 
              onClick={() => onQuickNavigate('map')}
              className="p-3 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">{t.capital}</span>
              <span className="text-sm font-serif font-bold text-slate-100 group-hover:text-lanka-goldLight transition-colors truncate block">
                Kotte / Colombo
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Admin / Comm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
