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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-200 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <Shield className="w-3.5 h-3.5 text-white" /> Digital Security Protocol
          </span>
          <h1 className="text-2xl font-extrabold">Digital Gate Pass Management</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">
            Automated pickup pass approval with security QR code scanning at campus gates.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#4F7CFF] font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Request New Gate Pass
        </button>
      </div>

      {/* Active Gate Passes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gatePasses.map((pass: any) => (
          <div key={pass.id} className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  pass.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {pass.status} PASS
                </span>
                <h3 className="font-extrabold text-base text-[#1E293B] mt-2">{pass.studentName}</h3>
                <p className="text-xs text-slate-500 font-medium">Reason: {pass.reason}</p>
              </div>

              {pass.qrCodeUrl && (
                <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <img src={pass.qrCodeUrl} alt="Gate Pass QR Code" className="w-20 h-20" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">Date & Time Out:</span>
                <span className="font-extrabold text-[#1E293B]">{pass.date} at {pass.timeOut}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">Authorized Pickup:</span>
                <span className="font-extrabold text-[#1E293B]">{pass.pickupPerson}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
              <span>Security Stamp: Verified by Admin</span>
              <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Gate Scan Ready
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#1E293B] flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Request Digital Gate Pass</span>
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitPass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Reason for Early Leave</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Scheduled Medical Appointment"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[#1E293B] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-[#1E293B] font-medium" />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pickup Time</label>
                  <input type="text" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-[#1E293B] font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Pickup Person Name & Relation</label>
                <input
                  type="text"
                  value={pickupPerson}
                  onChange={(e) => setPickupPerson(e.target.value)}
                  placeholder="e.g. Sarah Vance (Mother)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[#1E293B] font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4F7CFF] hover:bg-blue-600 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer"
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
