import React, { createContext, useContext, useState } from 'react';
import { ChatMessage, UserRole } from '../types';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, currentRole: UserRole) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_ai',
      senderId: 'ai_bot',
      senderName: 'EduPulse AI Guide',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: 'assistant',
      text: 'Greetings! I am EduPulse AI, your unified academic guide and safety assistant. How can I support your school journey today?',
      timestamp: 'Just now',
      suggestedActions: [
        'How can I prepare for Physics?',
        'Where is Bus-14 right now?',
        'Show my attendance report',
        'Emergency SOS guidance'
      ]
    }
  ]);

  const generateAIResponse = (userPrompt: string, role: UserRole): string => {
    const promptLower = userPrompt.toLowerCase();

    if (promptLower.includes('physics') || promptLower.includes('exam') || promptLower.includes('study')) {
      return `Based on Alex's latest scores (94% in Physics), here is your AI Study Plan for the upcoming exam:\n\n1. Review Quantum Wave Functions (Lab #3 reference).\n2. Practice Problem Set #4 due July 31st.\n3. Focus 15 mins on Thermodynamics formula sheet.\n\nWould you like me to generate a 5-question mock quiz?`;
    }

    if (promptLower.includes('bus') || promptLower.includes('route') || promptLower.includes('where')) {
      return `🚌 **Live Transport Update**:\n- **Bus Number**: BUS-14 (North Sector Express)\n- **Status**: On Time (38 km/h)\n- **Current Stop**: Approaching Maple Street Circle (Vance Stop)\n- **ETA to Home**: 8 minutes\n- **Driver**: Robert Jenkins (+1 555-382-9910)`;
    }

    if (promptLower.includes('attendance') || promptLower.includes('report') || promptLower.includes('gpa')) {
      return `📊 **Academic & Attendance Summary**:\n- **Overall Attendance**: 97.5% (60/62 days present)\n- **Current GPA**: 3.88 / 4.0\n- **Top Subject**: Computer Science (98%)\n- **Action Item**: 1 pending history assignment due Aug 4.`;
    }

    if (promptLower.includes('sos') || promptLower.includes('emergency') || promptLower.includes('safety')) {
      return `🚨 **EduPulse Emergency SOS Protocol**:\n- Active emergency notifications are broadcasted immediately to parents & staff.\n- School Gate B security is on high alert.\n- Transport driver dispatched live status updates.\n\nUse the **SOS Red Button** on the top header bar to issue an urgent campus alert!`;
    }

    if (role === 'teacher') {
      return `👨‍🏫 **Teacher AI Insight**:\nAnalyzed Class 10-A performance matrix:\n- **2 Students Flagged**: Liam Hemsworth (Physics score drop) & Chloe Bennett (High stress pattern).\n- Recommended: Send automated study recap to Liam's parent and flag Chloe for Counselor Ms. Harper.`;
    }

    if (role === 'parent') {
      return `👩‍👦 **Parent AI Assistant**:\n- Alex Vance: 97.5% attendance, 3.88 GPA, Bus #14 en route.\n- Maya Vance: Fee balance $450 due in 10 days.\nWould you like to pay fees or book a teacher meeting?`;
    }

    if (role === 'admin') {
      return `🏛️ **Administration Command Summary**:\n- Total Active Students: 1,240\n- On-Campus Staff: 86/88\n- Active Bus Fleet: 42/42 (1 minor delay on Route 9 due to traffic).\n- System Status: All safety sensors & gate passes nominal.`;
    }

    return `I am analyzing your query with EduPulse AI intelligence. For "${userPrompt}", our system records show optimal performance metrics and all safety protocols active. Is there a specific report or contact you need?`;
  };

  const sendMessage = (text: string, role: UserRole) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);

    // Simulate AI response with slight delay
    setTimeout(() => {
      const aiReplyText = generateAIResponse(text, role);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        senderId: 'ai_bot',
        senderName: 'EduPulse AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: aiReplyText,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      sendMessage,
      clearMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
