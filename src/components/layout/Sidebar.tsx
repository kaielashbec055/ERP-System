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
  const { role, activeTab, setActiveTab, setIsSosModalOpen } = useApp();

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'academics', label: 'Grades & Subjects', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'safety', label: 'Safety & Bus Tracker', icon: <Bus className="w-4 h-4" />, badge: 'LIVE' },
          { id: 'wellness', label: 'Mental Wellness', icon: <HeartPulse className="w-4 h-4" />, badge: 'AI' },
          { id: 'achievements', label: 'Gamified Badges', icon: <Award className="w-4 h-4" /> },
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
          { id: 'class_mgmt', label: 'Class Analytics & AI Risk', icon: <Users className="w-4 h-4" />, badge: 'AI ALERT' },
          { id: 'attendance_mgr', label: 'Attendance Marker', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'safety', label: 'Gate Pass & Transport', icon: <Shield className="w-4 h-4" /> },
          { id: 'wellness', label: 'Counselor & Wellness Flags', icon: <HeartPulse className="w-4 h-4" /> },
          { id: 'communication', label: 'Parent Chat & Circulars', icon: <MessageSquare className="w-4 h-4" /> }
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'sos_command', label: 'Emergency Panic Terminal', icon: <AlertOctagon className="w-4 h-4" />, badge: 'CRITICAL' },
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
    <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 hidden lg:flex flex-col justify-between p-4 sticky top-[65px] h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Role Identity Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-800/80 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">
              {role === 'student' ? 'ST' : role === 'parent' ? 'PR' : role === 'teacher' ? 'TC' : 'AD'}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current View</p>
              <h4 className="text-xs font-extrabold text-slate-100 capitalize">{role} Ecosystem</h4>
            </div>
          </div>
        </motion.div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 z-10">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`z-10 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    item.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    item.badge === 'AI' || item.badge === 'AI ALERT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
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
        className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 space-y-2"
      >
        <div className="flex items-center gap-2 text-rose-400">
          <AlertOctagon className="w-4 h-4 animate-bounce" />
          <span className="text-xs font-bold">Safety Protocols</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Instant campus panic alert & live transport tracking system active.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSosModalOpen(true)}
          className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Trigger Campus SOS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </aside>
  );
};
