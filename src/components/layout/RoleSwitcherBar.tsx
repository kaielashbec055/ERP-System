import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { User, ShieldCheck, GraduationCap, School, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, isLandingPage, setIsLandingPage } = useApp();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      key: 'student',
      label: 'Student View',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'from-[#7C3AED] to-[#9333EA]',
      desc: 'Aarav Sharma (Class 5-A, Level 5)'
    },
    {
      key: 'parent',
      label: 'Parent View',
      icon: <User className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600',
      desc: 'Priya Sharma (Aarav\'s Parent)'
    },
    {
      key: 'teacher',
      label: 'Teacher View',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'from-purple-600 to-indigo-600',
      desc: 'Mrs. Sharma (Grade 5-A Educator)'
    },
    {
      key: 'admin',
      label: 'Admin View',
      icon: <School className="w-4 h-4" />,
      color: 'from-amber-500 to-orange-600',
      desc: 'Principal Dr. Eleanor Vance'
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-purple-100 text-xs py-2 px-4 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] font-extrabold border border-purple-200 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#7C3AED]" /> EDUSYNC ROLE SWITCHER
          </span>
          <span className="text-purple-900/80 font-medium hidden sm:inline">
            Switch persona to explore live portals:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map((r) => {
            const isActive = !isLandingPage && role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => {
                  setIsLandingPage(false);
                  setRole(r.key);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all font-extrabold cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${r.color} text-white shadow-sm scale-105 glow-purple`
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-100'
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
