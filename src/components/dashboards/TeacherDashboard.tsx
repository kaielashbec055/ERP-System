import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MOCK_RISK_ALERTS } from '../../mockData/mockData';
import {
  Users,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  BookOpen,
  Send,
  Plus,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Calendar
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user, setActiveTab } = useApp();
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    std_101: 'present',
    std_102: 'absent',
    std_103: 'present',
    std_104: 'present',
    std_105: 'present',
    std_106: 'absent'
  });
  const [savedAttendance, setSavedAttendance] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

  const toggleAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSaveAttendance = () => {
    setSavedAttendance(true);
    setTimeout(() => setSavedAttendance(false), 2000);
  };

  const studentsList = [
    { id: 'std_101', name: 'Aarav Sharma', roll: '5A-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_102', name: 'Diya Patel', roll: '5A-02', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_103', name: 'Vivaan Singh', roll: '5A-03', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_104', name: 'Ananya Gupta', roll: '5A-04', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_105', name: 'Liam Hemsworth', roll: '5A-05', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_106', name: 'Daniel Park', roll: '5A-06', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl purple-gradient-hero text-white shadow-xl glow-purple flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-black flex items-center gap-1.5 w-fit border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Grade 5-A Educator • Mrs. Sharma
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Good Morning, Mrs. Sharma 👋</h1>
          <p className="text-purple-100 text-xs sm:text-sm font-medium">
            Class Overview: <strong className="text-white font-black">32 Enrolled Students</strong> • Average Score: <strong className="text-emerald-300 font-black">82% (+8%)</strong>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateAssignmentModal(true)}
          className="px-4.5 py-3 rounded-2xl bg-white hover:bg-purple-50 text-[#7C3AED] font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#7C3AED]" /> Create Homework Task
        </motion.button>
      </div>

      {/* Class Analytics & Attendance Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Class Attendance</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
              Today
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-black text-[#1E1B4B]">32</span>
            <span className="text-xs font-bold text-emerald-700">28 Present • 4 Absent</span>
          </div>
          <div className="w-full h-2 bg-purple-100 rounded-full mt-2 overflow-hidden flex">
            <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '87.5%' }}></div>
            <div className="h-full bg-rose-500 rounded-r-full" style={{ width: '12.5%' }}></div>
          </div>
        </div>

        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Class Analytics</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs">
              This Month
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#7C3AED]">82%</span>
            <span className="text-xs font-extrabold text-emerald-600">+8% Improvement</span>
          </div>
          <p className="text-xs text-purple-800 font-bold mt-1">Top Subject: Mathematics (93% avg)</p>
        </div>

        <div className="p-5 rounded-3xl clay-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700">Early Warning System</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs">
              3 Flags
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">3 Students Flagged</p>
          <p className="text-xs text-purple-800 font-bold mt-1">Requires Support & Counseling</p>
        </div>
      </div>

      {/* Attendance Marker Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl clay-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#1E1B4B] flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span>Grade 5-A Attendance Logger</span>
              </h3>
              <p className="text-xs text-purple-700 font-medium">May 28, 2025 • Morning Register</p>
            </div>

            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Register
            </button>
          </div>

          {savedAttendance && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl font-extrabold text-xs text-center">
              ✓ Attendance Logged & Synced to Parent Portal!
            </motion.div>
          )}

          <div className="divide-y divide-purple-100 bg-purple-50/40 rounded-2xl border border-purple-100 overflow-hidden">
            {studentsList.map((std) => {
              const status = attendance[std.id] || 'present';
              return (
                <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={std.avatar} alt={std.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-200" />
                    <div>
                      <h5 className="font-black text-xs text-[#1E1B4B]">{std.name}</h5>
                      <p className="text-[10px] font-bold text-purple-700">{std.roll}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['present', 'absent'].map((st) => (
                      <button
                        key={st}
                        onClick={() => toggleAttendance(std.id, st as any)}
                        className={`px-3.5 py-1 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                          status === st
                            ? st === 'present' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-rose-500 text-white shadow-xs'
                            : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Early Warning Column */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Struggling Student Flags</span>
            </h3>

            <div className="space-y-3 text-xs">
              {MOCK_RISK_ALERTS.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-rose-950">{alert.studentName}</h5>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                      {alert.riskType.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{alert.reason}</p>
                  <button
                    onClick={() => setActiveTab('communication')}
                    className="w-full py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Contact Parent (Priya Sharma)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showCreateAssignmentModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-purple-100 pb-3">
                <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#7C3AED]" />
                  <span>Create Homework Task</span>
                </h3>
                <button onClick={() => setShowCreateAssignmentModal(false)} className="text-purple-400 hover:text-purple-700 font-bold cursor-pointer">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Homework Title</label>
                  <input type="text" placeholder="e.g. Mathematics Multiplication Practice #4" className="w-full bg-purple-50/50 border border-purple-100 rounded-2xl p-3 text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED]" />
                </div>

                <button
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-extrabold rounded-2xl shadow-md cursor-pointer"
                >
                  Publish to Grade 5-A
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
