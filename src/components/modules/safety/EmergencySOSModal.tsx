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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-rose-500 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 text-[#EF4444]">
            <AlertOctagon className="w-6 h-6 animate-bounce text-[#EF4444]" />
            <h2 className="text-lg font-black tracking-tight text-[#1E293B]">EMERGENCY SOS PANIC TERMINAL</h2>
          </div>
          <button onClick={() => setIsSosModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
          <p className="font-extrabold flex items-center gap-1.5 text-[#EF4444]">
            <Radio className="w-4 h-4 text-[#EF4444] animate-pulse" /> High Priority Incident Protocol
          </p>
          <p className="text-[11px] text-slate-600 font-medium">
            Clicking dispatch will instantly notify Campus Security Control, Local Emergency Responders, and broadcast SMS alerts to all registered Parents.
          </p>
        </div>

        <form onSubmit={handleDispatchSOS} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#1E293B] font-extrabold mb-2">Select Incident Category</label>
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
                  className={`p-3 rounded-2xl border text-left font-extrabold transition-all cursor-pointer ${
                    selectedType === cat.key
                      ? 'bg-[#EF4444] text-white border-rose-500 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#1E293B] font-extrabold mb-1.5">Additional Location Details / Notes</label>
            <textarea
              value={sosNote}
              onChange={(e) => setSosNote(e.target.value)}
              placeholder="e.g. Student injured near Science Block Lab 3B..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#EF4444] font-medium"
            />
          </div>

          {dispatched ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-center font-extrabold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>SOS PANIC BROADCAST DISPATCHED LIVE!</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 bg-[#EF4444] hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" /> DISPATCH EMERGENCY SOS NOW
            </button>
          )}
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
          <span>Direct Hotline: +1 (800) 555-SOS-SCHL</span>
          <span className="text-emerald-600 font-extrabold">Campus Gate 2 Active</span>
        </div>
      </div>
    </div>
  );
};
