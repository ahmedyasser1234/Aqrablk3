/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // Initialize state directly from localStorage to recognize language immediately
  const [language, setLanguage] = useState(() => {
    try {
      // Check localStorage for persistence
      const savedLang = localStorage.getItem('aqrablik-language');
      if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        return savedLang;
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    }
    return 'ar'; // Default fallback
  });

  const [isInitialized, setIsInitialized] = useState(true);

  // Update localStorage and document attributes whenever language changes
  useEffect(() => {
    try {
      localStorage.setItem('aqrablik-language', language);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.body.style.fontFamily = "'TheYearOfHandicrafts', sans-serif";
      console.log('Language updated to:', language);
    } catch (error) {
      console.error('Error updating language settings:', error);
    }
  }, [language]);

  // Toggle language function - now just updates state
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  }, []);

  const t = useCallback((key) => {
    if (!key) return '';

    // Check current language
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key] !== undefined) {
      return TRANSLATIONS[language][key];
    }

    // Fallback
    const fallbackLang = language === 'ar' ? 'en' : 'ar';
    if (TRANSLATIONS[fallbackLang] && TRANSLATIONS[fallbackLang][key] !== undefined) {
      return TRANSLATIONS[fallbackLang][key];
    }

    return key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isInitialized
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};