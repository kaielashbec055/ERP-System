import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MOCK_STUDENT_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_BADGES } from '../../mockData/mockData';
import {
  GraduationCap,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  Smile
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, setActiveTab, addMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>(['asg_02']);

  const handleMoodSubmit = (score: 1 | 2 | 3 | 4 | 5) => {
    setSelectedMood(score);
    addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      score,
      tags: ['Daily Check-in']
    });
  };

  const handleAssignmentSubmit = (id: string) => {
    if (!submittedAssignments.includes(id)) {
      setSubmittedAssignments(prev => [...prev, id]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-brand-500/20 p-6 md:p-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin-slow" /> Grade 10 - Section A
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-pulse">
                🔥 14 Day Streak!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              You are performing in the <span className="text-brand-300 font-bold">Top 5% of Grade 10</span>. Next class is <span className="text-white font-semibold">Advanced Physics</span> with Dr. Thorne at 10:15 AM.
            </p>
          </div>

          {/* Quick Mood Widget */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl w-full lg:w-auto shadow-xl">
            <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-brand-400" />
              <span>How are you feeling today?</span>
            </p>
            <div className="flex items-center gap-2">
              {[
                { score: 1, emoji: '😫', label: 'Stressed' },
                { score: 2, emoji: '😕', label: 'Tired' },
                { score: 3, emoji: '😐', label: 'Okay' },
                { score: 4, emoji: '😊', label: 'Good' },
                { score: 5, emoji: '🚀', label: 'Great' }
              ].map((m) => (
                <motion.button
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  key={m.score}
                  onClick={() => handleMoodSubmit(m.score as any)}
                  className={`p-2 rounded-xl text-xl transition-all ${
                    selectedMood === m.score ? 'bg-brand-500/30 ring-2 ring-brand-400' : 'bg-slate-800/80 hover:bg-slate-700'
                  }`}
                  title={m.label}
                >
                  {m.emoji}
                </motion.button>
              ))}
            </div>
            {selectedMood && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-400 font-semibold mt-1.5">
                ✓ Mood logged confidentially in Wellness Portal!
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Key Metric Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Current GPA', val: '3.88', sub: '+0.12 from last term', color: 'text-brand-400', icon: <GraduationCap className="w-5 h-5" />, bg: 'bg-brand-500/20' },
          { title: 'Attendance', val: '97.5%', sub: '60 of 62 Days Present', color: 'text-emerald-400', icon: <Clock className="w-5 h-5" />, bg: 'bg-emerald-500/20' },
          { title: 'Pending Tasks', val: '3 Assignments', sub: '1 High Priority Due Soon', color: 'text-amber-400', icon: <BookOpen className="w-5 h-5" />, bg: 'bg-amber-500/20' },
          { title: 'Badges Earned', val: '4 Unlocked', sub: 'Level 4 Scholar', color: 'text-cyan-400', icon: <Award className="w-5 h-5" />, bg: 'bg-cyan-500/20' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 glass-card transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-black text-white mt-2">{stat.val}</p>
            <p className={`text-[11px] font-semibold mt-1 ${stat.color}`}>{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-400" />
                  <span>Subject Performance Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">Real-time grades & last test scores</p>
              </div>
              <button
                onClick={() => setActiveTab('academics')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MOCK_STUDENT_SUBJECTS.map((subj) => (
                <motion.div
                  key={subj.subject}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-brand-500/40 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-xs text-slate-200">{subj.subject}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                      subj.grade.startsWith('A') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    }`}>
                      {subj.grade} ({subj.score}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subj.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full"
                    ></motion.div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Teacher: {subj.teacher}</span>
                    <span>Last: {subj.lastTestScore}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gamified Achievements Banner */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>Unlocked Achievements & Gamification</span>
              </h3>
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                1,450 XP Points
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOCK_BADGES.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2 group hover:border-amber-500/40 transition-all shadow-md"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-xs text-slate-200">{b.title}</h5>
                  <p className="text-[10px] text-slate-400 leading-tight">{b.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 glass-panel space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>Assignments & Exams</span>
              </h3>
              <span className="text-[11px] text-slate-400">3 Pending</span>
            </div>

            <div className="space-y-3">
              {MOCK_ASSIGNMENTS.map((asg) => {
                const isDone = submittedAssignments.includes(asg.id);
                return (
                  <motion.div
                    key={asg.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                          {asg.subject}
                        </span>
                        <h4 className="font-bold text-xs text-slate-200 mt-1">{asg.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        asg.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        Due {asg.dueDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                      <span className="text-slate-400 text-[11px]">Max: {asg.maxScore} pts</span>
                      {isDone ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                        </span>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAssignmentSubmit(asg.id)}
                          className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-bold transition-all shadow-md"
                        >
                          Submit Work
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
