/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // Initialize state directly from localStorage to recognize language immediately
  const [language, setLanguage] = useState(() => {
    try {
      const savedLang = localStorage.getItem('aqrablik-language');
      if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
        return savedLang;
      }
      const htmlLang = document.documentElement.lang;
      if (htmlLang && (htmlLang === 'ar' || htmlLang === 'en')) {
        return htmlLang;
      }
    } catch (error) {
      console.error('Error reading language from local storage:', error);
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

  // Toggle language function - now just redirects
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    const currentPath = window.location.pathname;
    // Replace /ar/ with /en/ or vice versa
    // Assuming path starts with /ar or /en
    const pathSegments = currentPath.split('/');
    if (pathSegments[1] === 'ar' || pathSegments[1] === 'en') {
      pathSegments[1] = newLanguage;
      window.location.href = pathSegments.join('/');
      // using window.location to ensure full reload or just use navigation?
      // Better to use navigation if I had access to useNavigate, but I am in Provider.
      // Actually, since this is a SPA, I should ideally use navigate.
      // But Provider is outside Router in my new App.jsx? 
      // No, LanguageProvider wraps Router.
      // So I cannot use useNavigate here directly unless I move Provider inside.
      // However, I can just do window.location.pathname mutation which is safe but full reload.
      // User asked for "refresh on English stays English", so maybe full reload is fine?
      // Or I can just expose `setLanguage` and let the UI components handle the navigation!
      // Yes, let Navbar handle the navigation.
    }
  }, [language]);

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