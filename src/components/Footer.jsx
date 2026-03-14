import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle, loading, success, error

  // Helper for paths
  const p = (path) => path;

  const { isDarkMode } = useTheme();

  // Footer text colors - white for all
  const iconColor = 'text-white';
  const textColor = 'text-white font-bold';

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="relative z-[20] w-full min-h-[70vh] md:min-h-[109vh] flex items-end pb-10 px-6 md:px-20 overflow-hidden">

      {/* Background Space Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686133/footer_cz659n.png"
          alt="Space Footer Background"
          className={`w-full h-full object-contain md:object-cover object-bottom opacity-100 ${language === 'en' ? 'scale-x-[-1]' : ''}`}
          style={{ objectPosition: 'center bottom' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 via-transparent to-transparent opacity-90 h-64"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-12 mt-32 md:mt-56">
        
        {/* Main Footer Grid */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-0">
          
          {/* Column 1: Navigation Links (Side on Desktop) */}
          <div className="hidden md:flex w-full md:w-1/3 flex-col items-center md:items-start gap-4">
            <a href={p('/')} className={`text-xl font-bold ${textColor} hover:text-blue-500 transition-all glow-text`}>{t('nav.home')}</a>
            <a href={p('/services')} className={`text-xl font-bold ${textColor} hover:text-blue-500 transition-all glow-text`}>{t('nav.services')}</a>
            <a href={p('/blog')} className={`text-xl font-bold ${textColor} hover:text-blue-500 transition-all glow-text`}>{t('nav.blog')}</a>
            <a href={p('/about')} className={`text-xl font-bold ${textColor} hover:text-blue-500 transition-all glow-text`}>{t('nav.about')}</a>
            <a href={p('/contact')} className={`text-xl font-bold ${textColor} hover:text-blue-500 transition-all glow-text`}>{t('nav.contact')}</a>
          </div>

          {/* Column 2: Logo and Newsletter (Center on Desktop) */}
          <div className="w-full md:w-1/3 flex flex-col items-center gap-3 md:gap-6">
            <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" alt="Aqrablik Media" className="hidden md:block h-12 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            
            {/* Newsletter Form */}
            <div className="w-full max-w-[280px] md:max-w-sm px-3 py-3 md:px-4 md:py-4 rounded-xl md:rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 md:bg-transparent md:backdrop-blur-none md:border-none">
              <h4 className={`${textColor} text-[9px] md:text-xs uppercase tracking-widest mb-2 md:mb-4 opacity-90 flex items-center gap-2 justify-center`}>
                {language === 'en' && <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                {language === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Join our newsletter'}
                {language === 'ar' && <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center group w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني...' : 'Your email...'}
                  className={`w-full bg-white/5 border border-white/10 rounded-full py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-500 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`absolute ${language === 'ar' ? 'left-1' : 'right-1'} ${status === 'success' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white p-1.5 md:p-2.5 rounded-full transition-all shadow-lg active:scale-95 disabled:opacity-50`}
                >
                  {status === 'loading' ? (
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : status === 'success' ? (
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className={`w-3 h-3 md:w-4 md:h-4 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Contact Info (Side on Desktop) */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 md:gap-x-4 gap-y-2 md:gap-y-4 items-center" dir="ltr">
              {/* Phone 1 */}
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconColor} w-4 h-4 md:w-5 md:h-5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <a href="tel:+201099822822" className={`${textColor} hover:text-blue-500 transition-colors text-base md:text-xl tracking-wider`}>+20 109 982 2822</a>

              {/* Phone 2 */}
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconColor} w-4 h-4 md:w-5 md:h-5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <a href="tel:+201014700317" className={`${textColor} hover:text-blue-500 transition-colors text-base md:text-xl tracking-wider`}>+20 101 470 0317</a>

              {/* Email */}
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
                <svg xmlns="http://www.w3.org/2000/svg" className={`${iconColor} w-4 h-4 md:w-5 md:h-5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a href="mailto:info@aqrablkmedia.com" className={`${textColor} hover:text-blue-500 transition-colors text-xs md:text-lg lowercase tracking-wide`}>info@aqrablkmedia.com</a>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Centered Copyright */}
        <div className="w-full pt-6 md:pt-8 pb-4 border-t border-white/5 mt-4 md:mt-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="opacity-60 text-[8px] md:text-sm tracking-widest text-white/80 font-medium">
              <p dir="ltr">© {new Date().getFullYear()} {t('footer.rights')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
