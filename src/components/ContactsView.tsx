import { useState, useEffect } from 'react';
import { Users, Phone, Mail, RefreshCw, Wifi } from 'lucide-react';

interface Contact {
  name: string;
  phone: string;
  email: string;
}

const ContactsView = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Sheets configuration
  const SHEET_ID = '1iZfopLSu7IxqF-15TYT21xEfvX_Q1-Z1OX8kzagGrDg';
  
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
  
  const fetchContactsData = async () => {
    try {
      console.log('Fetching contacts from Google Sheets');
      
      const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=YHTEYSTIEDOT`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts data');
      }
      
      const csvText = await response.text();
      console.log('Contacts CSV data received:', csvText);
      
      // Parse CSV data
      const lines = csvText.split('\n');
      const data: Contact[] = [];
      
      // Skip first 2 rows (index 0 and 1) and process data rows starting from row 3 (index 2)
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const columns = parseCSVLine(line);
          
          if (columns.length >= 3 && columns[0]) {
            data.push({
              name: columns[0] || '',
              phone: columns[1] || '',
              email: columns[2] || ''
            });
          }
        }
      }
      
      console.log('Parsed contacts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching contacts data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      try {
        const data = await fetchContactsData();
        setContacts(data);
        setError(null);
      } catch (err) {
        console.error('Error loading contacts:', err);
        setError('Virhe ladattaessa yhteystietoja Google Sheetsistä');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const refreshData = async () => {
    setContacts([]);
    setLoading(true);
    try {
      const data = await fetchContactsData();
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing contacts:', err);
      setError('Virhe ladattaessa yhteystietoja Google Sheetsistä');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-sro-olive mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300">Ladataan yhteystietoja...</p>
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
            Yritä uudelleen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bree font-bold text-sro-granite dark:text-white">Vapaaehtoiset</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">SRO Striimitiimin yhteystiedot</p>
        </div>
        <button 
          onClick={refreshData}
          className="bg-sro-olive/10 text-sro-olive p-2 rounded-lg hover:bg-sro-olive/20 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-fade-in hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <div className="bg-sro-olive/10 p-3 rounded-lg mr-4">
                <Users className="h-6 w-6 text-sro-olive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-sro-granite dark:text-white">
                  {contact.name}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-sro-olive flex-shrink-0" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-sro-olive transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {contact.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-sro-olive flex-shrink-0" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-sro-olive transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Ei yhteystietoja saatavilla</p>
        </div>
      )}
    </div>
  );
};

export default ContactsView;
