import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Mountain, Users, Anchor, Info, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SRI_LANKA_DISTRICTS } from '@/data/maps/districts';
import { DistrictData } from '@/types';
import { createSriLankaIslandShape } from '@/lib/sriLankaCoastline';

export const ThreeTerrainMap: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [viewMode, setViewMode] = useState<'density_bars' | 'terrain_relief'>('density_bars');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 10, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    // Authentic Island Topography Base
    const islandShape = createSriLankaIslandShape();

    const extrudeSettings = {
      steps: 5,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.1,
      bevelSegments: 4
    };

    const islandGeometry = new THREE.ExtrudeGeometry(islandShape, extrudeSettings);
    islandGeometry.rotateX(-Math.PI / 2);
    islandGeometry.center();

    // Authentic Central Highland Elevation
    const posAttr = islandGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      if (y > 0) {
        const distHighlands = Math.sqrt(Math.pow((x + 0.12) * 1.15, 2) + Math.pow(z - 1.55, 2));
        const distKnuckles = Math.sqrt(Math.pow((x - 0.22) * 1.25, 2) + Math.pow(z - 0.9, 2));

        let elevationBonus = 0;
        if (distHighlands < 1.75) {
          elevationBonus += Math.pow((1.75 - distHighlands) / 1.75, 1.8) * 1.45;
        }
        if (distKnuckles < 0.95) {
          elevationBonus += Math.pow((0.95 - distKnuckles) / 0.95, 1.6) * 0.75;
        }

        posAttr.setY(i, y + elevationBonus);
      }
    }
    islandGeometry.computeVertexNormals();

    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x141c2c,
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true,
    });
    const islandMesh = new THREE.Mesh(islandGeometry, islandMat);
    mapGroup.add(islandMesh);

    // Convert lat/lng to authentic 3D map space coordinates
    const project3D = (lat: number, lng: number) => {
      const x = (lng - 80.78) * 2.15;
      const z = -(lat - 7.85) * 2.05;
      return { x, z };
    };

    // 3D Extruded Population Density Columns by District
    const barsGroup = new THREE.Group();
    mapGroup.add(barsGroup);

    SRI_LANKA_DISTRICTS.forEach((dist) => {
      const coords = project3D(dist.coordinates.lat, dist.coordinates.lng);
      // Height scaled proportional to real population density
      const barHeight = Math.max(0.15, (dist.densityPerKm2 / 3383) * 3.8);

      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, barHeight, 16);
      barGeo.translate(0, barHeight / 2, 0);

      // Color coding: High density = Rose/Gold, Low density = Sky/Emerald
      const barColor = dist.densityPerKm2 > 1500 
        ? 0xf43f5e 
        : dist.densityPerKm2 > 600 
          ? 0xcfa935 
          : dist.densityPerKm2 > 300 
            ? 0x38bdf8 
            : 0x10b981;

      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        roughness: 0.3,
        metalness: 0.4,
      });

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(coords.x, 0.2, coords.z);
      barMesh.userData = { district: dist };
      barsGroup.add(barMesh);

      // Pulse ring at foot of bar
      const ringGeo = new THREE.RingGeometry(0.1, 0.14, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: barColor, transparent: true, opacity: 0.4 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(coords.x, 0.21, coords.z);
      barsGroup.add(ringMesh);
    });

    // Mountain Summits (Pidurutalagala 2,524m, Adam's Peak 2,243m, Sigiriya)
    const mountains = [
      { name: 'Pidurutalagala (2,524m)', lat: 7.0006, lng: 80.7725, height: 1.4 },
      { name: 'Adam’s Peak / Sri Pada (2,243m)', lat: 6.8094, lng: 80.4994, height: 1.25 },
      { name: 'Sigiriya Rock Fortress', lat: 7.9570, lng: 80.7603, height: 0.6 }
    ];

    mountains.forEach(mt => {
      const pt = project3D(mt.lat, mt.lng);
      const coneGeo = new THREE.ConeGeometry(0.12, mt.height * 0.4, 6);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(pt.x, 0.8, pt.z);
      mapGroup.add(cone);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xfff5e6, 2.0);
    sun.position.set(8, 15, 8);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rim.position.set(-8, -4, -8);
    scene.add(rim);

    // Mouse Interaction
    let isDragging = false;
    let prevX = 0;
    let targetRotY = -0.3;
    let targetRotX = 0.55;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;
      targetRotY += deltaX * 0.005;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        targetRotY += 0.001;
      }
      mapGroup.rotation.y += (targetRotY - mapGroup.rotation.y) * 0.05;
      mapGroup.rotation.x += (targetRotX - mapGroup.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      islandGeometry.dispose();
      islandMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] rounded-2xl bg-gradient-to-b from-museum-950 to-museum-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Header Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="p-3 rounded-xl bg-museum-950/80 border border-slate-800 backdrop-blur-md pointer-events-auto space-y-0.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-lanka-gold block flex items-center">
            <Compass className="w-3 h-3 mr-1" />
            Three.js 3D Cartographic Engine
          </span>
          <h3 className="font-serif font-bold text-slate-100 text-sm">
            Topographic Island & Population Density Columns
          </h3>
          <p className="text-[11px] text-slate-400">
            Column heights represent real 2024 DCS census district population density (/km²).
          </p>
        </div>

        <div className="p-2 rounded-xl bg-museum-950/80 border border-slate-800 backdrop-blur-md pointer-events-auto flex items-center space-x-2 text-xs font-mono text-slate-300">
          <span className="flex items-center text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1" />
            &gt;1,500/km² (Colombo/Gampaha)
          </span>
          <span className="flex items-center text-lanka-gold">
            <span className="w-2 h-2 rounded-full bg-lanka-gold mr-1" />
            600–1,500/km²
          </span>
          <span className="flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
            &lt;300/km² (Dry Zone)
          </span>
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[11px] font-mono text-slate-400 bg-museum-950/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        ✦ Drag to rotate 3D view • White cones denote mountain summits (Pidurutalagala, Adam's Peak, Sigiriya)
      </div>
    </div>
  );
};
