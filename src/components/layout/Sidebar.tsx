import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Shield,
  HeartPulse,
  MessageSquare,
  BookOpen,
  Award,
  CreditCard,
  Users,
  AlertOctagon,
  ChevronRight,
  Bus,
  CheckSquare
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, setIsSosModalOpen, setIsLandingPage } = useApp();

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'achievements', label: 'Gamified Quizzes & Badges', icon: <Award className="w-4 h-4" />, badge: 'GAME' },
          { id: 'safety', label: 'Safety & Bus Tracker', icon: <Bus className="w-4 h-4" />, badge: 'LIVE' },
          { id: 'wellness', label: 'Mental Wellness', icon: <HeartPulse className="w-4 h-4" />, badge: 'AI' },
          { id: 'communication', label: 'Messages & Circulars', icon: <MessageSquare className="w-4 h-4" /> }
        ];

      case 'parent':
        return [
          { id: 'dashboard', label: 'Parent Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'safety', label: 'Child Safety & Bus GPS', icon: <Bus className="w-4 h-4" />, badge: 'LIVE' },
          { id: 'wellness', label: 'Child Wellness Pulse', icon: <HeartPulse className="w-4 h-4" /> },
          { id: 'fees', label: 'Fee Portal & Receipts', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'communication', label: 'Teacher Connect & Circulars', icon: <MessageSquare className="w-4 h-4" /> }
        ];

      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'attendance_mgr', label: 'Attendance Marker', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'safety', label: 'Gate Pass & Transport', icon: <Shield className="w-4 h-4" /> },
          { id: 'wellness', label: 'Counselor & Wellness Flags', icon: <HeartPulse className="w-4 h-4" /> },
          { id: 'communication', label: 'Parent Chat & Circulars', icon: <MessageSquare className="w-4 h-4" /> }
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'safety', label: 'Transport Fleet Monitor', icon: <Bus className="w-4 h-4" /> },
          { id: 'wellness', label: 'School-Wide Mood Trends', icon: <HeartPulse className="w-4 h-4" /> },
          { id: 'communication', label: 'Broadcast Circulars', icon: <MessageSquare className="w-4 h-4" /> }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 hidden lg:flex flex-col justify-between p-4 sticky top-[65px] h-[calc(100vh-65px)] shadow-sm">
      <div className="space-y-6">
        {/* Role Identity Card & Persona Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-3xl bg-purple-50/80 border border-purple-100 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center font-black text-xs shadow-sm">
              {role === 'student' ? 'ST' : role === 'parent' ? 'PR' : role === 'teacher' ? 'TC' : 'AD'}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-900">Current Portal</p>
              <h4 className="text-xs font-black text-[#1E1B4B] capitalize">{role} Ecosystem</h4>
            </div>
          </div>

          {/* Quick Switcher Pills */}
          <div className="pt-2 border-t border-purple-100/80">
            <p className="text-[9px] font-black uppercase text-purple-900 mb-1.5">Switch Persona Portal:</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { key: 'student', label: 'Student' },
                { key: 'parent', label: 'Parent' },
                { key: 'teacher', label: 'Teacher' },
                { key: 'admin', label: 'Admin' }
              ].map((r) => {
                const isActive = role === r.key;
                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      setIsLandingPage(false);
                      setRole(r.key as any);
                    }}
                    className={`py-1 px-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4F7CFF] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-[#1E293B] hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3 z-10">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`z-10 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    item.badge === 'LIVE' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    item.badge === 'AI' || item.badge === 'AI ALERT' ? 'bg-purple-100 text-[#8B5CF6] border border-purple-200' :
                    'bg-rose-100 text-[#EF4444] border border-rose-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Action SOS Widget */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-3xl bg-rose-50/80 border border-rose-200 space-y-2.5 shadow-sm"
      >
        <div className="flex items-center gap-2 text-[#EF4444]">
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span className="text-xs font-extrabold">Safety Protocols</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Instant campus panic alert & live transport tracking system active.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSosModalOpen(true)}
          className="w-full py-2.5 bg-[#EF4444] hover:bg-rose-600 text-white rounded-2xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Trigger Campus SOS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </aside>
  );
};
