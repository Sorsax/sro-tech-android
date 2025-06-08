
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';

const ProfileView = () => {
  const { userName, setUserName, t } = useSettings();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-sro-olive mr-3" />
          <h2 className="text-xl font-bree font-bold text-sro-granite dark:text-white">{t('profile')}</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('profileDescription')}</p>
      </div>

      <div className="space-y-6">
        {/* Name Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div className="space-y-3">
            <Label className="text-base font-medium text-sro-granite dark:text-white">
              {t('name')}
            </Label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
