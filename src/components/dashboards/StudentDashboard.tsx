import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MOCK_STUDENT_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_BADGES } from '../../mockData/mockData';
import { SubjectGrade, Assignment } from '../../types';
import { getStudentSubjectsApi, getStudentAssignmentsApi, submitAssignmentApi } from '../../services/api';
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
  Smile,
  Flame,
  Bus,
  MapPin,
  CheckSquare,
  Trophy,
  ArrowRight,
  Bot
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, setActiveTab, addMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(4); // Happy by default
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>(['asg_02']);
  const [subjects, setSubjects] = useState<SubjectGrade[]>(MOCK_STUDENT_SUBJECTS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const subList = await getStudentSubjectsApi();
        if (subList && subList.length > 0) setSubjects(subList);

        const asgList = await getStudentAssignmentsApi();
        if (asgList && asgList.length > 0) setAssignments(asgList);
      } catch (e) {
        console.log('[StudentDashboard] Using local state fallback');
      }
    }
    loadStudentData();
  }, []);

  const handleMoodSubmit = (score: 1 | 2 | 3 | 4 | 5) => {
    setSelectedMood(score);
    addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      score,
      tags: ['Daily Check-in']
    });
  };

  const handleAssignmentSubmit = async (id: string) => {
    if (!submittedAssignments.includes(id)) {
      setSubmittedAssignments(prev => [...prev, id]);
      await submitAssignmentApi(id);
    }
  };

  const todaySchedule = [
    { title: 'Math', time: '09:00 AM - 10:00 AM', room: 'Room 201', icon: '📐', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'Science', time: '10:15 AM - 11:15 AM', room: 'Room 305', icon: '🧪', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'English', time: '11:30 AM - 12:30 PM', room: 'Room 102', icon: '📚', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: 'Art & Craft', time: '01:30 PM - 02:30 PM', room: 'Room 204', icon: '🎨', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
    { title: 'History', time: '03:00 PM - 04:00 PM', room: 'Room 101', icon: '🏛️', bg: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

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
      {/* Top Welcome & XP Level Progress Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl purple-gradient-hero p-6 md:p-8 text-white shadow-xl glow-purple"
      >
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-black flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" /> Class 5-A • Aarav Sharma
              </span>
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 backdrop-blur-md text-xs font-black border border-amber-300/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> 7 Day Streak!
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Good Morning, Aarav! 👋
            </h1>

            {/* XP Level Progress Bar */}
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-purple-100">
                <span>Level 5 Little Learner</span>
                <span>450 / 900 XP</span>
              </div>
              <div className="w-full h-3 bg-black/20 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/30">
                <div className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 rounded-full transition-all duration-1000 shadow-sm" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Quick Mood Selector Card */}
          <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl text-[#1E1B4B] shadow-xl border border-white/60 w-full lg:w-72">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black flex items-center gap-1.5 text-purple-900">
                <Smile className="w-4 h-4 text-[#7C3AED]" />
                <span>How are you feeling?</span>
              </p>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">7 Days Streak</span>
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {[
                { score: 1, emoji: '😞', label: 'Sad' },
                { score: 3, emoji: '😐', label: 'Okay' },
                { score: 4, emoji: '😊', label: 'Happy' }
              ].map((m) => (
                <button
                  key={m.score}
                  onClick={() => handleMoodSubmit(m.score as any)}
                  className={`flex-1 py-2 rounded-2xl text-xl flex flex-col items-center transition-all cursor-pointer ${
                    selectedMood === m.score ? 'bg-purple-100 ring-2 ring-[#7C3AED] scale-105' : 'bg-purple-50/50 hover:bg-purple-100/70'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span className="text-[9px] font-extrabold text-purple-900 mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Overview Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl clay-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] border border-purple-200 flex items-center justify-center text-xl font-extrabold">
            📚
          </div>
          <div>
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block">Homework</span>
            <span className="text-xl font-black text-[#1E1B4B]">3 Pending</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl clay-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl font-extrabold">
            ✅
          </div>
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">Attendance</span>
            <span className="text-xl font-black text-[#1E1B4B]">95% Present</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl clay-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-xl font-extrabold">
            🎯
          </div>
          <div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">Daily Goal</span>
            <span className="text-xl font-black text-[#1E1B4B]">2 / 5 Tasks Done</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Today's Schedule & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1E1B4B] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#7C3AED]" />
                  <span>Today's Schedule</span>
                </h3>
                <p className="text-xs text-purple-700 font-medium">28 May, Tuesday • Class 5-A</p>
              </div>
              <button
                onClick={() => setActiveTab('academics')}
                className="text-xs font-extrabold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {todaySchedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-lg font-bold ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#1E1B4B]">{item.title}</h4>
                      <p className="text-xs text-purple-800 font-bold">{item.time}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white text-purple-800 border border-purple-200 text-xs font-extrabold">
                    {item.room}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gamified Quests & AI Doubt Assistant Launcher */}
          <div className="p-6 rounded-3xl clay-card space-y-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="font-black text-base text-[#1E1B4B]">Current Quest & AI Buddy</h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-200 text-[#7C3AED]">
                +100 XP Reward
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <h4 className="font-black text-xs text-[#1E1B4B]">Complete 3 Math Homework Quizzes</h4>
                <p className="text-xs text-purple-800 font-medium">Progress: 2/3 completed</p>
              </div>

              <button
                onClick={() => setActiveTab('games')}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Play Quest Game</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Live Bus Tracking & Homework Tasks */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Live Bus Tracking Telemetry Widget */}
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1E1B4B] flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>Bus Telemetry Tracker</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                BUS ON THE WAY
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900">School Bus KA 09 AB 1234</span>
                <MapPin className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-200/80">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">ETA</span>
                  <span className="text-sm font-black text-emerald-950">10 min</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Distance</span>
                  <span className="text-sm font-black text-emerald-950">2.5 km</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Speed</span>
                  <span className="text-sm font-black text-emerald-950">28 km/h</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('bus')}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Live Map Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pending Homework */}
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1E1B4B]">Homework Checklist</h3>
              <span className="text-[11px] font-bold text-purple-700">3 Tasks Left</span>
            </div>

            <div className="space-y-2.5">
              {assignments.map((asg) => {
                const isDone = submittedAssignments.includes(asg.id);
                return (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-black text-xs text-[#1E1B4B]">{asg.title}</h4>
                      <p className="text-[10px] text-purple-700 font-bold">Due {asg.dueDate}</p>
                    </div>

                    {isDone ? (
                      <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-100 px-2.5 py-1 rounded-full">
                        Done ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAssignmentSubmit(asg.id)}
                        className="px-3 py-1 rounded-xl bg-[#7C3AED] text-white text-[10px] font-extrabold cursor-pointer"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
