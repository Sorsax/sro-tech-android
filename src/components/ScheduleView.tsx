import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { RefreshCw, Wifi, Calendar, Clock, History, ChevronDown, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';

interface ScheduleItem {
  date: string;
  event: string;
  volunteers: string;
  backup: string;
  notes: string;
}

const ScheduleView = () => {
  const { toast } = useToast();
  const { t } = useSettings();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showMore, setShowMore] = useState(false);
  const EVENTS_TO_SHOW = 3;
  const CURRENT_YEAR = '2025';

  // Google Sheets configuration
  const SHEET_ID = '1iZfopLSu7IxqF-15TYT21xEfvX_Q1-Z1OX8kzagGrDg';
  
  // Available years for past events
  const availableYears = ['2022', '2023', '2024', '2025'];
  
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };
  
  const fetchGoogleSheetData = async (year: string = '2025') => {
    try {
      console.log('Fetching data from Google Sheets for year:', year);
      
      const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${year}`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data for year ${year}`);
      }
      
      const csvText = await response.text();
      console.log('CSV data received:', csvText);
      
      // Parse CSV data
      const lines = csvText.split('\n');
      const data: ScheduleItem[] = [];
      
      // Skip first 2 rows (index 0 and 1) and process data rows starting from row 3 (index 2)
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          // Use proper CSV parsing to handle quoted fields with commas
          const columns = parseCSVLine(line);
          
          if (columns.length >= 5 && columns[0]) {
            data.push({
              date: columns[0] || '',
              event: columns[1] || '',
              volunteers: columns[2] || '',
              backup: columns[3] || '',
              notes: columns[4] || ''
            });
          }
        }
      }
      
      console.log('Parsed data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      throw error;
    }
  };

  const handleOptInSuccess = (eventDate: string, userName: string) => {
    // Find the event in current data and update it locally for immediate feedback
    const eventIndex = scheduleData.findIndex(item => item.date === eventDate);
    if (eventIndex !== -1) {
      const updatedData = [...scheduleData];
      const currentVolunteers = updatedData[eventIndex].volunteers;
      updatedData[eventIndex].volunteers = currentVolunteers 
        ? `${currentVolunteers}, ${userName}` 
        : userName;
      setScheduleData(updatedData);
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
      return true; // If can't parse, show it to be safe
    }
  };

  const filteredData = scheduleData.filter(item => {
    if (showPastEvents) {
      // For past events, show all events from the selected year
      return true;
    } else {
      // For future events, only show future events from current year (2025)
      return isEventInFuture(item.date);
    }
  });

  const displayedEvents = showMore || showPastEvents 
    ? filteredData 
    : filteredData.slice(0, EVENTS_TO_SHOW);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const yearToFetch = showPastEvents ? selectedYear : CURRENT_YEAR;
        const data = await fetchGoogleSheetData(yearToFetch);
        setScheduleData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(t('errorLoadingSheets'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showPastEvents, selectedYear, t]);

  const refreshData = async () => {
    setScheduleData([]);
    setLoading(true);
    try {
      const yearToFetch = showPastEvents ? selectedYear : CURRENT_YEAR;
      const data = await fetchGoogleSheetData(yearToFetch);
      setScheduleData(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(t('errorLoadingSheets'));
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePastEvents = () => {
    setShowPastEvents(!showPastEvents);
    setShowMore(false);
    if (!showPastEvents) {
      // When switching to past events, default to 2024
      setSelectedYear('2024');
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-sro-olive mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">{t('loadingFromSheets')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <Wifi className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="bg-sro-olive text-white px-4 py-2 rounded-lg hover:bg-sro-olive/90 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bree font-bold text-sro-granite dark:text-white">
            {showPastEvents ? `${t('pastEvents')} ${selectedYear}` : t('upcomingSchedule')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {showPastEvents ? t('pastTasks') : t('upcomingTasks')}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleTogglePastEvents}
            className={`p-2 rounded-lg transition-colors ${
              showPastEvents 
                ? 'bg-sro-olive text-white' 
                : 'bg-sro-olive/10 text-sro-olive hover:bg-sro-olive/20'
            }`}
          >
            {showPastEvents ? <Clock className="h-5 w-5" /> : <History className="h-5 w-5" />}
          </button>
          <button 
            onClick={refreshData}
            className="bg-sro-olive/10 text-sro-olive p-2 rounded-lg hover:bg-sro-olive/20 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showPastEvents && (
        <div className="mb-4">
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-sro-granite dark:text-white focus:outline-none focus:ring-2 focus:ring-sro-olive focus:border-transparent"
            >
              {availableYears.filter(year => year !== CURRENT_YEAR).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayedEvents.map((item, displayIndex) => {
          // Calculate the actual index in the full dataset for current year events
          let eventIndex: number | undefined = undefined;
          
          // Only assign index if we're showing current year data
          if (!showPastEvents || selectedYear === CURRENT_YEAR) {
            // Find the position of this event in the original scheduleData array
            eventIndex = scheduleData.findIndex(event => 
              event.date === item.date && 
              event.event === item.event &&
              event.volunteers === item.volunteers
            );
          }

          return (
            <EventCard
              key={displayIndex}
              date={item.date}
              event={item.event}
              volunteers={item.volunteers}
              backup={item.backup}
              notes={item.notes}
              index={eventIndex}
              onOptInSuccess={handleOptInSuccess}
            />
          );
        })}
      </div>

      {!showPastEvents && filteredData.length > EVENTS_TO_SHOW && !showMore && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => setShowMore(true)}
            variant="outline" 
            className="border-sro-olive text-sro-olive hover:bg-sro-olive/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('showMore')} ({filteredData.length - EVENTS_TO_SHOW} {t('moreEvents')})
          </Button>
        </div>
      )}

      {!showPastEvents && showMore && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => setShowMore(false)}
            variant="outline" 
            className="border-sro-olive text-sro-olive hover:bg-sro-olive/10"
          >
            {t('showLess')}
          </Button>
        </div>
      )}

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {showPastEvents ? t('noPastEvents') : t('noUpcomingEvents')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
