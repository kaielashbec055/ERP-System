import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  School,
  AlertOctagon,
  Users,
  Bus,
  ShieldCheck,
  Radio,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, triggerEmergencyAlert, emergencyAlerts, setIsSosModalOpen } = useApp();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'lockdown' | 'weather' | 'medical' | 'general'>('weather');
  const [alertIssuedSuccess, setAlertIssuedSuccess] = useState(false);

  const handlePublishEmergencyAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    triggerEmergencyAlert({
      type: broadcastType,
      title: `${broadcastType.toUpperCase()} ALERT: ${broadcastMessage.slice(0, 30)}...`,
      message: broadcastMessage,
      issuedBy: `${user.name} (Principal)`,
      severity: broadcastType === 'lockdown' ? 'critical' : 'warning'
    });

    setAlertIssuedSuccess(true);
    setBroadcastMessage('');
    setTimeout(() => setAlertIssuedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Command Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-200 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" /> Institution Health Command Center
          </span>
          <h1 className="text-2xl font-extrabold">Central Admin Command Dashboard</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">
            EduPulse Operations • 1,240 Students • 86 Staff • 42 Transport Buses Active
          </p>
        </div>

        <button
          onClick={() => setIsSosModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#EF4444] hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer animate-bounce"
        >
          <AlertOctagon className="w-5 h-5" /> TRIGGER CAMPUS SOS PANIC
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Enrolled</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-[#4F7CFF]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E293B] mt-2">1,240</p>
          <p className="text-[11px] text-emerald-600 font-extrabold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% YoY Growth
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today Attendance</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E293B] mt-2">98.2%</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">1,218 Present Today</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Bus Fleet</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E293B] mt-2">42 / 42</p>
          <p className="text-[11px] text-emerald-600 font-extrabold mt-1">100% On-Time Status</p>
        </div>

        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">System Safety</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-[#8B5CF6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">Optimal</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Gate Pass Sensors Active</p>
        </div>
      </div>

      {/* Broadcast Emergency Alert Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-[#1E293B] flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500" />
              <span>Broadcast Official Campus Emergency Alert</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Sends instant push notification, SMS, and app alert to all Parents, Students, and Teachers.</p>
          </div>

          <form onSubmit={handlePublishEmergencyAlert} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-extrabold text-[#1E293B] mb-1.5">Alert Severity Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'weather', label: 'Severe Weather', color: 'border-amber-300 text-amber-800 bg-amber-50' },
                  { key: 'lockdown', label: 'Campus Lockdown', color: 'border-rose-300 text-rose-800 bg-rose-50' },
                  { key: 'medical', label: 'Medical Alert', color: 'border-blue-300 text-[#4F7CFF] bg-blue-50' },
                  { key: 'general', label: 'General Announcement', color: 'border-purple-300 text-purple-800 bg-purple-50' }
                ].map((t) => (
                  <button
                    type="button"
                    key={t.key}
                    onClick={() => setBroadcastType(t.key as any)}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      broadcastType === t.key ? `${t.color} ring-2 ring-[#4F7CFF]` : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1E293B] mb-1.5">Alert Message Body</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type emergency alert details (e.g. Heavy rain forecast. Buses departing at 2:30 PM today)..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#4F7CFF] font-medium"
              />
            </div>

            {alertIssuedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-extrabold text-xs text-center">
                ✓ Emergency Broadcast Successfully Dispatched to 1,240 Parents & Staff!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#EF4444] hover:bg-rose-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> DISPATCH EMERGENCY BROADCAST NOW
            </button>
          </form>
        </div>

        {/* Recent Active Alerts Feed */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
          <h3 className="font-extrabold text-sm text-[#1E293B] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4F7CFF]" />
            <span>Active Broadcast Log</span>
          </h3>

          <div className="space-y-3">
            {emergencyAlerts.map((alt) => (
              <div key={alt.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    alt.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {alt.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{alt.timestamp}</span>
                </div>
                <h5 className="font-extrabold text-xs text-[#1E293B]">{alt.title}</h5>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{alt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
