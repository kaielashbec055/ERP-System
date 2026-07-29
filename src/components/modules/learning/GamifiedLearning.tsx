import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../../context/ChatContext';
import { useApp } from '../../../context/AppContext';
import {
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Star,
  ChevronRight,
  RotateCcw,
  Flame,
  Bot,
  AlertCircle
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SubjectChallenge {
  id: string;
  title: string;
  category: string;
  icon: string;
  xpReward: number;
  badgeName: string;
  badgeIcon: string;
  questions: QuizQuestion[];
}

export const GamifiedLearning: React.FC = () => {
  const { role } = useApp();
  const { setIsOpen, sendMessage } = useChat();

  const [userXP, setUserXP] = useState(1450);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['Physics Prodigy', 'Math Wizard']);
  const [activeSubjectId, setActiveSubjectId] = useState<string>('phy_01');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const challenges: SubjectChallenge[] = [
    {
      id: 'phy_01',
      title: 'Physics & Motion Quest',
      category: 'Physics ⚛️',
      icon: '⚛️',
      xpReward: 150,
      badgeName: 'Quantum Master',
      badgeIcon: '🚀',
      questions: [
        {
          id: 'q1',
          question: "What is Newton's Second Law of Motion represented mathematically?",
          options: ['F = m * a', 'E = m * c²', 'V = I * R', 'P = W / t'],
          correctIndex: 0,
          explanation: 'Force (F) equals Mass (m) multiplied by Acceleration (a).'
        },
        {
          id: 'q2',
          question: 'What unit is used to measure electrical frequency?',
          options: ['Joules', 'Hertz (Hz)', 'Ohms', 'Watts'],
          correctIndex: 1,
          explanation: 'Hertz (Hz) measures cycle frequency per second.'
        },
        {
          id: 'q3',
          question: 'Light traveling in a vacuum travels at approximately:',
          options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '3,000 km/s'],
          correctIndex: 0,
          explanation: 'The speed of light in vacuum is approx 300,000 kilometers per second.'
        }
      ]
    },
    {
      id: 'mat_01',
      title: 'Algebra & Calculus Challenge',
      category: 'Mathematics 📐',
      icon: '📐',
      xpReward: 150,
      badgeName: 'Math Wizard',
      badgeIcon: '📐',
      questions: [
        {
          id: 'q1',
          question: 'What is the derivative of f(x) = x²?',
          options: ['2x', 'x', '2', 'x³ / 3'],
          correctIndex: 0,
          explanation: 'Using the power rule: d/dx(x^n) = n * x^(n-1), so d/dx(x²) = 2x.'
        },
        {
          id: 'q2',
          question: 'Solve for x: 3x + 12 = 27',
          options: ['x = 3', 'x = 5', 'x = 6', 'x = 9'],
          correctIndex: 1,
          explanation: 'Subtract 12 from both sides: 3x = 15, then divide by 3: x = 5.'
        }
      ]
    },
    {
      id: 'che_01',
      title: 'Chemistry Elements Quest',
      category: 'Chemistry 🧪',
      icon: '🧪',
      xpReward: 150,
      badgeName: 'Chem Specialist',
      badgeIcon: '🧪',
      questions: [
        {
          id: 'q1',
          question: 'Which chemical element has the symbol "Au"?',
          options: ['Silver', 'Gold', 'Copper', 'Aluminum'],
          correctIndex: 1,
          explanation: 'Au comes from the Latin word "Aurum" which means Gold.'
        },
        {
          id: 'q2',
          question: 'What is the pH level of pure water at 25°C?',
          options: ['5.0', '7.0', '9.0', '14.0'],
          correctIndex: 1,
          explanation: 'Pure neutral water has a pH value of exactly 7.0.'
        }
      ]
    },
    {
      id: 'bio_01',
      title: 'Cellular Biology Quest',
      category: 'Biology 🧬',
      icon: '🧬',
      xpReward: 150,
      badgeName: 'Bio Scientist',
      badgeIcon: '🧬',
      questions: [
        {
          id: 'q1',
          question: 'Which organelle is known as the powerhouse of the cell?',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
          correctIndex: 1,
          explanation: 'Mitochondria generate most of the chemical energy needed by the cell.'
        },
        {
          id: 'q2',
          question: 'What molecule carries genetic instructions in living organisms?',
          options: ['ATP', 'DNA', 'RNA', 'Glucose'],
          correctIndex: 1,
          explanation: 'DNA (Deoxyribonucleic acid) stores genetic data in organisms.'
        }
      ]
    }
  ];

  const activeChallenge = challenges.find(c => c.id === activeSubjectId) || challenges[0];
  const currentQuestion = activeChallenge.questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    } else {
      setWrongAttempts(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeChallenge.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed Quiz!
      setQuizCompleted(true);
      const earnedXP = activeChallenge.xpReward;
      setUserXP(prev => prev + earnedXP);

      if (!unlockedBadges.includes(activeChallenge.badgeName)) {
        setUnlockedBadges(prev => [...prev, activeChallenge.badgeName]);
        setNewBadgeUnlocked(activeChallenge.badgeName);
      }
    }
  };

  const handleRestartQuiz = (challengeId?: string) => {
    if (challengeId) setActiveSubjectId(challengeId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setNewBadgeUnlocked(null);
    setWrongAttempts(0);
  };

  const handleAskAiDoubt = () => {
    setIsOpen(true);
    const doubtText = `I am struggling with this question in ${activeChallenge.title}: "${currentQuestion.question}". Option "${currentQuestion.options[selectedOption ?? 0]}" was wrong. Can you explain why the correct answer is "${currentQuestion.options[currentQuestion.correctIndex]}"?`;
    sendMessage(doubtText, role);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-200 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-300 animate-bounce" /> Gamified Subject Mastery Arena
          </span>
          <h1 className="text-2xl font-extrabold">Complete Quizzes & Earn Badges</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">
            Solve subject challenges, level up your knowledge, gain XP, and unlock achievements!
          </p>
        </div>

        {/* XP Status Card */}
        <div className="flex items-center gap-3 bg-white/95 text-[#1E293B] p-3 px-5 rounded-2xl border border-white/40 shadow-sm backdrop-blur-md">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-extrabold">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Total Score</span>
            <span className="text-xl font-black text-[#4F7CFF]">{userXP} XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Quiz Arena */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject Challenge Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {challenges.map((c) => (
              <button
                key={c.id}
                onClick={() => handleRestartQuiz(c.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeSubjectId === c.id
                    ? 'bg-[#4F7CFF] text-white shadow-sm scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>

          {/* Interactive Question Card */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-5">
            {!quizCompleted ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F7CFF] border border-blue-200">
                      Question {currentQuestionIndex + 1} of {activeChallenge.questions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{activeChallenge.category}</span>
                  </div>

                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    +{activeChallenge.xpReward} XP Reward
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-[#1E293B] leading-snug">
                    {currentQuestion.question}
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion.options.map((opt, i) => {
                      let btnStyle = 'bg-slate-50 border-slate-200 text-[#1E293B] hover:bg-slate-100';
                      if (isAnswered) {
                        if (i === currentQuestion.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold ring-2 ring-emerald-400';
                        } else if (i === selectedOption) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 font-extrabold';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <motion.button
                          key={i}
                          whileHover={!isAnswered ? { scale: 1.01 } : {}}
                          whileTap={!isAnswered ? { scale: 0.99 } : {}}
                          onClick={() => handleSelectOption(i)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-black text-[11px]">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </span>

                          {isAnswered && i === currentQuestion.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {isAnswered && i === selectedOption && i !== currentQuestion.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                    {/* Learn and come alert when wrong attempts occur */}
                    {selectedOption !== currentQuestion.correctIndex && (
                      <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        wrongAttempts >= 2
                          ? 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'bg-amber-100 border-amber-300 text-amber-900'
                      }`}>
                        <div className="flex items-center gap-2 text-xs font-extrabold">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 animate-pulse" />
                          <span>
                            {wrongAttempts >= 2
                              ? 'Learn and come! You have answered incorrectly twice.'
                              : 'Incorrect selection! Please review solution below.'}
                          </span>
                        </div>

                        <button
                          onClick={handleAskAiDoubt}
                          className="px-3 py-1.5 rounded-xl bg-[#4F7CFF] hover:bg-blue-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          <Bot className="w-4 h-4" />
                          <span>Ask AI Agent</span>
                        </button>
                      </div>
                    )}

                    <p className="text-xs font-extrabold text-[#4F7CFF] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Solution Explanation:
                    </p>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleAskAiDoubt}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Bot className="w-4 h-4 text-[#4F7CFF]" />
                        <span>Clear Doubts with AI Guide</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 rounded-xl bg-[#4F7CFF] hover:bg-blue-600 text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>{currentQuestionIndex < activeChallenge.questions.length - 1 ? 'Next Question' : 'Complete Quest'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              /* Quiz Completion Screen */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-5">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-md animate-bounce">
                  <Trophy className="w-10 h-10 text-amber-500" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Quest Completed!
                  </span>
                  <h3 className="text-2xl font-black text-[#1E293B]">{activeChallenge.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    You scored <strong className="text-[#4F7CFF] font-black">{score} / {activeChallenge.questions.length}</strong> correct answers!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 max-w-sm mx-auto space-y-1">
                  <p className="text-xs font-extrabold text-[#4F7CFF]">XP Earned: +{activeChallenge.xpReward} Points!</p>
                  {newBadgeUnlocked && (
                    <p className="text-xs font-extrabold text-amber-700">🏆 New Badge Unlocked: {newBadgeUnlocked}!</p>
                  )}
                </div>

                <button
                  onClick={() => handleRestartQuiz()}
                  className="px-6 py-3 rounded-2xl bg-[#4F7CFF] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Play Challenge Again
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Badges & Rewards Inventory */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-extrabold text-[#1E293B] text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Earned Badges Showcase</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {challenges.map((c) => {
                const isUnlocked = unlockedBadges.includes(c.badgeName);
                return (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.03 }}
                    className={`p-3.5 rounded-2xl border text-center space-y-2 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/70 border-amber-200 text-[#1E293B]'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                      {c.badgeIcon}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-[#1E293B]">{c.badgeName}</h5>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full mt-1 inline-block ${
                        isUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
