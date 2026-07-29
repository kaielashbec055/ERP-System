import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { UserRole } from '../../../types';
import { X, Lock, Mail, User, GraduationCap, ShieldCheck, School, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { loginApi } from '../../../services/api';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setRole,
    setIsLandingPage,
    authMode,
    setAuthMode,
    authTargetRole,
    setAuthTargetRole,
    addNotification
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (authTargetRole) {
      setSelectedRole(authTargetRole);
    }
  }, [authTargetRole]);

  const isRegister = authMode === 'signup';

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeRole = selectedRole;
    const roleCapitalized = activeRole.charAt(0).toUpperCase() + activeRole.slice(1);
    const toastMessage = isRegister
      ? `${roleCapitalized} Account Created Successfully!`
      : `${roleCapitalized} Login Successful! Redirecting to Dashboard...`;

    setSuccessToast(toastMessage);

    // Notify app notifications stream
    addNotification({
      title: `${roleCapitalized} Authentication`,
      message: `${roleCapitalized} persona authenticated successfully.`,
      type: 'wellness'
    });

    try {
      const targetEmail = email || (activeRole === 'student' ? 'alex.vance@edupulse.edu' : activeRole === 'parent' ? 'sarah.vance@gmail.com' : activeRole === 'teacher' ? 'm.thorne@edupulse.edu' : 'principal@edupulse.edu');
      const res = await loginApi(targetEmail);
      if (res && res.user) {
        setRole(res.user.role || activeRole);
      } else {
        setRole(activeRole);
      }
    } catch {
      setRole(activeRole);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setSuccessToast(null);
        setAuthTargetRole(null);
        setIsLandingPage(false);
        setIsAuthModalOpen(false);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1B4B]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer font-bold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher: Sign In vs Sign Up */}
        <div className="flex bg-purple-50 p-1 rounded-2xl border border-purple-100 text-xs">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
              !isRegister ? 'purple-pill-active' : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
              isRegister ? 'purple-pill-active' : 'text-purple-700 hover:text-purple-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center space-y-1">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#C084FC] p-0.5 shadow-md mb-2 flex items-center justify-center glow-purple">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#7C3AED]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#1E1B4B]">
            {isRegister ? 'Join EduSync AI' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-purple-800/80 font-medium">
            {isRegister ? 'Create your institutional profile below' : 'Login to continue your learning journey'}
          </p>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center justify-center gap-2 animate-bounce shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-100">
          {[
            { role: 'student', label: 'Student', icon: <GraduationCap className="w-4 h-4" /> },
            { role: 'parent', label: 'Parent', icon: <User className="w-4 h-4" /> },
            { role: 'teacher', label: 'Teacher', icon: <ShieldCheck className="w-4 h-4" /> },
            { role: 'admin', label: 'Admin', icon: <School className="w-4 h-4" /> }
          ].map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setSelectedRole(r.role as UserRole)}
              className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === r.role
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-sm'
                  : 'text-purple-700 hover:text-purple-950'
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
              <label className="block text-purple-900 mb-1 font-bold">Full Name / Institution Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  defaultValue={selectedRole === 'student' ? 'Aarav Sharma' : selectedRole === 'parent' ? 'Priya Sharma' : selectedRole === 'teacher' ? 'Mrs. Sharma' : 'St. Jude Academy'}
                  className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-purple-900 mb-1 font-bold">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="email"
                value={email || (selectedRole === 'student' ? 'alex.vance@edupulse.edu' : selectedRole === 'parent' ? 'sarah.vance@gmail.com' : selectedRole === 'teacher' ? 'm.thorne@edupulse.edu' : 'principal@edupulse.edu')}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-900 mb-1 font-bold">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-extrabold text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isRegister ? `Create ${selectedRole.toUpperCase()} Account` : `Sign In as ${selectedRole.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-purple-100 text-[11px] text-purple-800 font-medium">
          <span>{isRegister ? 'Already have an account?' : 'Need a new school account?'} </span>
          <button
            onClick={() => setAuthMode(isRegister ? 'signin' : 'signup')}
            className="text-[#7C3AED] font-black hover:underline cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
};
