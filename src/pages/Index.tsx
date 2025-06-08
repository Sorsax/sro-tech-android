
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ScheduleView from '../components/ScheduleView';
import ContactsView from '../components/ContactsView';
import SettingsView from '../components/SettingsView';
import NavigationTabs from '../components/NavigationTabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [mounted, setMounted] = useState(false);

  // Ensure app starts with clean state regardless of device preferences
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent flicker
  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleView />;
      case 'volunteers':
        return <ContactsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ScheduleView />;
    }
  };

  return (
    <div className="min-h-screen bg-sro-gray dark:bg-gray-900 flex flex-col max-w-md mx-auto">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
