import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();
  
  return (
    <footer className="relative z-[20] w-full min-h-[109vh] flex items-end pb-12 px-10 md:px-20 overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686133/footer_cz659n.png" 
          alt="Astronaut on Moon" 
          className={`w-full h-full object-cover object-bottom opacity-100 ${language === 'en' ? 'scale-x-[-1]' : ''}`}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0  via-transparent to-transparent opacity-90 h-64"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-0">
        
        {/* معلومات التواصل */}
        <div className={`w-full md:w-1/3 flex flex-col items-center gap-2 order-2 ${
          language === 'ar' ? 'md:order-3 md:items-end md:text-end' : 'md:order-1 md:items-start md:text-start'
        }`}>
          <h3 className="text-xl md:text-3xl font-bold text-white glow-text mb-1 md:mb-2">{t('footer.contact_us')}</h3>
          
          <div className={`flex flex-col items-center gap-2 md:gap-3 text-white/80 text-base md:text-xl font-medium ${
            language === 'ar' ? 'md:items-end' : 'md:items-start'
          }`}>
            <div className="flex items-center gap-2 md:gap-3 group">
              <a href="tel:+201099822822" className="hover:text-blue-400 transition-colors order-1 text-sm md:text-xl" dir="ltr">+20 109 982 2822</a>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 md:gap-3 group">
              <a href="tel:+201014700317" className="hover:text-blue-400 transition-colors order-1 text-sm md:text-xl" dir="ltr">+20 101 470 0317</a>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 md:gap-3 group mt-0.5">
              <a href="mailto:info@aqrablik.com" className="hover:text-blue-400 transition-colors text-xs md:text-lg lowercase order-1">info@aqrablik.com</a>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-blue-400 opacity-70 group-hover:opacity-100 transition-opacity order-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* الشعار والحقوق */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-3 md:gap-4 text-center order-3 md:order-2">
          <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" alt="Aqrablik Media" className="h-14 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          <div className="opacity-60 text-[10px] md:text-sm tracking-widest text-white/80">
            <p>© {new Date().getFullYear()} {t('footer.rights')}</p>
          </div>
        </div>

        {/* الروابط - تم إضافة hidden لإخفائها في الموبايل و md:flex لإظهارها في الشاشات الكبيرة */}
        <div className={`hidden md:flex w-full md:w-1/3 flex-col items-center gap-2 md:gap-3 order-1 ${
          language === 'ar' ? 'md:order-1 md:items-start md:text-start' : 'md:order-3 md:items-end md:text-end'
        }`}>
          <Link to="/" className="text-lg md:text-2xl font-bold text-white hover:text-blue-400 transition-all glow-text">{t('nav.home')}</Link>
          <Link to="/services" className="text-lg md:text-2xl font-bold text-white hover:text-blue-400 transition-all glow-text">{t('nav.services')}</Link>
          <Link to="/about" className="text-lg md:text-2xl font-bold text-white hover:text-blue-400 transition-all glow-text">{t('nav.about')}</Link>
          <Link to="/contact" className="text-lg md:text-2xl font-bold text-white hover:text-blue-400 transition-all glow-text">{t('nav.contact')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
