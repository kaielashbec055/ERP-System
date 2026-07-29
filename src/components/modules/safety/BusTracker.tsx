import React, { useState, useEffect } from 'react';
import { MOCK_BUS_TRACKER } from '../../../mockData/mockData';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  AlertCircle,
  Navigation,
  RefreshCw,
  User,
  Zap
} from 'lucide-react';

export const BusTracker: React.FC = () => {
  const [busPos, setBusPos] = useState({ x: 340, y: 160 });
  const [speed, setSpeed] = useState(38);
  const [isSimulating, setIsSimulating] = useState(true);

  // Animated bus moving along route SVG path
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setBusPos((prev) => {
        const nextX = prev.x > 620 ? 80 : prev.x + 3;
        const nextY = 80 + Math.sin(nextX / 60) * 40 + (nextX * 0.3);
        return { x: nextX, y: nextY };
      });
      setSpeed(Math.floor(35 + Math.random() * 8));
    }, 500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Bus className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Student Safety Transport System
          </span>
          <h1 className="text-2xl font-extrabold text-white">Live GPS School Bus Tracker</h1>
          <p className="text-slate-300 text-xs mt-1">
            BUS-14 • North Sector Express Route • Driver: Robert Jenkins
          </p>
        </div>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-400 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Pause GPS Simulation' : 'Resume Live GPS'}</span>
        </button>
      </div>

      {/* Main Bus Tracking Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="font-bold text-sm text-white">Interactive Live Transit Map</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                Speed: {speed} km/h
              </span>
              <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Status: On Time (ETA 8m)
              </span>
            </div>
          </div>

          {/* Interactive Route Canvas SVG Map */}
          <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4 shadow-inner">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <svg className="w-full h-full relative z-10" viewBox="0 0 700 340">
              {/* Route Curve Line */}
              <path
                d="M 80,80 Q 210,140 380,180 T 650,300"
                fill="none"
                stroke="#334155"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 80,80 Q 210,140 380,180 T 650,300"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse-slow"
              />

              {/* Bus Stops Pins */}
              {MOCK_BUS_TRACKER.stops.map((stop) => (
                <g key={stop.id} transform={`translate(${stop.coords.x}, ${stop.coords.y})`}>
                  <circle
                    r="10"
                    fill={stop.passed ? '#10b981' : stop.name.includes('Vance') ? '#f59e0b' : '#3b82f6'}
                    className={stop.name.includes('Vance') ? 'animate-ping opacity-75' : ''}
                  />
                  <circle
                    r="6"
                    fill={stop.passed ? '#059669' : stop.name.includes('Vance') ? '#d97706' : '#2563eb'}
                  />
                  <text
                    x="15"
                    y="4"
                    fill="#e2e8f0"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="Plus Jakarta Sans"
                  >
                    {stop.name} ({stop.time})
                  </text>
                </g>
              ))}

              {/* Moving Bus Marker */}
              <g transform={`translate(${busPos.x}, ${busPos.y})`} className="transition-all duration-300">
                <circle r="18" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                <rect x="-16" y="-12" width="32" height="24" rx="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="-10" y="4" fill="#0f172a" fontSize="11" fontWeight="900">BUS</text>
              </g>
            </svg>

            {/* Geofence Indicator */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Geofence Status: ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-400">Bus inside designated safe transit corridor.</p>
            </div>
          </div>
        </div>

        {/* Bus Stop Timetable & Driver Info */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Route Stop Timetable</span>
            </h3>

            <div className="space-y-2.5">
              {MOCK_BUS_TRACKER.stops.map((stop, i) => (
                <div
                  key={stop.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    stop.name.includes('Vance')
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : stop.passed
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stop.passed ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span>{stop.name}</span>
                  </div>
                  <span>{stop.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              <span>Driver & Vehicle Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Driver Name:</span>
                <span className="font-bold text-slate-200">{MOCK_BUS_TRACKER.driverName}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">On-Board Capacity:</span>
                <span className="font-bold text-slate-200">28 / 40 Students</span>
              </div>
              <a
                href={`tel:${MOCK_BUS_TRACKER.driverPhone}`}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call Driver Hotline
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
