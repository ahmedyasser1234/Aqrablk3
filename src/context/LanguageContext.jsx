// src/context/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from './translations';

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  // جلب اللغة من localStorage
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('aqrablik-language');
    return savedLanguage || 'ar'; // إفتراضي عربي
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('aqrablik-language', newLanguage);
  };

  useEffect(() => {
    console.log('🌐 تغيير اللغة إلى:', language);
    
    // تغيير direction للصفحة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // استخدام TheYearOfHandicrafts فقط
    document.body.style.fontFamily = "'TheYearOfHandicrafts', sans-serif";
    
    // إزالة أي روابط لـ Google Fonts
    const googleFontsLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Cairo"]');
    if (googleFontsLink) {
      googleFontsLink.remove();
    }
    
  }, [language]);

  // دالة للترجمة
  const t = useCallback((key) => {
    // البحث المباشر في الكائن المسطح
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key] !== undefined) {
      return TRANSLATIONS[language][key];
    }
    
    // إذا لم يجد، ابحث في اللغة الأخرى
    const fallbackLang = language === 'ar' ? 'en' : 'ar';
    if (TRANSLATIONS[fallbackLang] && TRANSLATIONS[fallbackLang][key] !== undefined) {
      console.warn(`⚠️  لم يتم العثور على "${key}" في اللغة ${language}، استخدم ${fallbackLang}`);
      return TRANSLATIONS[fallbackLang][key];
    }
    
    // إذا لم يجد في أي لغة
    console.error(`❌ المفتاح "${key}" غير موجود في ملف الترجمات`);
    return key; // إرجاع المفتاح نفسه
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