import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { BusTracker } from './components/modules/safety/BusTracker';
import { DigitalGatePass } from './components/modules/safety/DigitalGatePass';
import { WellnessDashboard } from './components/modules/wellness/WellnessDashboard';
import { ChatModule } from './components/modules/communication/ChatModule';
import { Announcements } from './components/modules/communication/Announcements';
import { LandingPage } from './components/modules/landing/LandingPage';
import { AuthModal } from './components/modules/landing/AuthModal';
import { EmergencySOSModal } from './components/modules/safety/EmergencySOSModal';
import { FloatingAIAssistant } from './components/ai/FloatingAIAssistant';

const AppContent: React.FC = () => {
  const { role, activeTab, isLandingPage } = useApp();

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <LandingPage />
        <AuthModal />
        <FloatingAIAssistant />
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === 'student') return <StudentDashboard />;
        if (role === 'parent') return <ParentDashboard />;
        if (role === 'teacher') return <TeacherDashboard />;
        if (role === 'admin') return <AdminDashboard />;
        return <StudentDashboard />;

      case 'academics':
      case 'achievements':
        return <StudentDashboard />;

      case 'safety':
        return (
          <div className="space-y-8">
            <BusTracker />
            <DigitalGatePass />
          </div>
        );

      case 'wellness':
        return <WellnessDashboard />;

      case 'communication':
        return (
          <div className="space-y-8">
            <ChatModule />
            <Announcements />
          </div>
        );

      case 'fees':
        return <ParentDashboard />;

      case 'class_mgmt':
      case 'attendance_mgr':
        return <TeacherDashboard />;

      case 'sos_command':
        return <AdminDashboard />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Main Navbar (Role Switcher top bar removed as requested) */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Role-based Navigation Sidebar */}
        <Sidebar />

        {/* Central Dynamic Screen Content with Animated Page Transitions */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${role}`}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating AI Assistant (Fixed Bottom-Right Corner) */}
      <FloatingAIAssistant />

      {/* Global Modals */}
      <EmergencySOSModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AppProvider>
  );
}

export default App;
