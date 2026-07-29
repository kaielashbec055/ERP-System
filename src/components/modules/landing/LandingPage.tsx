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
    setRole(role);
    setIsLandingPage(false);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Decorative Glow Circles */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>

      {/* Hero Header Navbar */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-cyan-400 to-emerald-400 p-0.5 shadow-xl shadow-brand-500/20"
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-brand-400 animate-pulse" />
            </div>
          </motion.div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            EduPulse<span className="text-brand-400">.AI</span>
          </span>
        </div>

        {/* Top Navbar Actions: Sign In & Sign Up */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuthModal('signin')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign In</span>
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAuthModal('signup')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-400 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-7xl mx-auto px-6 pt-10 pb-16 text-center space-y-8"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-extrabold shadow-lg shadow-brand-500/10">
          <Sparkles className="w-4 h-4 text-brand-400 animate-spin-slow" />
          <span>SMART STUDENT ECOSYSTEM • ACADEMICS, SAFETY & WELLBEING</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          The Intelligent Platform for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Student Wellness, Safety & Academics
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          Unifying academic tracking, live bus GPS safety, instant digital gate passes, and AI-powered mental wellness monitoring into one cohesive institution network.
        </motion.p>

        {/* Action Buttons: Sign Up & Persona Live Demo */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAuthModal('signup')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-400 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 transition-all flex items-center gap-2.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up Free</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            onClick={() => openAuthModal('signin')}
            className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
          >
            <LogIn className="w-4 h-4 text-brand-400" />
            <span>Sign In to Account</span>
          </button>
        </motion.div>

        {/* Quick Persona Launch Buttons */}
        <motion.div variants={itemVariants} className="pt-4 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or explore role-specific live dashboards directly:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { role: 'student', label: 'Student Dashboard', color: 'from-blue-600 to-cyan-500', icon: <GraduationCap className="w-4 h-4" /> },
              { role: 'parent', label: 'Parent Portal', color: 'from-emerald-600 to-teal-500', icon: <User className="w-4 h-4" /> },
              { role: 'teacher', label: 'Educator Analytics', color: 'from-purple-600 to-indigo-500', icon: <ShieldCheck className="w-4 h-4" /> },
              { role: 'admin', label: 'Admin Command', color: 'from-amber-600 to-rose-500', icon: <School className="w-4 h-4" /> }
            ].map((item) => (
              <motion.button
                key={item.role}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLaunchRole(item.role as UserRole)}
                className={`px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-bold text-xs shadow-md transition-all flex items-center gap-2`}
              >
                {item.icon}
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics Row */}
        <motion.div variants={itemVariants} className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { val: '1,240+', sub: 'Active Students Monitored', color: 'text-white' },
            { val: '99.8%', sub: 'Transport Safety & On-Time', color: 'text-emerald-400' },
            { val: '100%', sub: 'Parent-School Connectivity', color: 'text-brand-400' },
            { val: '4.9 / 5', sub: 'Mental Wellness Support Score', color: 'text-cyan-400' }
          ].map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 glass-card shadow-lg transition-all text-center"
            >
              <h3 className={`text-3xl font-black ${m.color}`}>{m.val}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">{m.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Interactive Platform Feature Showcase (REPLACING OLD FRAGMENTED APPS BOX) */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-extrabold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Unified Ecosystem Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Everything Your School Needs in One AI Hub
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Say goodbye to multiple disconnected apps. EduPulse seamlessly merges student wellbeing, safety, academics, and parent communication into one smooth experience.
          </p>
        </div>

        {/* Tab Navigation for Interactive Showcase */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 max-w-3xl mx-auto">
          {[
            { id: 'wellness', label: 'Mental Wellness Radar', icon: <Smile className="w-4 h-4" /> },
            { id: 'transport', label: 'Live Bus & Gate Pass', icon: <Bus className="w-4 h-4" /> },
            { id: 'academics', label: 'Predictive Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'sos', label: 'Emergency SOS Broadcast', icon: <ShieldAlert className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveShowcaseTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeShowcaseTab === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Feature Display Card */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeShowcaseTab === 'wellness' && (
              <motion.div
                key="wellness"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-card shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">AI Mental Wellness Pulse Radar</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Provides students with a safe, anonymous daily mood check-in. The system analyzes micro-trends in sentiment and alerts institution counselors early before stress turns into burnout.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>100% Anonymous student mood logs with emoji pulse cards</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Predictive sentiment trend charts for school counselors</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Confidential stress flags with automated wellness tips</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleLaunchRole('student')}
                    className="pt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                  >
                    <span>Try Wellness Check-in Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300">Daily Class Sentiment (Live)</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      94% Positive Pulse
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Energized & Focused', pct: 65, color: 'bg-emerald-500' },
                      { label: 'Moderate Stress / Exams', pct: 23, color: 'bg-amber-500' },
                      { label: 'Needs Support', pct: 12, color: 'bg-rose-500' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                          <span>{item.label}</span>
                          <span>{item.pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeShowcaseTab === 'transport' && (
              <motion.div
                key="transport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-card shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Bus className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Live School Bus GPS & Digital Gate Pass</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Parents can track school buses in real-time on live maps with accurate ETA notifications, while security guards verify student pickup permissions via instant encrypted QR codes.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Live GPS bus location with geofenced arrival alerts</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Instant digital gate pass generation with QR code</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Parent pickup confirmation and driver contact directory</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleLaunchRole('parent')}
                    className="pt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                  >
                    <span>View Parent Bus Tracker Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">Bus #14 - North Route</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      En Route (ETA 4 min)
                    </span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-brand-400">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">Digital Gate Pass #GP-8841</p>
                      <p className="text-[11px] text-slate-400">Student: Alex Vance (Grade 10-A)</p>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded inline-block">
                        Verified & Approved
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeShowcaseTab === 'academics' && (
              <motion.div
                key="academics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-card shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">AI Early Warning & Academic Tutor</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automatically highlights struggling students so educators can provide targeted academic support before term exams, paired with an AI study companion.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>AI Early Risk Detection flags for teachers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Interactive GPA progression and skill mastery breakdown</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>24/7 Floating AI Study Assistant for assignment help</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleLaunchRole('teacher')}
                    className="pt-2 text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5"
                  >
                    <span>Explore Educator Analytics Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-300">Academic Mastery Radar</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      GPA 3.8 / 4.0
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Physics & Math</p>
                      <p className="text-lg font-black text-emerald-400">96.5%</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400">Computer Science</p>
                      <p className="text-lg font-black text-brand-400">98.0%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeShowcaseTab === 'sos' && (
              <motion.div
                key="sos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 glass-card shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">Emergency SOS & Campus Broadcast</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    One-tap panic trigger instantly alerts campus security, parents, and local emergency personnel with exact GPS coordinates during crisis events.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>One-tap Emergency SOS trigger available on all screens</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Instant SMS & App notifications to parents & faculty</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Real-time location dispatch to campus safety command</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleLaunchRole('admin')}
                    className="pt-2 text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
                  >
                    <span>View Admin SOS Command Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 bg-slate-950 p-6 rounded-2xl border border-rose-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span className="text-xs font-bold text-rose-400">Campus Emergency Terminal</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                      Ready 24/7
                    </span>
                  </div>
                  <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/30 text-center space-y-2">
                    <p className="text-xs font-bold text-white">Instant Panic Dispatch Ready</p>
                    <p className="text-[11px] text-slate-300">Broadcasts instant push alerts to 1,240 parent phones simultaneously.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Core Stakeholders Section */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Tailored Dashboards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Empowering Every Role in Your School
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Student Portal', role: 'student', icon: <GraduationCap className="w-6 h-6" />, color: 'text-brand-400 bg-brand-500/20', desc: 'Grade tracking, assignment timers, AI study assistant, and anonymous wellness pulse.' },
            { title: 'Parent Portal', role: 'parent', icon: <User className="w-6 h-6" />, color: 'text-emerald-400 bg-emerald-500/20', desc: 'Live GPS bus tracking, digital gate pass pickup codes, fee payment portal, and direct teacher chat.' },
            { title: 'Teacher Dashboard', role: 'teacher', icon: <ShieldCheck className="w-6 h-6" />, color: 'text-purple-400 bg-purple-500/20', desc: 'AI Early Warning flags, attendance logger, gradebook generator, and student wellness tracker.' },
            { title: 'Admin Command', role: 'admin', icon: <School className="w-6 h-6" />, color: 'text-amber-400 bg-amber-500/20', desc: 'Campus health metrics, fleet transport tracker, Emergency SOS terminal, and master announcements.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => handleLaunchRole(item.role as UserRole)}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-card space-y-4 shadow-xl transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center font-bold transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-brand-400 transition-colors flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 py-12">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-cyan-900/60 border border-brand-500/30 glass-panel shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
            Ready to Elevate Your School Experience?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create an institutional account or request a demo today. Connect your students, parents, and educators in minutes.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuthModal('signup')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 transition-all flex items-center gap-2.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up for Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button
              onClick={() => openAuthModal('signin')}
              className="px-8 py-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-700 hover:border-slate-500 font-bold text-sm transition-all"
            >
              Sign In Existing User
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-brand-400 animate-pulse" />
          <span className="font-bold text-slate-200">EduPulse AI System</span>
          <span>© 2026 Smart School Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleLaunchRole('student')} className="hover:text-white transition-colors">Student View</button>
          <button onClick={() => handleLaunchRole('parent')} className="hover:text-white transition-colors">Parent View</button>
          <button onClick={() => handleLaunchRole('teacher')} className="hover:text-white transition-colors">Educator View</button>
          <button onClick={() => handleLaunchRole('admin')} className="hover:text-white transition-colors">Admin View</button>
          <button onClick={() => openAuthModal('signup')} className="text-brand-400 font-bold hover:underline">Sign Up</button>
        </div>
      </footer>
    </div>
  );
};
