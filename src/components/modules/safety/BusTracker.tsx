import React, { useState, useEffect } from 'react';
import { MOCK_BUS_TRACKER } from '../../../mockData/mockData';
import { BusTrackingInfo } from '../../../types';
import { getBusTrackingInfoApi } from '../../../services/api';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  RefreshCw,
  User,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const BusTracker: React.FC = () => {
  const [busData, setBusData] = useState<BusTrackingInfo>(MOCK_BUS_TRACKER);
  const [busPos, setBusPos] = useState({ x: 340, y: 160 });
  const [speed, setSpeed] = useState(38);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    async function fetchBusTelemetry() {
      try {
        const info = await getBusTrackingInfoApi('BUS-14');
        if (info) {
          setBusData(info);
          setSpeed(info.currentSpeed || 38);
        }
      } catch (e) {
        console.log('[BusTracker] Local simulation active');
      }
    }
    fetchBusTelemetry();
  }, []);

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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#4F7CFF] border border-blue-200 text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <Bus className="w-3.5 h-3.5 text-[#4F7CFF] animate-pulse" /> Live Student Transport System
          </span>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Live GPS School Bus Tracker</h1>
          <p className="text-slate-600 text-xs mt-1 font-medium">
            BUS-14 • North Sector Express Route • Driver: {MOCK_BUS_TRACKER.driverName}
          </p>
        </div>

        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#1E293B] text-xs font-extrabold border border-slate-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#4F7CFF] ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Pause GPS Simulation' : 'Resume Live GPS'}</span>
        </button>
      </div>

      {/* Main Bus Tracking Map Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="font-extrabold text-sm text-[#1E293B]">Google Maps Live Transit View</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#4F7CFF] font-extrabold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Speed: {speed} km/h
              </span>
              <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Status: On Time (ETA 8m)
              </span>
            </div>
          </div>

          {/* Interactive Route Canvas SVG Map - Google Maps Light Style */}
          <div className="relative w-full h-[380px] bg-[#EAEFE9] rounded-2xl border border-slate-200 overflow-hidden p-4 shadow-inner">
            {/* Subtle Road Networks (Vector Canvas) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
              {/* Secondary roads */}
              <line x1="0" y1="100" x2="700" y2="100" stroke="#FFFFFF" strokeWidth="14" />
              <line x1="0" y1="240" x2="700" y2="240" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#FFFFFF" strokeWidth="16" />
              <line x1="500" y1="0" x2="500" y2="400" stroke="#FFFFFF" strokeWidth="14" />

              {/* Road Casing borders */}
              <line x1="0" y1="100" x2="700" y2="100" stroke="#D1D5DB" strokeWidth="1" />
              <line x1="0" y1="240" x2="700" y2="240" stroke="#D1D5DB" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#D1D5DB" strokeWidth="1" />
              <line x1="500" y1="0" x2="500" y2="400" stroke="#D1D5DB" strokeWidth="1" />
            </svg>

            {/* Floating Top-Left ETA Card */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-md text-xs z-20 space-y-1">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#4F7CFF]" />
                <span className="font-extrabold text-[#1E293B]">Next Stop: Vance St</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">Estimated Arrival: 8:12 AM (In 8 mins)</p>
            </div>

            <svg className="w-full h-full relative z-10" viewBox="0 0 700 340">
              {/* Main Route Line shadow/outline */}
              <path
                d="M 80,80 Q 210,140 380,180 T 650,300"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Active Blue Route Line */}
              <path
                d="M 80,80 Q 210,140 380,180 T 650,300"
                fill="none"
                stroke="#4F7CFF"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Pulse Direction Indicators */}
              <path
                d="M 80,80 Q 210,140 380,180 T 650,300"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeDasharray="8 8"
                className="animate-pulse"
              />

              {/* Bus Stops Pins */}
              {MOCK_BUS_TRACKER.stops.map((stop) => (
                <g key={stop.id} transform={`translate(${stop.coords.x}, ${stop.coords.y})`}>
                  {/* Stop Marker Shadow */}
                  <circle r="12" fill="#1E293B" opacity="0.1" />
                  {/* Pin outer circle */}
                  <circle
                    r="9"
                    fill={stop.passed ? '#22C55E' : stop.name.includes('Vance') ? '#F59E0B' : '#4F7CFF'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className={stop.name.includes('Vance') ? 'animate-ping opacity-75' : ''}
                  />
                  <circle
                    r="5"
                    fill="#FFFFFF"
                  />
                  {/* Stop Tag Badge */}
                  <rect
                    x="14"
                    y="-12"
                    width="140"
                    height="20"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                  <text
                    x="20"
                    y="2"
                    fill="#1E293B"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="Plus Jakarta Sans"
                  >
                    {stop.name} ({stop.time})
                  </text>
                </g>
              ))}

              {/* Moving Bus Marker (Google Maps Style) */}
              <g transform={`translate(${busPos.x}, ${busPos.y})`} className="transition-all duration-300">
                <circle r="22" fill="#4F7CFF" opacity="0.2" className="animate-ping" />
                <circle r="16" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" className="shadow-lg" />
                <path d="M-6 -5 H6 V6 H-6 Z" fill="#FFFFFF" />
                <rect x="-8" y="-7" width="16" height="12" rx="3" fill="#1E293B" />
                <text x="-6" y="2" fill="#F59E0B" fontSize="9" fontWeight="900">BUS</text>
              </g>
            </svg>

            {/* Geofence Indicator Card */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-0.5 z-20">
              <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Geofence Corridor: ACTIVE</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Bus verified inside designated safe route boundary.</p>
            </div>
          </div>
        </div>

        {/* Bus Stop Timetable & Driver Info */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-3">
            <h3 className="font-extrabold text-sm text-[#1E293B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4F7CFF]" />
              <span>Route Stop Timetable</span>
            </h3>

            <div className="space-y-2.5">
              {MOCK_BUS_TRACKER.stops.map((stop) => (
                <div
                  key={stop.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                    stop.name.includes('Vance')
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold shadow-xs'
                      : stop.passed
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 text-[#1E293B] font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stop.passed ? 'bg-emerald-500' : 'bg-[#4F7CFF]'}`}></span>
                    <span>{stop.name}</span>
                  </div>
                  <span className="font-extrabold">{stop.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-3">
            <h3 className="font-extrabold text-sm text-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#8B5CF6]" />
              <span>Driver & Vehicle Profile</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Driver Name:</span>
                <span className="font-extrabold text-[#1E293B]">{MOCK_BUS_TRACKER.driverName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                <span className="text-slate-500 font-medium">On-Board Capacity:</span>
                <span className="font-extrabold text-[#4F7CFF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  28 / 40 Students
                </span>
              </div>
              <a
                href={`tel:${MOCK_BUS_TRACKER.driverPhone}`}
                className="w-full py-3 bg-[#4F7CFF] hover:bg-blue-600 text-white font-extrabold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
