import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, ChildInfo, NotificationItem, DigitalGatePass, MoodEntry, EmergencyAlert } from '../types';
import { MOCK_USERS, MOCK_CHILDREN, MOCK_NOTIFICATIONS, MOCK_GATE_PASSES, MOCK_MOOD_ENTRIES, MOCK_EMERGENCY_ALERTS } from '../mockData/mockData';
import {
  createGatePassApi,
  createMoodEntryApi,
  createEmergencyAlertApi,
  markNotificationReadApi,
  getNotificationsApi,
  getGatePassesApi,
  getMoodEntriesApi,
  getEmergencyAlertsApi
} from '../services/api';

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
  addNotification: (notif: { title: string; message: string; type?: 'alert' | 'academic' | 'transport' | 'wellness' }) => void;
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
  authTargetRole: UserRole | null;
  setAuthTargetRole: (role: UserRole | null) => void;
  openAuthModal: (mode?: 'signin' | 'signup', targetRole?: UserRole) => void;
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
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | null>(null);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);

  // Fetch initial API data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const notifs = await getNotificationsApi();
        if (notifs && notifs.length > 0) setNotifications(notifs);

        const passes = await getGatePassesApi();
        if (passes && passes.length > 0) setGatePasses(passes);

        const moods = await getMoodEntriesApi();
        if (moods && moods.length > 0) setMoodEntries(moods);

        const emergencies = await getEmergencyAlertsApi();
        if (emergencies && emergencies.length > 0) setEmergencyAlerts(emergencies);
      } catch (err) {
        console.log('[AppContext] API load fallback active');
      }
    }
    loadInitialData();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', targetRole?: UserRole) => {
    setAuthMode(mode);
    if (targetRole) {
      setAuthTargetRole(targetRole);
    }
    setIsAuthModalOpen(true);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
  };

  const user = MOCK_USERS[role];

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await markNotificationReadApi(id);
  };

  const addNotification = (notif: { title: string; message: string; type?: 'alert' | 'academic' | 'transport' | 'wellness' }) => {
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: notif.title,
      message: notif.message,
      timestamp: 'Just now',
      read: false,
      type: notif.type || 'academic'
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const addGatePass = async (pass: Omit<DigitalGatePass, 'id' | 'status' | 'qrCodeUrl'>) => {
    const created = await createGatePassApi(pass);
    setGatePasses(prev => [created, ...prev]);
  };

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    const created = await createMoodEntryApi(entry);
    setMoodEntries(prev => [created, ...prev.filter(e => e.date !== entry.date)]);
  };

  const triggerEmergencyAlert = async (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => {
    const created = await createEmergencyAlertApi(alertData);
    setEmergencyAlerts(prev => [created, ...prev]);

    // Add to notifications stream
    addNotification({
      title: `EMERGENCY ALERT: ${alertData.title}`,
      message: alertData.message,
      type: 'alert'
    });
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
      addNotification,
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
      authTargetRole,
      setAuthTargetRole,
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
