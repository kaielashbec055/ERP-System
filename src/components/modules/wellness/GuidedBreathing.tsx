import React, { useState, useEffect } from 'react';
import { Heart, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export const GuidedBreathing: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [cyclesCount, setCyclesCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;

        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          setCyclesCount(c => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setTimer(4);
    setCyclesCount(0);
  };

  return (
    <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md text-center space-y-5 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
        <span className="font-extrabold text-[#1E293B] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span>4-7-8 Guided Breathing Exercises</span>
        </span>
        <span className="text-slate-500 font-bold">{cyclesCount} Cycles Completed</span>
      </div>

      {/* Breathing Animated Orb Circle */}
      <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 opacity-25 transition-transform duration-1000 ${
            phase === 'Inhale' ? 'scale-125 duration-4000' : phase === 'Hold' ? 'scale-125' : 'scale-75 duration-8000'
          }`}
        ></div>
        <div className="relative z-10 w-32 h-32 rounded-full bg-white border-2 border-[#8B5CF6]/40 flex flex-col items-center justify-center space-y-1 shadow-md">
          <Heart className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          <span className="text-xs font-black text-[#1E293B] uppercase tracking-wider">{phase}</span>
          <span className="text-2xl font-black text-[#4F7CFF]">{timer}s</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
        {phase === 'Inhale' ? 'Slowly inhale through your nose filling your lungs...' :
         phase === 'Hold' ? 'Hold your breath gently and relax your shoulders...' :
         'Exhale slowly and completely through your mouth...'}
      </p>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
            isActive ? 'bg-amber-500 text-white' : 'bg-[#4F7CFF] hover:bg-blue-600 text-white'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause Exercise' : 'Start 4-7-8 Breathing'}</span>
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-200 cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
