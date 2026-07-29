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
  CheckCircle2
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user, setActiveTab } = useApp();
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    std_101: 'present',
    std_102: 'absent',
    std_103: 'present',
    std_104: 'present',
    std_105: 'present',
    std_106: 'late'
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
    { id: 'std_101', name: 'Alex Vance', roll: '10A-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_102', name: 'Liam Hemsworth', roll: '10A-02', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_103', name: 'Sophia Chen', roll: '10A-03', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_104', name: 'Marcus Brody', roll: '10A-04', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_105', name: 'Chloe Bennett', roll: '10A-05', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
    { id: 'std_106', name: 'Daniel Park', roll: '10A-06', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Educator Portal • Grade 10 Physics & STEM
          </span>
          <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}</h1>
          <p className="text-slate-300 text-xs mt-1">
            28 Enrolled Students • Class Average: 89.4% • 3 AI Early Warning Flags Raised
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateAssignmentModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Assignment
        </motion.button>
      </div>

      {/* High-Risk AI Early Warning System Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>AI Early Warning System (Struggling & Stress Detection)</span>
            </h3>
            <p className="text-xs text-slate-400">Automated machine learning risk flags based on grades, attendance, and sentiment check-ins.</p>
          </div>
          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold animate-pulse">
            3 High Priority Action Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_RISK_ALERTS.map((alert) => (
            <motion.div
              key={alert.id}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3 relative hover:border-rose-500/60 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <img src={alert.avatar} alt={alert.studentName} className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/50" />
                <div>
                  <h4 className="font-bold text-xs text-white">{alert.studentName}</h4>
                  <span className="text-[10px] text-slate-400">{alert.grade}</span>
                </div>
                <span className={`ml-auto text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  alert.riskType === 'academic' ? 'bg-amber-500/20 text-amber-400' :
                  alert.riskType === 'wellness' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {alert.riskType} Risk
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                "{alert.reason}"
              </p>

              <div className="p-2.5 rounded-xl bg-brand-950/40 border border-brand-500/20 text-[11px] text-brand-300">
                <strong className="text-brand-400 font-bold block mb-0.5">AI Recommendation:</strong>
                {alert.aiRecommendation}
              </div>

              <div className="flex items-center justify-between pt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('communication')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-brand-400" /> Contact Parent
                </motion.button>
                <span className="text-[10px] text-slate-500">Flagged {alert.dateFlagged}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Attendance Marker Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <span>Class 10-A Attendance Marker</span>
              </h3>
              <p className="text-xs text-slate-400">July 29, 2026 • Period 2 Advanced Physics</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveAttendance}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Attendance Log
            </motion.button>
          </div>

          {savedAttendance && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs text-center">
              ✓ Class Attendance Saved & Synced with Parent Portal!
            </motion.div>
          )}

          <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            {studentsList.map((std) => {
              const status = attendance[std.id] || 'present';
              return (
                <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-200">{std.name}</h5>
                      <p className="text-[10px] text-slate-400">{std.roll}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {['present', 'absent', 'late'].map((st) => (
                      <motion.button
                        key={st}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleAttendance(std.id, st as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                          status === st
                            ? st === 'present' ? 'bg-emerald-500 text-slate-950' : st === 'absent' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {st}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <span>Class Metrics</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Total Enrolled:</span>
                <span className="font-bold text-slate-200">28 Students</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Average Grade:</span>
                <span className="font-bold text-emerald-400">89.4% (Grade A-)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                <span className="text-slate-400">Submission Rate:</span>
                <span className="font-bold text-brand-400">96.2% on time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showCreateAssignmentModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>Create New Assignment</span>
                </h3>
                <button onClick={() => setShowCreateAssignmentModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Assignment Title</label>
                  <input type="text" placeholder="e.g. Thermodynamics Problem Set #5" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>

                <button
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Publish Assignment to Class 10-A
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
