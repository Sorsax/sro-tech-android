
import { Calendar, Settings, Users } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  const { t } = useSettings();
  
  const tabs = [
    { id: 'schedule', label: t('schedule'), icon: Calendar },
    { id: 'volunteers', label: t('volunteers'), icon: Users },
    { id: 'settings', label: t('settings'), icon: Settings }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 shadow-lg">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-5 rounded-lg transition-colors ${
                isActive 
                  ? 'text-sro-olive bg-sro-olive/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-sro-olive hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationTabs;
