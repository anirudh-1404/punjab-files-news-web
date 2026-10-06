import React, { createContext, useContext, useState, useEffect } from 'react';
import { triggerGoogleTranslate, setGoogleTranslateCookie } from '../services/translator';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'pa', name: 'ਪੰਜਾਬੀ', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'hi', name: 'हिंदी', label: 'हिंदी (Hindi)' },
  { code: 'en', name: 'English', label: 'English' }
];

const STORAGE_KEY = 'punjab_files_user_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['pa', 'hi', 'en'].includes(saved)) {
        return saved;
      }
    } catch (e) {}
    return 'pa'; // Punjabi is strictly the default
  });

  const changeLanguage = (newLang) => {
    if (!['pa', 'hi', 'en'].includes(newLang)) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('punjab_language_changed', { detail: newLang }));

    // Seamlessly trigger full website translation
    triggerGoogleTranslate(newLang);
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue && ['pa', 'hi', 'en'].includes(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        activeLangObj,
        languages: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'pa',
      setLanguage: () => {},
      activeLangObj: LANGUAGES[0],
      languages: LANGUAGES
    };
  }
  return context;
}
