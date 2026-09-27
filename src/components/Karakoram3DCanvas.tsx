import React from 'react';
import { Mountain, MapPin, Compass } from 'lucide-react';

interface Karakoram3DCanvasProps {
  activeWaypointIndex?: number;
  onSelectWaypoint?: (index: number) => void;
}

export const KARAKORAM_WAYPOINTS = [
  {
    id: 'gilgit-hub',
    name: 'Gilgit Hub',
    subtitle: 'Confluence of Rivers',
    elevation: '1,500 m',
    coords: [-2.8, 0.25, 1.4] as [number, number, number],
    svgPos: { x: 18, y: 68 },
    region: 'Confluence of Rivers',
  },
  {
    id: 'hunza-karimabad',
    name: 'Hunza & Karimabad',
    subtitle: 'Rakaposhi & Ultar Vista',
    elevation: '2,438 m',
    coords: [-1.4, 0.68, -0.4] as [number, number, number],
    svgPos: { x: 34, y: 46 },
    region: 'Rakaposhi & Ultar Vista',
  },
  {
    id: 'attabad-passu',
    name: 'Attabad & Passu',
    subtitle: 'Upper Hunza / Gojal',
    elevation: '2,559 m',
    coords: [-0.2, 0.85, -1.6] as [number, number, number],
    svgPos: { x: 50, y: 34 },
    region: 'Upper Hunza / Gojal',
  },
  {
    id: 'skardu-valley',
    name: 'Skardu Valley',
    subtitle: 'Baltistan Gateway',
    elevation: '2,228 m',
    coords: [1.5, 0.62, 0.2] as [number, number, number],
    svgPos: { x: 66, y: 52 },
    region: 'Baltistan Gateway',
  },
  {
    id: 'deosai-plains',
    name: 'Deosai Plains',
    subtitle: 'High Alpine Plateau',
    elevation: '4,114 m',
    coords: [0.9, 1.05, 1.5] as [number, number, number],
    svgPos: { x: 82, y: 24 },
    region: 'High Alpine Plateau',
  },
  {
    id: 'fairy-meadows',
    name: 'Fairy Meadows',
    subtitle: 'Nanga Parbat Raikot Face',
    elevation: '3,300 m',
    coords: [-1.6, 0.92, 2.0] as [number, number, number],
    svgPos: { x: 42, y: 28 },
    region: 'Nanga Parbat Raikot Face',
  },
];

export const Karakoram3DCanvas: React.FC<Karakoram3DCanvasProps> = ({
  activeWaypointIndex = 1,
  onSelectWaypoint,
}) => {
  const activeWp =
    KARAKORAM_WAYPOINTS[activeWaypointIndex] || KARAKORAM_WAYPOINTS[0];

  return (
    <div className="relative w-full h-[380px] md:h-[480px] bg-gradient-to-b from-emerald-50 via-white to-teal-50 border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Top Info Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <Mountain className="w-3.5 h-3.5 text-emerald-600" />
            <span>KARAKORAM ELEVATION PROFILE</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-emerald-800 font-bold">
              {activeWp.elevation}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {activeWp.name} —{' '}
            <span className="text-slate-600 font-medium">{activeWp.region}</span>
          </div>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 rounded-2xl px-3.5 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Select a peak or valley below</span>
        </div>
      </div>

      {/* Layered 3D SVG Topographical Mountain Illustration (Zero WebGL Flicker) */}
      <div className="relative flex-1 w-full my-2">
        <svg
          viewBox="0 0 100 80"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
          aria-label="Karakoram 3D Elevation Relief"
        >
          <defs>
            <linearGradient id="karakoramFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="karakoramMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="karakoramFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#065F46" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          {/* Far Mountain Range */}
          <polygon
            points="0,78 0,52 16,28 32,48 48,14 66,42 82,16 100,40 100,78"
            fill="url(#karakoramFar)"
          />
          {/* Mid Mountain Ridge */}
          <polygon
            points="0,78 10,46 26,60 42,24 58,50 76,26 92,52 100,38 100,78"
            fill="url(#karakoramMid)"
          />
          {/* Foreground Alpine Slope */}
          <polygon
            points="0,78 18,58 36,44 52,62 68,46 86,58 100,50 100,78"
            fill="url(#karakoramFront)"
          />

          {/* Expedition Route Curve */}
          <polyline
            fill="none"
            stroke="#047857"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            points="18,68 34,46 42,28 50,34 66,52 82,24"
          />
        </svg>

        {/* Interactive Waypoint Pins */}
        {KARAKORAM_WAYPOINTS.map((wp, idx) => {
          const isSelected = idx === activeWaypointIndex;
          return (
            <button
              key={wp.id}
              type="button"
              onClick={() => onSelectWaypoint?.(idx)}
              style={{ left: `${wp.svgPos.x}%`, top: `${wp.svgPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
            >
              <span
                className={`flex items-center justify-center rounded-full transition-transform ${
                  isSelected
                    ? 'w-7 h-7 bg-emerald-700 text-white ring-4 ring-emerald-500/30 scale-110 shadow-md'
                    : 'w-5 h-5 bg-white text-emerald-700 border-2 border-emerald-600 hover:scale-110 shadow-xs'
                }`}
              >
                <MapPin className="w-3 h-3" />
              </span>
              <span
                className={`hidden sm:block absolute left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                {wp.name} ({wp.elevation})
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Waypoint Selector Bar */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1">
        {KARAKORAM_WAYPOINTS.map((wp, idx) => {
          const isSelected = idx === activeWaypointIndex;
          return (
            <button
              key={wp.id}
              type="button"
              onClick={() => onSelectWaypoint?.(idx)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
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
