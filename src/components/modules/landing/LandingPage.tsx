import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';
import {
  Sparkles,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  School,
  User,
  ArrowRight,
  CheckCircle2,
  Bus,
  Activity,
  Zap,
  BarChart3,
  MessageSquare,
  MapPin,
  UserPlus,
  LogIn,
  ShieldAlert,
  Clock,
  QrCode,
  Smile,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRole, setIsLandingPage, openAuthModal } = useApp();
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'wellness' | 'transport' | 'academics' | 'sos'>('wellness');

  const handleLaunchRole = (role: UserRole) => {
    openAuthModal('signin', role);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF] text-[#1E1B4B] overflow-x-hidden selection:bg-[#7C3AED] selection:text-white font-sans">
      {/* Background Soft Purple Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-400/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-indigo-400/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-pink-400/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Hero Header Navbar */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#C084FC] p-0.5 shadow-md shadow-purple-500/20"
          >
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#7C3AED] animate-pulse" />
            </div>
          </motion.div>
          <div>
            <span className="font-black text-2xl tracking-tight text-[#1E1B4B]">
              EduSync<span className="text-[#7C3AED]"> AI</span>
            </span>
            <p className="text-[10px] text-purple-700 font-extrabold -mt-1 tracking-wider uppercase">Every Child. Every Moment. Connected.</p>
          </div>
        </div>

        {/* Top Navbar Actions: Sign In & Sign Up */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-[#1E1B4B] border border-purple-100 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Sign In</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAuthModal('signup')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white text-xs font-extrabold shadow-md glow-purple transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up Free</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-7xl mx-auto px-6 pt-8 pb-16 text-center space-y-8"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200 text-[#7C3AED] text-xs font-extrabold shadow-xs">
          <Sparkles className="w-4 h-4 text-[#7C3AED] animate-spin-slow" />
          <span>EDUSYNC AI ECOSYSTEM • SMART LEARNING, SAFETY & WELLBEING</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1E1B4B] max-w-5xl mx-auto leading-[1.1]">
          Connected Learning & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] bg-clip-text text-transparent">
            Smart School Ecosystem
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-purple-900/80 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
          Empowering students with level-up learning quests, AI Study Buddies, live bus GPS tracking, digital gate passes, and 24/7 mental wellness care.
        </motion.p>

        {/* Action Buttons: Sign Up & Persona Live Demo */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAuthModal('signup')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-extrabold text-sm shadow-lg glow-purple transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up for Free</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            onClick={() => openAuthModal('signin')}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-purple-50 text-[#1E1B4B] border border-purple-200 font-extrabold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#7C3AED]" />
            <span>Sign In to Account</span>
          </button>
        </motion.div>

        {/* Quick Persona Launch Buttons */}
        <motion.div variants={itemVariants} className="pt-4 space-y-3">
          <p className="text-xs font-extrabold text-purple-600 uppercase tracking-wider">Select persona to test live portal:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { role: 'student', label: 'Student Portal (Level 5 Learner)', icon: <GraduationCap className="w-4 h-4 text-[#7C3AED]" /> },
              { role: 'parent', label: 'Parent Portal (Priya Sharma)', icon: <User className="w-4 h-4 text-emerald-600" /> },
              { role: 'teacher', label: 'Educator Desk (Mrs. Sharma)', icon: <ShieldCheck className="w-4 h-4 text-[#9333EA]" /> },
              { role: 'admin', label: 'Admin Command', icon: <School className="w-4 h-4 text-amber-600" /> }
            ].map((item) => (
              <motion.button
                key={item.role}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLaunchRole(item.role as UserRole)}
                className="px-4.5 py-2.5 rounded-2xl bg-white border border-purple-200 text-[#1E1B4B] hover:border-purple-400 font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {item.icon}
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-purple-400" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics Row */}
        <motion.div variants={itemVariants} className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { val: '1,240+', sub: 'Active Students Monitored', color: 'text-[#1E1B4B]' },
            { val: '99.8%', sub: 'Transport Safety & On-Time', color: 'text-emerald-600' },
            { val: '100%', sub: 'Parent-School Connectivity', color: 'text-[#7C3AED]' },
            { val: '4.9 / 5', sub: 'Mental Wellness Score', color: 'text-[#9333EA]' }
          ].map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-5 rounded-3xl clay-card transition-all text-center"
            >
              <h3 className={`text-3xl font-black ${m.color}`}>{m.val}</h3>
              <p className="text-xs text-purple-800/80 font-bold mt-1">{m.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Feature Interactive Showcase Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-[#4F7CFF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Pillars of Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Four Core Pillars Built for Modern Schools
          </h2>
        </div>

        {/* Showcase Feature Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { key: 'wellness', label: 'Mental Wellness', icon: <HeartPulse className="w-4 h-4" /> },
            { key: 'transport', label: 'Live Bus Tracking', icon: <Bus className="w-4 h-4" /> },
            { key: 'academics', label: 'Academic AI Risk', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'sos', label: 'Emergency Panic SOS', icon: <ShieldAlert className="w-4 h-4" /> }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveShowcaseTab(t.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeShowcaseTab === t.key
                  ? 'bg-[#4F7CFF] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Showcase Display Card */}
        <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
          {activeShowcaseTab === 'wellness' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-purple-50 text-[#8B5CF6] border border-purple-200 text-xs font-extrabold">
                  Mental Health & Confidential Check-Ins
                </span>
                <h3 className="text-2xl font-black text-[#1E293B]">AI-Powered Sentiment & Stress Detection</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Students log confidential mood check-ins. If continuous stress is detected, the AI Guidance engine quietly alerts counselors and suggests 4-7-8 breathing exercises.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <Smile className="w-12 h-12 text-[#8B5CF6] mx-auto animate-bounce" />
                <h4 className="font-extrabold text-sm text-[#1E293B]">Interactive Mood Tracker & Counselor Desk</h4>
                <p className="text-xs text-slate-500 font-medium">Encrypted 1-on-1 counselor chat and instant crisis hotline integration.</p>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'transport' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-extrabold">
                  Live Transport Safety
                </span>
                <h3 className="text-2xl font-black text-[#1E293B]">Live GPS School Bus Tracking</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Google Maps vector integration with live bus marker movement, precise ETA calculation, geofencing safe zones, and instant driver calling.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <Bus className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <h4 className="font-extrabold text-sm text-[#1E293B]">Live GPS Corridor Active</h4>
                <p className="text-xs text-slate-500 font-medium">BUS-14 • ETA 8 mins • Driver Robert Jenkins</p>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'academics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#4F7CFF] border border-blue-200 text-xs font-extrabold">
                  Academic Excellence
                </span>
                <h3 className="text-2xl font-black text-[#1E293B]">Subject Performance & Early Warning Flags</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Real-time grade analytics, gamified XP badges, and automated AI flags alerting educators if a student needs extra academic support.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <BarChart3 className="w-12 h-12 text-[#4F7CFF] mx-auto" />
                <h4 className="font-extrabold text-sm text-[#1E293B]">97.5% Average Attendance</h4>
                <p className="text-xs text-slate-500 font-medium">4 Badges Unlocked • Level 4 Scholar</p>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'sos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold">
                  Emergency Panic Protocol
                </span>
                <h3 className="text-2xl font-black text-[#1E293B]">One-Touch Emergency SOS Panic Broadcast</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Instant campus panic alert system triggering notifications to security, emergency services, and parents in seconds.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4">
                <ShieldAlert className="w-12 h-12 text-[#EF4444] mx-auto animate-bounce" />
                <h4 className="font-extrabold text-sm text-rose-800">Campus SOS Terminal Ready</h4>
                <p className="text-xs text-slate-600 font-medium">Medical, Lockdown, Weather & Fire Alarm Triggers</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Stakeholders Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-[#4F7CFF] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Tailored Dashboards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
            Empowering Every Role in Your School
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Student Portal', role: 'student', icon: <GraduationCap className="w-6 h-6" />, color: 'text-[#4F7CFF] bg-blue-50 border border-blue-200', desc: 'Grade tracking, assignment timers, AI study assistant, and anonymous wellness pulse.' },
            { title: 'Parent Portal', role: 'parent', icon: <User className="w-6 h-6" />, color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', desc: 'Live GPS bus tracking, digital gate pass pickup codes, fee payment portal, and direct teacher chat.' },
            { title: 'Teacher Dashboard', role: 'teacher', icon: <ShieldCheck className="w-6 h-6" />, color: 'text-[#8B5CF6] bg-purple-50 border border-purple-200', desc: 'AI Early Warning flags, attendance logger, gradebook generator, and student wellness tracker.' },
            { title: 'Admin Command', role: 'admin', icon: <School className="w-6 h-6" />, color: 'text-amber-700 bg-amber-50 border border-amber-200', desc: 'Campus health metrics, fleet transport tracker, Emergency SOS terminal, and master announcements.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleLaunchRole(item.role as UserRole)}
              className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center font-bold transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <h4 className="font-extrabold text-base text-[#1E293B] group-hover:text-[#4F7CFF] transition-colors flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#4F7CFF]" />
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-12">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl text-center space-y-6 text-white relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black max-w-3xl mx-auto leading-tight">
            Ready to Elevate Your School Experience?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Create an institutional account or request a demo today. Connect your students, parents, and educators in minutes.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuthModal('signup')}
              className="px-8 py-4 rounded-2xl bg-white text-[#4F7CFF] font-extrabold text-sm shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up for Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button
              onClick={() => openAuthModal('signin')}
              className="px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 font-extrabold text-sm transition-all cursor-pointer"
            >
              Sign In Existing User
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-200 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#4F7CFF] animate-pulse" />
          <span className="font-extrabold text-[#1E293B]">EduPulse AI System</span>
          <span>© 2026 Smart School Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleLaunchRole('student')} className="hover:text-[#1E293B] cursor-pointer">Student View</button>
          <button onClick={() => handleLaunchRole('parent')} className="hover:text-[#1E293B] cursor-pointer">Parent View</button>
          <button onClick={() => handleLaunchRole('teacher')} className="hover:text-[#1E293B] cursor-pointer">Educator View</button>
          <button onClick={() => handleLaunchRole('admin')} className="hover:text-[#1E293B] cursor-pointer">Admin View</button>
          <button onClick={() => openAuthModal('signup')} className="text-[#4F7CFF] font-extrabold hover:underline cursor-pointer">Sign Up</button>
        </div>
      </footer>
    </div>
  );
};
