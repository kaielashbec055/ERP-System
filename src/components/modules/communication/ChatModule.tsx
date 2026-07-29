import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ChatMessage } from '../../../types';
import { MessageSquare, Send, Search, Paperclip, CheckCheck, UserCheck, Bot, Sparkles } from 'lucide-react';
import { sendAiChatApi } from '../../../services/api';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  channelTopic: string;
  initialMessages: ChatMessage[];
}

export const ChatModule: React.FC = () => {
  const { user, role, addNotification } = useApp();

  const getAiAgentContact = (): Contact => ({
    id: 'ai_agent_01',
    name: 'EduPulse AI Agent',
    role: '24/7 AI Academic & Safety Guide',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    online: true,
    channelTopic: 'Instant Doubt Clearing & AI Support',
    initialMessages: [
      {
        id: 'ai_m1',
        senderId: 'ai_agent_01',
        senderName: 'EduPulse AI Agent',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: `Greetings ${user.name}! I am your assigned EduPulse AI Agent for the ${role} persona. Send me any doubts, schedule questions, or campus inquiries for immediate help.`,
        timestamp: 'Just now'
      }
    ]
  });

  // Generate role-specific contact channels
  const getRoleContacts = (): Contact[] => {
    const aiAgent = getAiAgentContact();
    switch (role) {
      case 'student':
        return [
          aiAgent,
          {
            id: 'tch_01',
            name: 'Dr. Marcus Thorne',
            role: 'Physics & Math Teacher',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'Physics & Calculus Doubt Clearing',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'tch_01',
                senderName: 'Dr. Marcus Thorne',
                senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Hello Alex! Excellent job on Problem Set #4. Do you have any questions regarding Newton’s Laws for tomorrow’s quiz?',
                timestamp: '09:15 AM'
              },
              {
                id: 'm2',
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                role: 'student',
                text: 'Hi Dr. Thorne! Yes, I had a doubt regarding the friction coefficient calculation on inclined planes.',
                timestamp: '09:18 AM'
              },
              {
                id: 'm3',
                senderId: 'tch_01',
                senderName: 'Dr. Marcus Thorne',
                senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Remember to resolve the gravitational force into perpendicular (m*g*cosθ) and parallel (m*g*sinθ) components. Friction equals μ * N.',
                timestamp: '09:20 AM'
              }
            ]
          },
          {
            id: 'cns_01',
            name: 'Ms. Harper',
            role: 'Campus Counselor',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'Academic Guidance & Wellness Support',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'cns_01',
                senderName: 'Ms. Harper',
                senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Hi Alex! I saw your wellness check-in today. Remember to take short study breaks during exam preparation!',
                timestamp: 'Yesterday'
              }
            ]
          }
        ];

      case 'parent':
        return [
          aiAgent,
          {
            id: 'tch_01',
            name: 'Dr. Marcus Thorne',
            role: 'Class 10-A Head Educator',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: "Alex's Progress & Attendance Inquiries",
            initialMessages: [
              {
                id: 'm1',
                senderId: 'tch_01',
                senderName: 'Dr. Marcus Thorne',
                senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Hello Mrs. Vance! Alex is performing exceptionally well in Physics. Current GPA is 3.88.',
                timestamp: '10:30 AM'
              },
              {
                id: 'm2',
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                role: 'parent',
                text: 'Thank you Dr. Thorne! I wanted to check if the science fair project deadline is next Friday?',
                timestamp: '10:35 AM'
              },
              {
                id: 'm3',
                senderId: 'tch_01',
                senderName: 'Dr. Marcus Thorne',
                senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Yes, next Friday at 3:00 PM. Alex has already submitted the project outline.',
                timestamp: '10:38 AM'
              }
            ]
          },
          {
            id: 'adm_01',
            name: 'Dr. Eleanor Vance',
            role: 'School Principal',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
            online: false,
            channelTopic: 'Administration & Fee Receipts',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'adm_01',
                senderName: 'Dr. Eleanor Vance',
                senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                role: 'admin',
                text: 'Dear Parents, Term II fee receipts are now available in the Fee Portal.',
                timestamp: 'Monday'
              }
            ]
          }
        ];

      case 'teacher':
        return [
          aiAgent,
          {
            id: 'std_01',
            name: 'Alex Vance',
            role: 'Student (Grade 10-A)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'Physics Doubt Clearing',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'std_01',
                senderName: 'Alex Vance',
                senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                role: 'student',
                text: 'Dr. Thorne, could you clarify the formula for kinetic energy in collision problems?',
                timestamp: '08:45 AM'
              },
              {
                id: 'm2',
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                role: 'teacher',
                text: 'In elastic collisions, KE = 1/2 * m * v² is conserved before and after impact.',
                timestamp: '08:50 AM'
              }
            ]
          },
          {
            id: 'prn_01',
            name: 'Sarah Vance',
            role: 'Parent (Alex Vance)',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'Parent Communication & Updates',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'prn_01',
                senderName: 'Sarah Vance',
                senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                role: 'parent',
                text: 'Hello Dr. Thorne, thank you for sending Alex’s progress report!',
                timestamp: 'Yesterday'
              }
            ]
          },
          {
            id: 'adm_01',
            name: 'Dr. Eleanor Vance',
            role: 'School Principal',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
            online: false,
            channelTopic: 'Curriculum & Faculty Approvals',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'adm_01',
                senderName: 'Dr. Eleanor Vance',
                senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                role: 'admin',
                text: 'Dr. Thorne, the STEM lab equipment budget for Class 10-A has been approved.',
                timestamp: '2 days ago'
              }
            ]
          }
        ];

      case 'admin':
      default:
        return [
          aiAgent,
          {
            id: 'tch_01',
            name: 'Dr. Marcus Thorne',
            role: 'Physics Dept Head',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'Faculty Progress & Exam Approvals',
            initialMessages: [
              {
                id: 'm1',
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                role: 'admin',
                text: 'Dr. Thorne, please submit the final mid-term examination papers by Friday.',
                timestamp: '09:00 AM'
              },
              {
                id: 'm2',
                senderId: 'tch_01',
                senderName: 'Dr. Marcus Thorne',
                senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                role: 'teacher',
                text: 'Will do, Principal Vance. Physics and Math question papers are ready.',
                timestamp: '09:05 AM'
              }
            ]
          },
          {
            id: 'prn_01',
            name: 'Sarah Vance',
            role: 'PTA Parent Representative',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            online: true,
            channelTopic: 'PTA Committee & Event Logistics',
            initialMessages: [
              {
                id: 'm1',
                senderId: 'prn_01',
                senderName: 'Sarah Vance',
                senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                role: 'parent',
                text: 'Good morning Principal Vance! The PTA annual meeting date is confirmed.',
                timestamp: 'Yesterday'
              }
            ]
          }
        ];
    }
  };

  const contacts = getRoleContacts();
  const [activeContact, setActiveContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(contacts[0].initialMessages);
  const [inputText, setInputText] = useState('');

  // Update conversation thread when contact changes or role switches
  useEffect(() => {
    const updatedContacts = getRoleContacts();
    setActiveContact(updatedContacts[0]);
    setMessages(updatedContacts[0].initialMessages);
  }, [role]);

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    setMessages(contact.initialMessages);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      role: user.role as any,
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev: ChatMessage[]) => [...prev, newMsg]);

    // Push notification to global notification stream for all roles
    addNotification({
      title: `Message sent to ${activeContact.name}`,
      message: `${user.name}: "${textToSend.substring(0, 45)}${textToSend.length > 45 ? '...' : ''}"`,
      type: 'academic'
    });

    // If contacting AI Agent or if recipient is AI
    if (activeContact.id === 'ai_agent_01' || activeContact.role.includes('AI')) {
      try {
        const res = await sendAiChatApi(textToSend, role);
        const aiReply: ChatMessage = {
          id: `ai_reply_${Date.now()}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderAvatar: activeContact.avatar,
          role: 'assistant',
          text: res.text || `I have logged your request as ${role}. How else may I assist you today?`,
          timestamp: 'Just now'
        };
        setMessages((prev: ChatMessage[]) => [...prev, aiReply]);
      } catch {
        const fallbackReply: ChatMessage = {
          id: `ai_reply_${Date.now()}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderAvatar: activeContact.avatar,
          role: 'assistant',
          text: `EduPulse AI Agent received your message. I am here to help ${role} with academic doubt clearing, scheduling, and school safety inquiries.`,
          timestamp: 'Just now'
        };
        setMessages((prev: ChatMessage[]) => [...prev, fallbackReply]);
      }
    } else {
      // Human contact auto-acknowledgment simulation
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `auto_${Date.now()}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderAvatar: activeContact.avatar,
          role: activeContact.role.toLowerCase().includes('teacher') ? 'teacher' : activeContact.role.toLowerCase().includes('parent') ? 'parent' : 'admin',
          text: `Thank you for your message, ${user.name}. I have received it and will follow up shortly.`,
          timestamp: 'Just now'
        };
        setMessages((prev: ChatMessage[]) => [...prev, autoReply]);
        addNotification({
          title: `Reply from ${activeContact.name}`,
          message: autoReply.text,
          type: 'academic'
        });
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-200 shadow-md text-white flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-white" /> EduPulse Role-Based Messaging
          </span>
          <h1 className="text-2xl font-extrabold">
            {role === 'student' ? 'Student Doubt & Homework Channel' :
             role === 'parent' ? 'Parent-Teacher Progress Desk' :
             role === 'teacher' ? 'Educator Communication Portal' : 'Admin Command Messaging'}
          </h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">
            Encrypted direct channel for {role} communication.
          </p>
        </div>
      </div>

      {/* Main Messaging Interface Split */}
      <div className="h-[580px] bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl overflow-hidden shadow-md flex flex-col md:flex-row">
        {/* Left Contacts Sidebar */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-4 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 font-medium focus:outline-none focus:border-[#4F7CFF]"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">Active Channels ({role.toUpperCase()})</p>
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                  activeContact.id === contact.id ? 'bg-white border border-slate-200 shadow-xs ring-2 ring-[#4F7CFF]' : 'hover:bg-slate-100/80'
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-xl object-cover" />
                  {contact.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-extrabold text-xs text-[#1E293B] truncate">{contact.name}</h5>
                  <p className="text-[10px] text-[#4F7CFF] font-extrabold truncate">{contact.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{contact.channelTopic}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Thread Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h4 className="font-extrabold text-xs text-[#1E293B]">{activeContact.name}</h4>
                <p className="text-[10px] text-emerald-600 font-extrabold">{activeContact.role} • {activeContact.channelTopic}</p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
            {messages.map((msg: ChatMessage) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.senderId === user.id ? 'flex-row-reverse' : ''}`}
              >
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                <div className={`max-w-[75%] space-y-1 ${msg.senderId === user.id ? 'items-end' : ''}`}>
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.senderId === user.id
                      ? 'bg-[#4F7CFF] text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-[#1E293B] border border-slate-200 rounded-tl-none shadow-xs'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.senderId === user.id && <CheckCheck className="w-3 h-3 text-[#4F7CFF]" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeContact.name}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-[#1E293B] placeholder-slate-400 font-medium focus:outline-none focus:border-[#4F7CFF]"
            />
            <button type="submit" className="p-2.5 bg-[#4F7CFF] hover:bg-blue-600 text-white rounded-2xl shadow-sm cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
