import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getParentChildrenApi } from '../../services/api';
import { ChildInfo } from '../../types';
import {
  Bus,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Shield,
  DollarSign,
  Smile,
  Calendar,
  AlertCircle,
  Activity,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user, selectedChild, setSelectedChild, childrenList, setActiveTab } = useApp();
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feePaidSuccess, setFeePaidSuccess] = useState(false);
  const [children, setChildren] = useState<ChildInfo[]>(childrenList);

  useEffect(() => {
    async function loadChildren() {
      try {
        const list = await getParentChildrenApi();
        if (list && list.length > 0) {
          setChildren(list);
          setSelectedChild(list[0]);
        }
      } catch (e) {
        console.log('[ParentDashboard] Local fallback active');
      }
    }
    loadChildren();
  }, []);

  const handlePayFee = () => {
    setFeePaidSuccess(true);
    setTimeout(() => {
      setShowFeeModal(false);
      setFeePaidSuccess(false);
    }, 1500);
  };

  const childTimeline = [
    { time: '08:15 AM', title: 'Reached School', desc: 'Gate Pass QR scanned at Main Entrance', icon: '🏫', color: 'bg-emerald-100 text-emerald-800' },
    { time: '10:30 AM', title: 'Math Homework Submitted', desc: 'Problem Set #4 scored 100%', icon: '📐', color: 'bg-purple-100 text-[#7C3AED]' },
    { time: '01:15 PM', title: 'Science Quiz Completed', desc: 'Score: 92% (Exceeds expectations)', icon: '🧪', color: 'bg-blue-100 text-blue-800' },
    { time: '03:30 PM', title: 'Bus Boarded', desc: 'School Bus KA 09 AB 1234 departed campus', icon: '🚌', color: 'bg-amber-100 text-amber-800' },
    { time: '04:05 PM', title: 'Reached Home', desc: 'Parent notification confirmed at Vance Stop', icon: '🏠', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Parent Header & Child Switcher */}
      <div className="p-6 md:p-8 rounded-3xl purple-gradient-hero text-white shadow-xl glow-purple flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-black flex items-center gap-1.5 w-fit border border-white/20">
            <Shield className="w-3.5 h-3.5 text-amber-300" /> Parent Portal • Priya Sharma
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Good Morning, Priya Sharma 👋</h1>
          <p className="text-purple-100 text-xs sm:text-sm font-medium max-w-xl">
            Real-time telemetry for <strong className="text-white font-extrabold">{selectedChild.name} ({selectedChild.grade})</strong>.
          </p>
        </div>

        {/* Multi-Child Selector Tabs */}
        <div className="flex items-center gap-2 bg-white/95 p-2 rounded-2xl border border-white/40 backdrop-blur-md shadow-md">
          <span className="text-xs text-purple-900 font-extrabold px-2">Child:</span>
          {childrenList.map((child) => (
            <motion.button
              key={child.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedChild.id === child.id
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-sm'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              <img src={child.avatar} alt={child.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-white" />
              <span>{child.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Child Today's Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Attendance</span>
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-xs">
              95%
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E1B4B] mt-2">Present Today</p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">✓ On-Time Arrival 08:15 AM</p>
        </div>

        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Homework</span>
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700 font-bold text-xs">
              3 Tasks
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E1B4B] mt-2">3 Pending</p>
          <p className="text-[11px] text-amber-700 font-bold mt-1">Due 28 May</p>
        </div>

        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Child's Mood</span>
            <div className="p-2 rounded-2xl bg-purple-100 text-[#7C3AED] font-bold text-xs">
              😊 Happy
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E1B4B] mt-2">Feeling Happy</p>
          <p className="text-[11px] text-purple-700 font-bold mt-1">Reported 08:15 AM</p>
        </div>

        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Term Fee</span>
            <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-xs">
              $450
            </div>
          </div>
          <p className="text-2xl font-black text-[#1E1B4B] mt-2">$450 Due</p>
          <p className="text-[11px] text-indigo-700 font-bold mt-1">Term II Tuition</p>
        </div>
      </div>

      {/* Main Split: Timeline & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Daily Timeline */}
        <div className="lg:col-span-2 p-6 rounded-3xl clay-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#1E1B4B] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#7C3AED]" />
                <span>Aarav's Daily Timeline</span>
              </h3>
              <p className="text-xs text-purple-700 font-medium">20 May, 2025 • Real-time telemetry feed</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {childTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-base font-bold ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-[#1E1B4B]">{item.title}</h4>
                    <p className="text-[11px] text-purple-800 font-medium">{item.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-purple-900 bg-white px-3 py-1 rounded-full border border-purple-200">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Learning Progress Insights */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
              <span>Learning Insights</span>
            </h3>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">Overall Progress</span>
              <h4 className="font-black text-base text-[#1E1B4B]">Great Progress! 📈</h4>
              <p className="text-xs text-purple-900 font-medium">Aarav has improved <strong className="text-[#7C3AED]">18%</strong> in Mathematics this month.</p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="font-black text-emerald-900 block">Strengths:</span>
                <span className="text-emerald-800 font-bold">Math, Reading & Physics</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="font-black text-amber-900 block">Needs Attention:</span>
                <span className="text-amber-800 font-bold">Science Lab Projects</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-extrabold text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Class Educator (Mrs. Sharma)</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
