import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import { Bot, X, Send, Sparkles, RefreshCw, Zap, Lightbulb } from 'lucide-react';

export const FloatingAIAssistant: React.FC = () => {
  const { isOpen, setIsOpen, messages, sendMessage, clearMessages } = useChat();
  const { role } = useApp();
  const [inputText, setInputText] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, role);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt, role);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-2xl bg-gradient-to-r from-brand-500 via-cyan-500 to-emerald-400 text-white shadow-2xl shadow-brand-500/40 flex items-center justify-center"
          title="Open EduPulse AI Assistant"
        >
          <Bot className="w-7 h-7 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping"></span>
          
          <div className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>EduPulse AI Guide</span>
          </div>
        </motion.button>
      </div>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[550px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-100">EduPulse AI Guide</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Contextual assistant for {role} role</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearMessages}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 divide-y divide-slate-800/20">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 pt-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 flex-shrink-0"
                  />
                  <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 block px-1">{msg.timestamp}</span>

                    {/* Suggested Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickPrompt(action)}
                            className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-brand-600/30 text-brand-300 hover:text-brand-200 border border-brand-500/20 text-[11px] font-medium transition-all flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 text-brand-400" />
                            <span>{action}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">Quick Prompts:</span>
              {role === 'student' && (
                <>
                  <button onClick={() => handleQuickPrompt('How can I prepare for Physics?')} className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap">Physics Prep</button>
                  <button onClick={() => handleQuickPrompt('Where is Bus-14 right now?')} className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap">Track Bus</button>
                </>
              )}
              {role === 'parent' && (
                <>
                  <button onClick={() => handleQuickPrompt('What is Alex\'s attendance rate?')} className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap">Attendance</button>
                  <button onClick={() => handleQuickPrompt('Where is the school bus right now?')} className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md whitespace-nowrap">Bus ETA</button>
                </>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask EduPulse AI as ${role}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500/60"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl hover:from-brand-500 hover:to-brand-400 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
