import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { User, ShieldCheck, GraduationCap, School, Sparkles, Eye } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, isLandingPage, setIsLandingPage } = useApp();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      key: 'student',
      label: 'Student View',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      desc: 'Alex Vance (Grade 10)'
    },
    {
      key: 'parent',
      label: 'Parent View',
      icon: <User className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-500',
      desc: 'Sarah Vance (Alex & Maya)'
    },
    {
      key: 'teacher',
      label: 'Teacher View',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'from-purple-500 to-indigo-500',
      desc: 'Dr. Thorne (Physics/Math)'
    },
    {
      key: 'admin',
      label: 'Admin View',
      icon: <School className="w-4 h-4" />,
      color: 'from-amber-500 to-rose-500',
      desc: 'Principal Dr. Vance'
    }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-400" /> HACKATHON DEMO MODE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Switch persona to test role-specific features live:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Public Landing Toggle */}
          <button
            onClick={() => setIsLandingPage(!isLandingPage)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              isLandingPage
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          {roles.map((r) => {
            const isActive = !isLandingPage && role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => {
                  setIsLandingPage(false);
                  setRole(r.key);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-md shadow-brand-500/10 scale-105`
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
