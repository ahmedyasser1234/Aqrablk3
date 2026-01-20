/* eslint-disable react-refresh/only-export-components */
// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // جلب اللغة من localStorage أو من HTML lang attribute
  const [language, setLanguage] = useState(() => {
    // أولاً: جرب من localStorage
    const savedLanguage = localStorage.getItem('aqrablik-language');
    if (savedLanguage) return savedLanguage;
    
    // ثانياً: جرب من HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && (htmlLang === 'ar' || htmlLang === 'en')) return htmlLang;
    
    // ثالثاً: جرب من اتجاه الصفحة
    const dir = document.documentElement.dir;
    if (dir === 'rtl') return 'ar';
    if (dir === 'ltr') return 'en';
    
    // أخيراً: إفتراضي عربي
    return 'ar';
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('aqrablik-language', newLanguage);
  };

  useEffect(() => {
    console.log('🌐 تغيير اللغة إلى:', language);
    
    // حفظ اللغة في localStorage
    localStorage.setItem('aqrablik-language', language);
    
    // تغيير direction للصفحة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // استخدام TheYearOfHandicrafts فقط
    document.body.style.fontFamily = "'TheYearOfHandicrafts', sans-serif";
    
  }, [language]);

  // دالة للترجمة
  const t = useCallback((key) => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key] !== undefined) {
      return TRANSLATIONS[language][key];
    }
    
    const fallbackLang = language === 'ar' ? 'en' : 'ar';
    if (TRANSLATIONS[fallbackLang] && TRANSLATIONS[fallbackLang][key] !== undefined) {
      console.warn(`⚠️  لم يتم العثور على "${key}" في اللغة ${language}، استخدم ${fallbackLang}`);
      return TRANSLATIONS[fallbackLang][key];
    }
    
    console.error(`❌ المفتاح "${key}" غير موجود في ملف الترجمات`);
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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