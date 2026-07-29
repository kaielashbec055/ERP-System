import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  AlertTriangle,
  User,
  LogIn,
  ChevronDown,
  Shield,
  HeartPulse,
  Bus,
  BookOpen,
  GraduationCap,
  School,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, setRole, notifications, markNotificationRead, setIsSosModalOpen, setIsAuthModalOpen, setIsLandingPage } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { key: UserRole; label: string; icon: React.ReactNode }[] = [
    { key: 'student', label: 'Student (Alex)', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { key: 'parent', label: 'Parent (Sarah)', icon: <User className="w-3.5 h-3.5" /> },
    { key: 'teacher', label: 'Teacher (Dr. Thorne)', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'admin', label: 'Admin (Principal)', icon: <School className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 lg:px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLandingPage(false)}
            className="flex items-center gap-2.5 text-left group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-brand-400 animate-pulse" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  EduPulse<span className="text-brand-400">.AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  v2.4 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Smart Student Ecosystem
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search grades, bus location, circulars, assignments..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          {/* Emergency SOS Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all shadow-lg shadow-rose-500/10 group animate-pulse-slow"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
          </motion.button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 relative transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Menu with Framer Motion */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-400" />
                      <h4 className="font-semibold text-sm text-slate-100">Notifications</h4>
                    </div>
                    <span className="text-xs text-slate-400">{unreadCount} unread</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-brand-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg text-xs mt-0.5 ${
                            n.type === 'alert' ? 'bg-rose-500/20 text-rose-400' :
                            n.type === 'transport' ? 'bg-amber-500/20 text-amber-400' :
                            n.type === 'academic' ? 'bg-brand-500/20 text-brand-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {n.type === 'alert' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                             n.type === 'transport' ? <Bus className="w-3.5 h-3.5" /> :
                             n.type === 'academic' ? <BookOpen className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-semibold text-slate-200">{n.title}</h5>
                              <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/50"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-brand-400 font-medium capitalize">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-2"
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-slate-200">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                    <p className="text-[10px] text-brand-400 font-semibold mt-1 bg-brand-500/10 px-2 py-0.5 rounded inline-block">
                      {user.title || user.gradeOrSubject}
                    </p>
                  </div>

                  {/* Persona Switcher inside Profile Menu */}
                  <div className="px-2 py-1 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Switch View Role</p>
                    <div className="grid grid-cols-2 gap-1">
                      {roles.map((r) => (
                        <button
                          key={r.key}
                          onClick={() => {
                            setRole(r.key);
                            setIsLandingPage(false);
                            setShowProfileMenu(false);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                            role === r.key
                              ? 'bg-brand-600 text-white font-bold'
                              : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {r.icon}
                          <span className="truncate">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsLandingPage(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Public Landing Page</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5 text-rose-400" />
                      <span>Switch / Login Account</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
