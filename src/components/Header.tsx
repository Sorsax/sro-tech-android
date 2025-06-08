import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileView from './ProfileView';

const Header = () => {
  const { userName, t } = useSettings();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const initials = userName ? userName.charAt(0).toUpperCase() : "S";

  return (
    <header className="bg-sro-olive dark:bg-sro-olive text-white px-4 py-3 shadow-md sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <img 
              src="/lovable-uploads/b207cc73-0425-49e9-9a42-ff0709f466c8.png" 
              alt="SRO Tech Logo" 
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bree font-bold">{t('headerTitle')}</h1>
            <p className="text-white/80 text-xs font-light">{t('headerSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Avatar className="h-8 w-8 bg-white/20 border-2 border-white/30 cursor-pointer hover:bg-white/30 transition-colors">
                <AvatarFallback className="text-sm font-semibold text-white bg-transparent">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <ProfileView />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;