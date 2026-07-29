import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { MOCK_CHAT_MESSAGES } from '../../../mockData/mockData';
import { ChatMessage } from '../../../types';
import { MessageSquare, Send, Search, Paperclip, CheckCheck } from 'lucide-react';

export const ChatModule: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');

  const contacts = [
    { id: 'usr_tch_01', name: 'Dr. Marcus Thorne', role: 'Physics Teacher', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', online: true },
    { id: 'usr_cns_01', name: 'Ms. Harper', role: 'Campus Counselor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', online: true },
    { id: 'usr_adm_01', name: 'Dr. Eleanor Vance', role: 'School Principal', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', online: false }
  ];

  const [activeContact, setActiveContact] = useState(contacts[0]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      role: user.role as any,
      text: inputText,
      timestamp: 'Just now'
    };

    setMessages((prev: ChatMessage[]) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-2xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> EduPulse Direct Messaging
          </span>
          <h1 className="text-2xl font-extrabold text-white">Parent-Teacher & Counselor Hub</h1>
          <p className="text-slate-300 text-xs mt-1">Direct encrypted communication between all school stakeholders.</p>
        </div>
      </div>

      {/* Main Messaging Interface Split */}
      <div className="h-[580px] bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden glass-panel flex flex-col md:flex-row shadow-2xl">
        {/* Left Contacts Sidebar */}
        <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-4 space-y-4 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Active Conversations</p>
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${
                  activeContact.id === contact.id ? 'bg-slate-800/90 border border-brand-500/30 shadow-md' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-xl object-cover" />
                  {contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-200 truncate">{contact.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate">{contact.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="flex-1 flex flex-col justify-between bg-slate-900/60">
          {/* Thread Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeContact.avatar} alt={activeContact.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-white">{activeContact.name}</h4>
                <p className="text-[10px] text-emerald-400 font-semibold">{activeContact.role} • Online</p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg: ChatMessage) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.senderId === user.id ? 'flex-row-reverse' : ''}`}
              >
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                <div className={`max-w-[75%] space-y-1 ${msg.senderId === user.id ? 'items-end' : ''}`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.senderId === user.id
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.senderId === user.id && <CheckCheck className="w-3 h-3 text-brand-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${activeContact.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button type="submit" className="p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
