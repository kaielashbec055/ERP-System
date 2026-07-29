import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile, ChildInfo, NotificationItem, DigitalGatePass, MoodEntry, EmergencyAlert } from '../types';
import { MOCK_USERS, MOCK_CHILDREN, MOCK_NOTIFICATIONS, MOCK_GATE_PASSES, MOCK_MOOD_ENTRIES, MOCK_EMERGENCY_ALERTS } from '../mockData/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedChild: ChildInfo;
  setSelectedChild: (child: ChildInfo) => void;
  childrenList: ChildInfo[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  gatePasses: DigitalGatePass[];
  addGatePass: (pass: Omit<DigitalGatePass, 'id' | 'status' | 'qrCodeUrl'>) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  emergencyAlerts: EmergencyAlert[];
  triggerEmergencyAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  isLandingPage: boolean;
  setIsLandingPage: (isLanding: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [childrenList] = useState<ChildInfo[]>(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<ChildInfo>(MOCK_CHILDREN[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [gatePasses, setGatePasses] = useState<DigitalGatePass[]>(MOCK_GATE_PASSES);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(MOCK_MOOD_ENTRIES);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(MOCK_EMERGENCY_ALERTS);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
  };

  const user = MOCK_USERS[role];

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addGatePass = (pass: Omit<DigitalGatePass, 'id' | 'status' | 'qrCodeUrl'>) => {
    const newPass: DigitalGatePass = {
      ...pass,
      id: `gp_${Date.now()}`,
      status: 'approved',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-EDUPULSE-2026-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setGatePasses(prev => [newPass, ...prev]);
  };

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: `m_${Date.now()}`
    };
    setMoodEntries(prev => [newEntry, ...prev.filter(e => e.date !== entry.date)]);
  };

  const triggerEmergencyAlert = (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => {
    const newAlert: EmergencyAlert = {
      ...alertData,
      id: `emg_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      status: 'active'
    };
    setEmergencyAlerts(prev => [newAlert, ...prev]);
    // Add to notifications
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `EMERGENCY ALERT: ${alertData.title}`,
      message: alertData.message,
      timestamp: 'Just now',
      read: false,
      type: 'alert'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      user,
      activeTab,
      setActiveTab,
      selectedChild,
      setSelectedChild,
      childrenList,
      notifications,
      markNotificationRead,
      gatePasses,
      addGatePass,
      moodEntries,
      addMoodEntry,
      emergencyAlerts,
      triggerEmergencyAlert,
      isSosModalOpen,
      setIsSosModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      openAuthModal,
      isLandingPage,
      setIsLandingPage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
