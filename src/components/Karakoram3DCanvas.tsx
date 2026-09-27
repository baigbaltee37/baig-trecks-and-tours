import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Karakoram3DCanvasProps {
  activeWaypointIndex?: number;
  onSelectWaypoint?: (index: number) => void;
}

export const KARAKORAM_WAYPOINTS = [
  { name: 'Gilgit Hub', elevation: '1,500 m', coords: [-2.8, 0.25, 1.4] as [number, number, number], region: 'Confluence of Rivers' },
  { name: 'Hunza & Karimabad', elevation: '2,438 m', coords: [-1.4, 0.68, -0.4] as [number, number, number], region: 'Rakaposhi & Ultar Vista' },
  { name: 'Attabad & Passu', elevation: '2,559 m', coords: [-0.2, 0.85, -1.6] as [number, number, number], region: 'Upper Hunza / Gojal' },
  { name: 'Skardu Valley', elevation: '2,228 m', coords: [1.5, 0.62, 0.2] as [number, number, number], region: 'Baltistan Gateway' },
  { name: 'Deosai Plains', elevation: '4,114 m', coords: [0.9, 1.05, 1.5] as [number, number, number], region: 'High Alpine Plateau' },
  { name: 'Fairy Meadows', elevation: '3,300 m', coords: [-1.6, 0.92, 2.0] as [number, number, number], region: 'Nanga Parbat Raikot Face' },
];

export const Karakoram3DCanvas: React.FC<Karakoram3DCanvasProps> = ({
  activeWaypointIndex = 1,
  onSelectWaypoint,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // WebGL Context Safety Listeners
    const canvasEl = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglSupported(false);
    };
    const handleContextRestored = () => {
      setWebglSupported(true);
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f14, 0.11);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 6.2);
    camera.lookAt(0, 0.3, 0);

    // Three-Point Studio & Alpine Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfde68a, 1.5);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.1);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Procedural Karakoram Mountain Range Geometry
    const planeGeo = new THREE.PlaneGeometry(11, 7.5, 96, 64);
    planeGeo.rotateX(-Math.PI / 2);
    const pos = planeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);
      const ridge1 = Math.sin(x * 0.85 + z * 0.5) * Math.cos(z * 0.9) * 0.95;
      const ridge2 = Math.abs(Math.sin(x * 1.9 - z * 1.3)) * 0.65;
      const spire = Math.abs(Math.cos(x * 3.4 + z * 2.7)) * 0.28;
      const falloff = Math.max(0, 1 - distFromCenter / 5.8);
      const y = Math.max(0, (ridge1 + ridge2 + spire) * falloff);
      pos.setY(i, y);
    }
    planeGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x111c28,
      roughness: 0.78,
      metalness: 0.22,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(planeGeo, terrainMat);
    scene.add(terrainMesh);

    // Subtle Topographic Wireframe Overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const wireMesh = new THREE.Mesh(planeGeo, wireMat);
    wireMesh.position.y = 0.005;
    scene.add(wireMesh);

    // 3D Expedition Route Curve connecting Gilgit-Baltistan Waypoints
    const curvePoints = KARAKORAM_WAYPOINTS.map((w) => new THREE.Vector3(...w.coords));
    const routeCurve = new THREE.CatmullRomCurve3(curvePoints, false);
    const routePoints = routeCurve.getPoints(80);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.85 });
    const routeLine = new THREE.Line(routeGeo, routeMat);
    scene.add(routeLine);

    // Waypoint Beacons
    const beaconGroup = new THREE.Group();
    const markerMeshes: THREE.Mesh[] = [];
    KARAKORAM_WAYPOINTS.forEach((wp, idx) => {
      const isSelected = idx === activeWaypointIndex;
      const sphereGeo = new THREE.SphereGeometry(isSelected ? 0.13 : 0.085, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xd4af37 : 0x38bdf8,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(...wp.coords);
      beaconGroup.add(mesh);
      markerMeshes.push(mesh);
    });
    scene.add(beaconGroup);

    let mouseX = 0;
    let mouseY = 0;
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 0.8;
      mouseY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchstart', handleTouchMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        terrainMesh.rotation.y = Math.sin(elapsed * 0.15) * 0.08 + mouseX * 0.25;
        wireMesh.rotation.y = terrainMesh.rotation.y;
        routeLine.rotation.y = terrainMesh.rotation.y;
        beaconGroup.rotation.y = terrainMesh.rotation.y;

        camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.05;
        camera.position.y += (3.4 - mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0.35, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);
      planeGeo.dispose();
      terrainMat.dispose();
      wireMat.dispose();
      routeGeo.dispose();
      routeMat.dispose();
      renderer.dispose();
    };
  }, [activeWaypointIndex, reducedMotion]);

  const activeWp = KARAKORAM_WAYPOINTS[activeWaypointIndex] || KARAKORAM_WAYPOINTS[0];

  return (
    <div className="relative w-full h-[460px] md:h-[540px] bg-[#080C11] border border-white/10 rounded-xl overflow-hidden">
      {webglSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0E1726] to-[#0B0F14] p-6 text-center">
          <p className="text-sm text-[#94A3B8]">
            3D Topographical Preview active in lightweight fallback mode for your device.
          </p>
        </div>
      )}

      {/* Semantic DOM HUD Overlay (Section 2.A of 5_threejs_3d_spatial.md) */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2.5 pointer-events-auto">
          <div className="text-xs text-[#94A3B8] flex items-center gap-2">
            <span>KARAKORAM 3D TERRAIN</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-[#D4AF37]">{activeWp.elevation}</span>
          </div>
          <div className="text-sm font-semibold text-white mt-0.5">
            {activeWp.name} — <span className="text-[#94A3B8] font-normal">{activeWp.region}</span>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#94A3B8] pointer-events-auto">
          Move cursor to inspect elevation relief
        </div>
      </div>

      {/* Interactive Waypoint Selector Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
        {KARAKORAM_WAYPOINTS.map((wp, idx) => {
          const isSelected = idx === activeWaypointIndex;
          return (
            <button
              key={wp.name}
              type="button"
              onClick={() => onSelectWaypoint?.(idx)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
                isSelected
                  ? 'bg-[#0EA5E9] text-[#0B0F14] font-semibold border-[#0EA5E9]'
                  : 'bg-black/65 text-[#E2E8F0] border-white/10 hover:border-white/30'
              }`}
            >
              0{idx + 1}. {wp.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
