import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, QrCode, Plus, CheckCircle2, Clock, Calendar, User, FileText } from 'lucide-react';

export const DigitalGatePass: React.FC = () => {
  const { gatePasses, addGatePass, selectedChild, user } = useApp();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reason, setReason] = useState('');
  const [pickupPerson, setPickupPerson] = useState('');
  const [timeOut, setTimeOut] = useState('01:30 PM');
  const [date, setDate] = useState('2026-07-30');

  const handleSubmitPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    addGatePass({
      studentName: selectedChild ? selectedChild.name : 'Alex Vance',
      studentId: selectedChild ? selectedChild.id : 'usr_std_01',
      parentName: user.name,
      reason,
      date,
      timeOut,
      pickupPerson: pickupPerson || `${user.name} (Parent)`
    });

    setShowRequestModal(false);
    setReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Digital Security Protocol
          </span>
          <h1 className="text-2xl font-extrabold text-white">Digital Gate Pass Management</h1>
          <p className="text-slate-300 text-xs mt-1">
            Automated pickup pass approval with security QR code scanning at campus gates.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Request New Gate Pass
        </button>
      </div>

      {/* Active Gate Passes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gatePasses.map((pass: any) => (
          <div key={pass.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  pass.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {pass.status} PASS
                </span>
                <h3 className="font-bold text-base text-white mt-1.5">{pass.studentName}</h3>
                <p className="text-xs text-slate-400">Reason: {pass.reason}</p>
              </div>

              {pass.qrCodeUrl && (
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <img src={pass.qrCodeUrl} alt="Gate Pass QR Code" className="w-20 h-20" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Date & Time Out:</span>
                <span className="font-bold text-slate-200">{pass.date} at {pass.timeOut}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Authorized Pickup:</span>
                <span className="font-bold text-slate-200">{pass.pickupPerson}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Security Stamp: Verified by Admin</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Gate Scan Ready
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Request Digital Gate Pass</span>
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitPass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Reason for Early Leave</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Scheduled Medical Appointment"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pickup Time</label>
                  <input type="text" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pickup Person Name & Relation</label>
                <input
                  type="text"
                  value={pickupPerson}
                  onChange={(e) => setPickupPerson(e.target.value)}
                  placeholder="e.g. Sarah Vance (Mother)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                Generate Digital QR Gate Pass
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
