import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { GuidedBreathing } from './GuidedBreathing';
import {
  HeartPulse,
  Smile,
  Frown,
  Meh,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  PhoneCall,
  User,
  CheckCircle2,
  Lock,
  MessageSquare
} from 'lucide-react';

export const WellnessDashboard: React.FC = () => {
  const { moodEntries, addMoodEntry, role, setActiveTab } = useApp();
  const [selectedScore, setSelectedScore] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [selectedTag, setSelectedTag] = useState('Exams');
  const [note, setNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      score: selectedScore,
      tags: [selectedTag],
      note
    });

    setSavedSuccess(true);
    setNote('');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 border border-purple-200 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-white animate-pulse" /> Confidential Mental Wellness Hub
          </span>
          <h1 className="text-2xl font-extrabold">Student Mental Health & Sentiment Monitor</h1>
          <p className="text-purple-100 text-xs mt-1 font-medium">
            Anonymous daily mood check-ins, early stress detection, and guided mindfulness tools.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/90 text-[#8B5CF6] px-3.5 py-2 rounded-2xl border border-white/40 font-extrabold shadow-sm">
          <Lock className="w-4 h-4 text-[#8B5CF6]" />
          <span>100% Privacy Encrypted</span>
        </div>
      </div>

      {/* Main Grid: Check-in & Breathing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anonymous Daily Mood Logger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#1E293B] flex items-center gap-2">
                <Smile className="w-5 h-5 text-[#8B5CF6]" />
                <span>Daily Anonymous Wellness Check-In</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Log how you feel today to track emotional balance and receive personalized wellness tips.</p>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-4">
              {/* Mood Scale Selector */}
              <div>
                <label className="block text-xs font-extrabold text-[#1E293B] mb-2">Select Your Overall Mood Today</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { score: 1, label: 'Very Sad', emoji: '😫', color: 'border-rose-300 bg-rose-50 text-rose-800' },
                    { score: 2, label: 'Stressed', emoji: '😕', color: 'border-amber-300 bg-amber-50 text-amber-800' },
                    { score: 3, label: 'Neutral', emoji: '😐', color: 'border-slate-300 bg-slate-50 text-slate-800' },
                    { score: 4, label: 'Happy', emoji: '😊', color: 'border-purple-300 bg-purple-50 text-purple-800' },
                    { score: 5, label: 'Ecstatic', emoji: '🚀', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.score}
                      onClick={() => setSelectedScore(m.score as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedScore === m.score ? `${m.color} ring-2 ring-[#8B5CF6] scale-105 shadow-sm` : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{m.emoji}</span>
                      <span className="text-[10px] font-extrabold block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Tag Selector */}
              <div>
                <label className="block text-xs font-extrabold text-[#1E293B] mb-2">Primary Influence Tag</label>
                <div className="flex flex-wrap gap-2">
                  {['Exams & Tests', 'Homework', 'Friends', 'Sleep', 'Sports', 'Family'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        selectedTag === tag ? 'bg-[#8B5CF6] text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Confidential Journal Note */}
              <div>
                <label className="block text-xs font-extrabold text-[#1E293B] mb-1.5">Confidential Journal Entry (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Express your thoughts freely... Only you and Counselor Ms. Harper can view if flagged."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#8B5CF6] font-medium"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-extrabold text-xs text-center">
                  ✓ Wellness Check-in Saved & Analyzed by AI Guidance Engine!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#4F7CFF] hover:bg-blue-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Today's Wellness Log
              </button>
            </form>
          </div>

          {/* AI Sentiment Graph History */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-extrabold text-base text-[#1E293B] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>7-Day Mood Trend Analysis</span>
            </h3>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {moodEntries.slice(0, 7).map((entry: any) => (
                <div key={entry.id} className="space-y-2">
                  <div className="h-24 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-end p-1.5 relative overflow-hidden">
                    <div
                      className={`w-full rounded-xl transition-all ${
                        entry.score >= 4 ? 'bg-gradient-to-t from-emerald-500 to-teal-400' :
                        entry.score === 3 ? 'bg-gradient-to-t from-amber-500 to-yellow-400' : 'bg-gradient-to-t from-rose-500 to-red-400'
                      }`}
                      style={{ height: `${entry.score * 20}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block">{entry.date.slice(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guided Breathing & Counselor Helpline */}
        <div className="space-y-6">
          <GuidedBreathing />

          {/* Counselor Support Card */}
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-3">
            <h3 className="font-extrabold text-sm text-[#1E293B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#8B5CF6]" />
              <span>Campus Counselor Desk</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Counselor Ms. Harper is available for confidential 1-on-1 chats and exam stress guidance.
            </p>
            <button
              onClick={() => setActiveTab('communication')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1E293B] rounded-2xl text-xs font-extrabold border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#8B5CF6]" /> Message Counselor Ms. Harper
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
            <span className="font-extrabold text-rose-700 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#EF4444]" /> 24/7 Crisis Helpline
            </span>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              If you or a friend need immediate emotional support, call toll-free: <strong>1-800-273-TALK</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
