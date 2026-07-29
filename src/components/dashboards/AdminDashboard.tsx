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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Institution Health Command Center
          </span>
          <h1 className="text-2xl font-extrabold text-white">Central Admin Dashboard</h1>
          <p className="text-slate-300 text-xs mt-1">
            EduPulse Operations • 1,240 Students • 86 Staff • 42 Transport Buses Active
          </p>
        </div>

        <button
          onClick={() => setIsSosModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 animate-bounce"
        >
          <AlertOctagon className="w-5 h-5" /> TRIGGER CAMPUS SOS PANIC
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">1,240</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% YoY Growth
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">98.2%</p>
          <p className="text-[11px] text-slate-400 mt-1">1,218 Present Today</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Bus Fleet</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">42 / 42</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">100% On-Time Status</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">System Safety</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">Optimal</p>
          <p className="text-[11px] text-slate-400 mt-1">Gate Pass Sensors Active</p>
        </div>
      </div>

      {/* Broadcast Emergency Alert Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-400" />
              <span>Broadcast Official Campus Emergency Alert</span>
            </h3>
            <p className="text-xs text-slate-400">Sends instant push notification, SMS, and app alert to all Parents, Students, and Teachers.</p>
          </div>

          <form onSubmit={handlePublishEmergencyAlert} className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alert Severity Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'weather', label: 'Severe Weather', color: 'border-amber-500/50 text-amber-300' },
                  { key: 'lockdown', label: 'Campus Lockdown', color: 'border-rose-500/50 text-rose-400' },
                  { key: 'medical', label: 'Medical Alert', color: 'border-cyan-500/50 text-cyan-300' },
                  { key: 'general', label: 'General Announcement', color: 'border-brand-500/50 text-brand-300' }
                ].map((t) => (
                  <button
                    type="button"
                    key={t.key}
                    onClick={() => setBroadcastType(t.key as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      broadcastType === t.key ? `bg-slate-800 ${t.color} ring-2 ring-brand-500/50` : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alert Message Body</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Type emergency alert details (e.g. Heavy rain forecast. Buses departing at 2:30 PM today)..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {alertIssuedSuccess && (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs text-center animate-fade-in">
                ✓ Emergency Broadcast Successfully Dispatched to 1,240 Parents & Staff!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> DISPATCH EMERGENCY BROADCAST NOW
            </button>
          </form>
        </div>

        {/* Recent Active Alerts Feed */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Active Broadcast Log</span>
          </h3>

          <div className="space-y-3">
            {emergencyAlerts.map((alt) => (
              <div key={alt.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    alt.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {alt.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{alt.timestamp}</span>
                </div>
                <h5 className="font-bold text-xs text-slate-200">{alt.title}</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">{alt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
