/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState('ar'); // قيمة أولية فقط

  // Initialize language once on mount
  useEffect(() => {
    const initializeLanguage = () => {
      try {
        // 1. Try to get from localStorage
        const savedLang = localStorage.getItem('aqrablik-language');
        
        // 2. If found and valid, use it
        if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
          console.log('📚 جلب اللغة من localStorage:', savedLang);
          setLanguage(savedLang);
          setIsInitialized(true);
          return;
        }
        
        // 3. Check HTML lang attribute
        const htmlLang = document.documentElement.lang;
        if (htmlLang && (htmlLang === 'ar' || htmlLang === 'en')) {
          console.log('🌐 استخدام لغة HTML:', htmlLang);
          localStorage.setItem('aqrablik-language', htmlLang);
          setLanguage(htmlLang);
          setIsInitialized(true);
          return;
        }
        
        // 4. Default to Arabic
        console.log('⚡ استخدام اللغة الإفتراضية: العربية');
        localStorage.setItem('aqrablik-language', 'ar');
        setLanguage('ar');
        setIsInitialized(true);
        
      } catch (error) {
        console.error('❌ خطأ في تهيئة اللغة:', error);
        setLanguage('ar');
        setIsInitialized(true);
      }
    };

    // Small delay to ensure no other scripts interfere
    setTimeout(initializeLanguage, 100);
  }, []);

  // Toggle language function
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    console.log('🔄 تبديل اللغة إلى:', newLanguage);
    
    setLanguage(newLanguage);
    
    try {
      localStorage.setItem('aqrablik-language', newLanguage);
      console.log('💾 حفظ اللغة في localStorage:', newLanguage);
    } catch (error) {
      console.warn('⚠️ لا يمكن حفظ اللغة في localStorage:', error);
    }
  }, [language]);

  // Apply language changes
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('🎯 تطبيق اللغة:', language);
    
    // Apply to HTML document
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Apply font
    document.body.style.fontFamily = "'TheYearOfHandicrafts', sans-serif";
    
  }, [language, isInitialized]);

  // Translation function
  const t = useCallback((key) => {
    if (!key) return '';
    
    // Check current language
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key] !== undefined) {
      return TRANSLATIONS[language][key];
    }
    
    // Fallback to other language
    const fallbackLang = language === 'ar' ? 'en' : 'ar';
    if (TRANSLATIONS[fallbackLang] && TRANSLATIONS[fallbackLang][key] !== undefined) {
      console.warn(`⚠️  لم يتم العثور على "${key}" في اللغة ${language}، استخدم ${fallbackLang}`);
      return TRANSLATIONS[fallbackLang][key];
    }
    
    // Key not found
    console.error(`❌ المفتاح "${key}" غير موجود في ملف الترجمات`);
    return key;
  }, [language]);

  const value = {
    language,
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