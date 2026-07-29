import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { clearTokens } from '../../services/api';
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
    <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-40 px-4 lg:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLandingPage(false)}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#C084FC] p-0.5 shadow-md shadow-purple-500/15"
            >
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#7C3AED] animate-pulse" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#1E1B4B]">
                  EduSync<span className="text-[#7C3AED]"> AI</span>
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200">
                  Level 5 Learner
                </span>
              </div>
              <p className="text-[11px] text-purple-700 font-medium hidden sm:block">
                Every Child. Every Moment. Connected.
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search subjects, bus location, timetable, assignments..."
              className="w-full pl-10 pr-4 py-2 bg-purple-50/60 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] placeholder-purple-400 focus:outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          {/* Emergency SOS Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSosModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#EF4444] border border-rose-200 text-xs font-extrabold transition-all shadow-sm group cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-[#EF4444] group-hover:rotate-12 transition-transform" />
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
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 relative transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
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
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#4F7CFF]" />
                      <h4 className="font-bold text-sm text-[#1E293B]">Notifications</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">{unreadCount} unread</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl text-xs mt-0.5 ${
                            n.type === 'alert' ? 'bg-rose-100 text-rose-600' :
                            n.type === 'transport' ? 'bg-amber-100 text-amber-600' :
                            n.type === 'academic' ? 'bg-blue-100 text-[#4F7CFF]' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {n.type === 'alert' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                             n.type === 'transport' ? <Bus className="w-3.5 h-3.5" /> :
                             n.type === 'academic' ? <BookOpen className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-[#1E293B]">{n.title}</h5>
                              <span className="text-[10px] font-medium text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-100 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-xl object-cover ring-2 ring-[#7C3AED]/30"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-[#1E1B4B] leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#7C3AED] font-bold capitalize">{user.role} Portal</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl shadow-2xl p-3.5 z-50 space-y-3"
                >
                  <div className="px-3 py-2 bg-purple-50/70 border border-purple-100 rounded-2xl">
                    <p className="text-xs font-black text-[#1E1B4B]">{user.name}</p>
                    <p className="text-[11px] text-purple-700 font-medium">{user.email}</p>
                    <span className="text-[10px] text-[#7C3AED] font-extrabold mt-1.5 bg-white border border-purple-200 px-2.5 py-0.5 rounded-full inline-block">
                      {user.title || user.gradeOrSubject}
                    </span>
                  </div>

                  {/* Switch User Portal Section */}
                  <div className="space-y-1.5 pt-1 border-t border-purple-100">
                    <p className="text-[10px] font-black uppercase text-purple-900 px-1 tracking-wider">
                      Switch User Portal
                    </p>

                    <div className="space-y-1">
                      {[
                        { key: 'student', name: 'Aarav Sharma', roleLabel: 'Student View', icon: <GraduationCap className="w-3.5 h-3.5 text-[#7C3AED]" /> },
                        { key: 'parent', name: 'Priya Sharma', roleLabel: 'Parent View', icon: <User className="w-3.5 h-3.5 text-emerald-600" /> },
                        { key: 'teacher', name: 'Mrs. Sharma', roleLabel: 'Teacher View', icon: <Shield className="w-3.5 h-3.5 text-indigo-600" /> },
                        { key: 'admin', name: 'Dr. Eleanor Vance', roleLabel: 'Admin View', icon: <School className="w-3.5 h-3.5 text-amber-600" /> }
                      ].map((r) => {
                        const isCurrent = role === r.key;
                        return (
                          <button
                            key={r.key}
                            onClick={() => {
                              setIsLandingPage(false);
                              setRole(r.key as UserRole);
                              setShowProfileMenu(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-100 border border-purple-200 font-extrabold text-[#7C3AED]'
                                : 'hover:bg-purple-50 text-purple-900 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {r.icon}
                              <div>
                                <p className="text-xs font-bold leading-tight">{r.name}</p>
                                <p className="text-[9px] text-purple-700 font-medium">{r.roleLabel}</p>
                              </div>
                            </div>
                            {isCurrent && <span className="text-[10px] font-black bg-[#7C3AED] text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-purple-100">
                    <button
                      onClick={() => {
                        clearTokens();
                        setIsLandingPage(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-extrabold text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-rose-500" />
                      <span>Sign Out Account</span>
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
