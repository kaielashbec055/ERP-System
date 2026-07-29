import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  Bus,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Shield,
  DollarSign
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user, selectedChild, setSelectedChild, childrenList, setActiveTab } = useApp();
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feePaidSuccess, setFeePaidSuccess] = useState(false);

  const handlePayFee = () => {
    setFeePaidSuccess(true);
    setTimeout(() => {
      setShowFeeModal(false);
      setFeePaidSuccess(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Parent Header & Multi-Child Selector */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Parent Portal Overview
          </span>
          <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}</h1>
          <p className="text-slate-300 text-xs mt-1">
            Monitoring safety, academics, transport, and school communication for your children.
          </p>
        </div>

        {/* Multi-Child Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold px-2">Select Child:</span>
          {childrenList.map((child) => (
            <motion.button
              key={child.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChild.id === child.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <img src={child.avatar} alt={child.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{child.name} ({child.grade})</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Child Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Child GPA</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{selectedChild.gpa} <span className="text-xs font-normal text-slate-400">/ 4.0</span></p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Academic Honors</p>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Attendance</span>
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{selectedChild.attendancePercent}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Regular Attendance</p>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Bus Status</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bus className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <p className="text-lg font-black text-emerald-400 mt-2">On Route (ETA 8m)</p>
          <p className="text-[11px] text-slate-400 mt-1">{selectedChild.busRoute}</p>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Fee Status</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-black text-white mt-2">
            {selectedChild.pendingFeeAmount > 0 ? (
              <span className="text-amber-400">${selectedChild.pendingFeeAmount} Due</span>
            ) : (
              <span className="text-emerald-400">All Paid</span>
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Term II Tuition</p>
        </motion.div>
      </div>

      {/* Main Grid: Live Bus GPS & Fee Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Bus Safety Tracking Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Live School Bus GPS Tracking</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time location for BUS-14 (North Sector Route)</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('safety')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-md"
            >
              <span>Full Interactive Map</span>
            </motion.button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="font-bold text-slate-200">BUS-14 • Active GPS Signal</span>
              </div>
              <span className="text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                Speed: 38 km/h (Safe Zone)
              </span>
            </div>

            {/* Route Timeline */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Oakridge Estate</span>
                <span className="font-bold text-emerald-400">Current: Maple Street Circle</span>
                <span>EduPulse Main Gate</span>
              </div>

              <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-slate-700 rounded-full w-[65%]"></div>
                <div className="absolute top-0 left-[62%] -translate-y-1 p-1 bg-amber-400 text-slate-950 rounded-full shadow-lg animate-bounce">
                  <Bus className="w-3 h-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Next Stop: <strong>Maple Street Circle (Vance Stop)</strong></span>
                </div>
                <span className="text-emerald-400 font-extrabold">ETA: 8 minutes</span>
              </div>
            </div>

            {/* Driver Contact */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                  RJ
                </div>
                <div>
                  <p className="font-bold text-slate-200">Robert Jenkins (Driver)</p>
                  <p className="text-[10px] text-slate-400">Licensed Campus Driver • 100% Safety Score</p>
                </div>
              </div>
              <a
                href="tel:+15553829910"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Call Driver
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Fee Portal */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>School Fee Portal</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-200">{selectedChild.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Term II Tuition & Transport:</span>
                <span className="font-bold text-slate-200">$450.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Due Date:</span>
                <span className="text-amber-400 font-bold">August 10, 2026</span>
              </div>

              {selectedChild.pendingFeeAmount > 0 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFeeModal(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" /> Pay Term Fee Now ($450)
                </motion.button>
              ) : (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Fees Fully Paid
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pay Fee Dialog Modal */}
      <AnimatePresence>
        {showFeeModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>EduPulse Pay Gateway</span>
                </h3>
                <button onClick={() => setShowFeeModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-400">Payer: Sarah Vance</p>
                  <p className="text-slate-400">Student: {selectedChild.name} ({selectedChild.grade})</p>
                  <p className="text-slate-200 font-bold text-sm mt-1">Total: $450.00 USD</p>
                </div>

                {feePaidSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-center font-bold">
                    ✓ Payment Successful! Receipt sent to sarah.vance@gmail.com
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayFee}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Confirm & Pay $450.00
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
