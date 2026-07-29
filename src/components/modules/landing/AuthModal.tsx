import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';
import { X, Lock, Mail, User, GraduationCap, ShieldCheck, School, Sparkles, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setRole, setIsLandingPage, authMode, setAuthMode } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');

  const isRegister = authMode === 'signup';

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    setIsLandingPage(false);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher: Sign In vs Sign Up */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              !isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              isRegister ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg mb-2 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isRegister ? 'Create EduPulse Account' : 'Sign In to EduPulse AI'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Register your institutional profile below' : 'Select your institution persona to enter'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { role: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { role: 'parent', label: 'Parent', icon: <User className="w-3.5 h-3.5" /> },
            { role: 'teacher', label: 'Teacher', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { role: 'admin', label: 'Admin', icon: <School className="w-3.5 h-3.5" /> }
          ].map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setSelectedRole(r.role as UserRole)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === r.role
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.icon}
              <span className="text-[10px]">{r.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Name / Institution Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  defaultValue={selectedRole === 'student' ? 'Alex Vance' : selectedRole === 'parent' ? 'Sarah Vance' : selectedRole === 'teacher' ? 'Dr. Marcus Thorne' : 'St. Jude Academy'}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email || (selectedRole === 'student' ? 'alex.vance@edupulse.edu' : selectedRole === 'parent' ? 'sarah.vance@gmail.com' : selectedRole === 'teacher' ? 'm.thorne@edupulse.edu' : 'principal@edupulse.edu')}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <span>{isRegister ? `Create ${selectedRole.toUpperCase()} Account` : `Sign In as ${selectedRole.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span>{isRegister ? 'Already have an account?' : 'Need a new school account?'} </span>
          <button
            onClick={() => setAuthMode(isRegister ? 'signin' : 'signup')}
            className="text-brand-400 font-bold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
};
