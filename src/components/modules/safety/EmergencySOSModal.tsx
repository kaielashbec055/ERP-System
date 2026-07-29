import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AlertOctagon, X, ShieldAlert, PhoneCall, Radio, CheckCircle2 } from 'lucide-react';

export const EmergencySOSModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen, triggerEmergencyAlert, user } = useApp();
  const [selectedType, setSelectedType] = useState<'lockdown' | 'weather' | 'medical' | 'fire'>('medical');
  const [sosNote, setSosNote] = useState('');
  const [dispatched, setDispatched] = useState(false);

  if (!isSosModalOpen) return null;

  const handleDispatchSOS = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmergencyAlert({
      type: selectedType === 'fire' ? 'medical' : selectedType,
      title: `URGENT SOS: ${selectedType.toUpperCase()} EMERGENCY`,
      message: sosNote || `Urgent ${selectedType} SOS alert raised by ${user.name}. Campus security & medical cell notified.`,
      issuedBy: user.name,
      severity: 'critical'
    });

    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setIsSosModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-rose-500">
            <AlertOctagon className="w-6 h-6 animate-bounce" />
            <h2 className="text-lg font-black tracking-tight text-white">EMERGENCY SOS PANIC TERMINAL</h2>
          </div>
          <button onClick={() => setIsSosModalOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" /> High Priority Incident Protocol
          </p>
          <p className="text-[11px] text-slate-300">
            Clicking dispatch will instantly notify Campus Security Control, Local Emergency Responders, and broadcast SMS alerts to all registered Parents.
          </p>
        </div>

        <form onSubmit={handleDispatchSOS} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-2">Select Incident Category</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'medical', label: '🚑 Medical Emergency' },
                { key: 'lockdown', label: '🚨 Campus Lockdown' },
                { key: 'weather', label: '⛈️ Extreme Weather' },
                { key: 'fire', label: '🔥 Fire Alarm' }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setSelectedType(cat.key as any)}
                  className={`p-3 rounded-xl border text-left font-extrabold transition-all ${
                    selectedType === cat.key
                      ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/50 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Additional Location Details / Notes</label>
            <textarea
              value={sosNote}
              onChange={(e) => setSosNote(e.target.value)}
              placeholder="e.g. Student injured near Science Block Lab 3B..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {dispatched ? (
            <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl text-center font-extrabold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>SOS PANIC BROADCAST DISPATCHED LIVE!</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm rounded-xl shadow-xl shadow-rose-600/40 transition-all flex items-center justify-center gap-2 uppercase"
            >
              <ShieldAlert className="w-5 h-5" /> DISPATCH EMERGENCY SOS NOW
            </button>
          )}
        </form>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Direct Hotline: +1 (800) 555-SOS-SCHL</span>
          <span className="text-emerald-400 font-semibold">Campus Gate 2 Active</span>
        </div>
      </div>
    </div>
  );
};
