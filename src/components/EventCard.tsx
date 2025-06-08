import { Calendar, Users, UserCheck, StickyNote, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface EventCardProps {
  date: string;
  event: string;
  volunteers: string;
  backup: string;
  notes: string;
  index?: number;
  onOptInSuccess?: (date: string, name: string) => void;
}

const EventCard = ({ date, event, volunteers, backup, notes, index, onOptInSuccess }: EventCardProps) => {
  const { userName, useCustomOptInUrl, customOptInUrl, t } = useSettings();
  const { toast } = useToast();
  const [isOptingIn, setIsOptingIn] = useState(false);

  // Default Google Apps Script webhook URL
  const DEFAULT_WEBHOOK_URL = 'https://cors-anywhere-sro-tech.onrender.com/https://script.google.com/macros/s/AKfycbz-mdKs3K5NwqplOvV2lhQAN0a583vz-fZQWwYTQgZes6BE3zytE8HBpjpFXU6Td9pL/exec';

  const formatDate = (dateStr: string) => {
    try {
      // Handle both dot and slash formats: "5.1.2025" or "5/1/2025"
      const parts = dateStr.includes('.') ? dateStr.split('.') : dateStr.split('/');
      const [day, month, year] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return {
        dayName: date.toLocaleDateString('fi-FI', { weekday: 'short' }),
        day: day.padStart(2, '0'),
        month: date.toLocaleDateString('fi-FI', { month: 'short' })
      };
    } catch {
      return { dayName: '', day: dateStr, month: '' };
    }
  };

  const isEventInFuture = (dateStr: string): boolean => {
    try {
      const parts = dateStr.includes('.') ? dateStr.split('.') : dateStr.split('/');
      const [day, month, year] = parts;
      const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    } catch {
      return true;
    }
  };

  const handleOptIn = async () => {
    if (!userName.trim()) {
      alert(t('setNameFirst'));
      return;
    }

    if (index === undefined) {
      console.error('Event index is undefined, cannot opt in');
      toast({
        title: t('optInError') || "Ilmoittautuminen epäonnistui",
        description: "Tapahtuman indeksi puuttuu. Yritä päivittää sivu.",
        variant: "destructive",
      });
      return;
    }

    // Determine which URL to use
    const webhookUrl = useCustomOptInUrl && customOptInUrl.trim() 
      ? customOptInUrl.trim() 
      : DEFAULT_WEBHOOK_URL;

    setIsOptingIn(true);
    try {
      console.log(`Attempting to opt in ${userName} for event on ${date} with index ${index}`);
      console.log(`Using webhook URL: ${webhookUrl}`);

      // Calculate row as 4 + event index
      const targetRow = 4 + index;

      // Combine current volunteers with new opt-in
      const currentVolunteers = volunteers.trim();
      const newVolunteersList = currentVolunteers 
        ? `${currentVolunteers}, ${userName}` 
        : userName;

      const payload = {
        row: targetRow.toString(),
        value: newVolunteersList
      };

      console.log('Sending payload:', JSON.stringify(payload));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: t('optInSuccess') || "Ilmoittautuminen onnistui!",
        description: `${t('optInSuccessDesc') || "Olet nyt ilmoittautunut tapahtumaan"}: ${event}`,
      });

      if (onOptInSuccess) {
        onOptInSuccess(date, userName);
      }

      console.log('Opt-in successful!');

    } catch (error) {
      console.error('Error during opt-in:', error);
      toast({
        title: t('optInError') || "Ilmoittautuminen epäonnistui",
        description: t('optInErrorDesc') || "Tapahtui virhe ilmoittautumisessa. Yritä myöhemmin uudelleen.",
        variant: "destructive",
      });
    } finally {
      setIsOptingIn(false);
    }
  };

  const formattedDate = formatDate(date);
  const isFutureEvent = isEventInFuture(date);
  const isUserAlreadyVolunteering = volunteers.toLowerCase().includes(userName.toLowerCase()) && userName.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4 animate-fade-in hover:shadow-md transition-shadow w-full">
      {/* Date Section */}
      <div className="flex items-center mb-3">
        <div className="bg-sro-olive text-white rounded-lg p-3 mr-4 min-w-[60px] text-center">
          <div className="text-xs font-medium uppercase">{formattedDate.dayName}</div>
          <div className="text-lg font-bold">{formattedDate.day}</div>
          <div className="text-xs uppercase">{formattedDate.month}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-sro-granite dark:text-white mb-1 leading-tight">
            {event}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            {date}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-3">
        {volunteers && (
          <div className="flex items-start space-x-3">
            <Users className="h-4 w-4 text-sro-olive mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-sro-granite dark:text-white">{t('volunteers')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{volunteers}</div>
            </div>
          </div>
        )}

        {backup && (
          <div className="flex items-start space-x-3">
            <UserCheck className="h-4 w-4 text-sro-olive mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-sro-granite dark:text-white">{t('backup')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{backup}</div>
            </div>
          </div>
        )}

        {notes && (
          <div className="flex items-start space-x-3">
            <StickyNote className="h-4 w-4 text-sro-olive mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-sro-granite dark:text-white">{t('notes')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{notes}</div>
            </div>
          </div>
        )}

        {/* Opt-in Button for Future Events */}
        {isFutureEvent && userName.trim() && !isUserAlreadyVolunteering && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-600 w-full">
            <Button 
              onClick={handleOptIn}
              disabled={isOptingIn}
              size="sm"
              className="w-full bg-sro-olive hover:bg-sro-olive/90 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isOptingIn ? t('optingIn') : t('optInButton')}
            </Button>
          </div>
        )}

        {isUserAlreadyVolunteering && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
            <div className="text-sm text-sro-olive font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              {t('alreadyOptedIn')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;