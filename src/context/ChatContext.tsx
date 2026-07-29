import React, { createContext, useContext, useState } from 'react';
import { ChatMessage, UserRole } from '../types';
import { sendAiChatApi } from '../services/api';

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

  const sendMessage = async (text: string, role: UserRole) => {
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

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendAiChatApi(text, role);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        senderId: 'ai_bot',
        senderName: 'EduPulse AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: res.text,
        timestamp: 'Just now',
        suggestedActions: res.suggestedActions || ['View Physics Notes', 'Check Bus Telemetry']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        senderId: 'ai_bot',
        senderName: 'EduPulse AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: `EduPulse AI processed query for ${role}. All campus safety, transport, and academic telemetry active.`,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
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
