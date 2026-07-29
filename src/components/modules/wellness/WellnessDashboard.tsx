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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Confidential Mental Wellness Hub
          </span>
          <h1 className="text-2xl font-extrabold text-white">Student Mental Health & Sentiment Monitor</h1>
          <p className="text-slate-300 text-xs mt-1">
            Anonymous daily mood check-ins, early stress detection, and guided mindfulness tools.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800 text-cyan-300 font-semibold">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>100% Privacy Encrypted</span>
        </div>
      </div>

      {/* Main Grid: Check-in & Breathing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anonymous Daily Mood Logger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-5">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Smile className="w-5 h-5 text-cyan-400" />
                <span>Daily Anonymous Wellness Check-In</span>
              </h3>
              <p className="text-xs text-slate-400">Log how you feel today to track emotional balance and receive personalized wellness tips.</p>
            </div>

            <form onSubmit={handleSaveMood} className="space-y-4">
              {/* Mood Scale Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Your Overall Mood Today</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { score: 1, label: 'Very Sad', emoji: '😫', color: 'border-rose-500/50 bg-rose-500/10' },
                    { score: 2, label: 'Stressed', emoji: '😕', color: 'border-amber-500/50 bg-amber-500/10' },
                    { score: 3, label: 'Neutral', emoji: '😐', color: 'border-slate-500/50 bg-slate-500/10' },
                    { score: 4, label: 'Happy', emoji: '😊', color: 'border-cyan-500/50 bg-cyan-500/10' },
                    { score: 5, label: 'Ecstatic', emoji: '🚀', color: 'border-emerald-500/50 bg-emerald-500/10' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.score}
                      onClick={() => setSelectedScore(m.score as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedScore === m.score ? `${m.color} ring-2 ring-cyan-400 scale-105 shadow-lg` : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{m.emoji}</span>
                      <span className="text-[10px] font-bold text-slate-300 block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Primary Influence Tag</label>
                <div className="flex flex-wrap gap-2">
                  {['Exams & Tests', 'Homework', 'Friends', 'Sleep', 'Sports', 'Family'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedTag === tag ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Confidential Journal Note */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confidential Journal Entry (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Express your thoughts freely... Only you and Counselor Ms. Harper can view if flagged."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs text-center animate-fade-in">
                  ✓ Wellness Check-in Saved & Analyzed by AI Guidance Engine!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Today's Wellness Log
              </button>
            </form>
          </div>

          {/* AI Sentiment Graph History */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>7-Day Mood Trend Analysis</span>
            </h3>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {moodEntries.slice(0, 7).map((entry: any) => (
                <div key={entry.id} className="space-y-2">
                  <div className="h-24 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-end p-1.5 relative overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all ${
                        entry.score >= 4 ? 'bg-gradient-to-t from-emerald-600 to-cyan-400' :
                        entry.score === 3 ? 'bg-gradient-to-t from-amber-600 to-yellow-400' : 'bg-gradient-to-t from-rose-600 to-red-400'
                      }`}
                      style={{ height: `${entry.score * 20}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">{entry.date.slice(8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Guided Breathing & Counselor Helpline */}
        <div className="space-y-6">
          <GuidedBreathing />

          {/* Counselor Support Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <span>Campus Counselor Desk</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Counselor Ms. Harper is available for confidential 1-on-1 chats and exam stress guidance.
            </p>
            <button
              onClick={() => setActiveTab('communication')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Message Counselor Ms. Harper
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs space-y-2">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> 24/7 Crisis Hotline
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If you or a friend need immediate emotional support, call toll-free: <strong>1-800-273-TALK</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
