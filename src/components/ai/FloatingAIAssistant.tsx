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
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] text-white shadow-xl glow-purple flex items-center justify-center cursor-pointer"
          title="Open EduSync AI Assistant"
        >
          <Bot className="w-7 h-7 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></span>

          <div className="absolute right-full mr-3 bg-white text-[#1E1B4B] text-xs px-3.5 py-1.5 rounded-2xl border border-purple-100 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>EduSync AI Study Buddy</span>
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
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[550px] bg-white/95 backdrop-blur-2xl border border-purple-100 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-[#1E1B4B]">EduSync AI Study Buddy</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      24/7 ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-purple-800 font-semibold">Contextual guide for {role} persona</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearMessages}
                  className="p-1.5 text-purple-400 hover:text-purple-700 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-purple-400 hover:text-purple-700 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7FF]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 pt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-xl object-cover ring-1 ring-purple-200 flex-shrink-0"
                  />
                  <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-tr-none shadow-xs'
                        : 'bg-white text-[#1E1B4B] border border-purple-100 rounded-tl-none shadow-xs'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-purple-600 font-semibold block px-1">{msg.timestamp}</span>

                    {/* Suggested Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickPrompt(action)}
                            className="px-2.5 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-[#7C3AED] border border-purple-200 text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Zap className="w-3 h-3 text-[#7C3AED]" />
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
            <div className="px-3.5 py-2 bg-purple-50/80 border-t border-purple-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-purple-900 font-extrabold flex-shrink-0">Quick Prompts:</span>
              <button onClick={() => handleQuickPrompt('Can you explain photosynthesis in simple words?')} className="text-[10px] px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 font-bold text-purple-900 rounded-xl whitespace-nowrap cursor-pointer">Explain Photosynthesis</button>
              <button onClick={() => handleQuickPrompt('Where is School Bus KA 09 AB 1234 right now?')} className="text-[10px] px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 font-bold text-purple-900 rounded-xl whitespace-nowrap cursor-pointer">Track Bus</button>
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-purple-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask EduSync AI Buddy as ${role}...`}
                className="flex-1 bg-purple-50/50 border border-purple-100 rounded-2xl px-3.5 py-2 text-xs text-[#1E1B4B] placeholder-purple-400 font-medium focus:outline-none focus:border-[#7C3AED]"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-2xl transition-all shadow-xs cursor-pointer"
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
