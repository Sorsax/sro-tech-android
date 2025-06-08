
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from '@/utils/translations';

interface SettingsContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  userName: string;
  setUserName: (name: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  useCustomOptInUrl: boolean;
  setUseCustomOptInUrl: (use: boolean) => void;
  customOptInUrl: string;
  setCustomOptInUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'fi';
  });

  const [useCustomOptInUrl, setUseCustomOptInUrlState] = useState(() => {
    const saved = localStorage.getItem('useCustomOptInUrl');
    return saved ? JSON.parse(saved) : false;
  });

  const [customOptInUrl, setCustomOptInUrlState] = useState(() => {
    return localStorage.getItem('customOptInUrl') || '';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = language;
    // Set RTL for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('useCustomOptInUrl', JSON.stringify(useCustomOptInUrl));
  }, [useCustomOptInUrl]);

  useEffect(() => {
    localStorage.setItem('customOptInUrl', customOptInUrl);
  }, [customOptInUrl]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setUseCustomOptInUrl = (use: boolean) => {
    setUseCustomOptInUrlState(use);
  };

  const setCustomOptInUrl = (url: string) => {
    setCustomOptInUrlState(url);
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <SettingsContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      userName, 
      setUserName, 
      language, 
      setLanguage,
      t,
      useCustomOptInUrl,
      setUseCustomOptInUrl,
      customOptInUrl,
      setCustomOptInUrl
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
