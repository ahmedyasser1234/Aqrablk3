import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// GlassCrackSVG moved inside or local
const GlassCrackSVG = () => (
  <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible crack-animation">
    <g stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.8">
      <circle cx="200" cy="50" r="1.5" fill="white" />
      <path d="M200,50 L150,20 L100,5" />
      <path d="M200,50 L140,80 L80,95" />
      <path d="M200,50 L250,10 L320,0" />
      <path d="M200,50 L270,75 L350,90" />
      <path d="M200,50 L200,0" />
      <path d="M200,50 L200,100" />
      <path d="M200,50 L50,50" />
      <path d="M200,50 L350,50" />
      <path d="M175,35 L160,45 L150,40" />
      <path d="M225,35 L240,45 L250,40" />
      <path d="M180,65 L170,75 L155,70" />
      <path d="M220,65 L230,75 L245,70" />
      <path d="M180,50 Q180,30 200,30 Q220,30 220,50 Q220,70 200,70 Q180,70 180,50" strokeDasharray="2,2" />
      <path d="M160,50 Q160,10 200,10 Q240,10 240,50 Q240,90 200,90 Q160,90 160,50" strokeDasharray="4,2" />
      <path d="M120,15 L110,25" />
      <path d="M280,15 L290,25" />
      <path d="M120,85 L110,75" />
      <path d="M280,85 L290,75" />
    </g>
  </svg>
);

const Navbar = () => {
  const [isCracked, setIsCracked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage(); // removed toggleLanguage, will handle locally

  const triggerCrack = () => {
    try {
      const audio = new Audio('/audio/glass-break2.mp3');
      audio.volume = 0.4;
      audio.currentTime = 0;
      audio.play().catch(() => { });
    } catch (e) {
      console.warn("Audio error", e);
    }
    setIsCracked(true);
    setTimeout(() => setIsCracked(false), 1000);
    setIsMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    // Logic: replace current lang prefix with new one
    // e.g. /ar/services -> /en/services
    const currentPath = location.pathname; // /ar/services
    // Replace first occurrence of /ar or /en
    // Since we know structure is /:lang/..., safe to replace
    const newPath = currentPath.replace(`/${language}`, `/${newLang}`);
    navigate(newPath);
  };

  // Helper to generate locale-aware paths
  const p = (path) => `/${language}${path}`;

  const discoverServices = [
    { name: t('service.motion'), path: '/services/motion-graphics' },
    { name: t('service.montage'), path: '/services/montage' },
    { name: t('service.photography'), path: '/services/photography' },
    { name: t('service.design'), path: '/services/design' },
    { name: t('service.studio'), path: '/services/studio-rental' },
    { name: t('service.web'), path: '/services/web-design' },
    { name: t('service.content'), path: '/services/content-writing' },
    { name: t('service.marketing'), path: '/services/marketing' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 md:py-7 flex items-center justify-between pointer-events-none">

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-2px, -1px) rotate(-0.5deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-0.5deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-0.5deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .crack-animation {
          animation: crack-fade 1s forwards ease-out;
        }
        @keyframes crack-fade {
          0% { opacity: 0; transform: scale(0.5); }
          5% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Logo Section */}
      <div className="flex items-center md:ms-12 pointer-events-auto">
        <Link to={p('/')} className="relative z-50">
          <img
            src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png"
            alt="Aqrablik Media Logo"
            className="h-10 md:h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      {/* Navigation Links Desktop */}
      <nav
        className={`hidden lg:flex items-center glass-nav px-8 py-3 rounded-full gap-8 transition-all relative pointer-events-auto ${isCracked ? 'animate-shake' : ''}`}
      >
        {isCracked && <GlassCrackSVG />}

        <Link
          to={p('/')}
          onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }}
          className={`text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname === p('/') || location.pathname === p('') ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.home')}
        </Link>

        <Link
          to={p('/services')}
          onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }}
          className={`text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname.includes('/services') ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.services')}
        </Link>

        <div className="relative z-10">
          <div
            onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
            className={`text-base font-medium hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer select-none ${isDiscoverOpen ? 'text-blue-400' : 'text-white'}`}
          >
            {t('nav.discover')}
            <svg className={`w-4 h-4 transition-transform duration-300 ${isDiscoverOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className={`absolute top-full start-0 mt-4 w-64 bg-[#080911]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isDiscoverOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-col py-2">
              {discoverServices.map((service, index) => (
                <Link
                  key={index}
                  to={p(service.path)}
                  onClick={() => {
                    triggerCrack();
                    setIsDiscoverOpen(false);
                  }}
                  className="px-6 py-3 text-sm text-white/80 hover:text-blue-400 hover:bg-white/5 transition-all text-start border-b border-white/5 last:border-0"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link to={p('/about')} onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }} className={`text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname.includes('/about') ? 'text-blue-400' : 'text-white'}`}>{t('nav.about')}</Link>
        <Link to={p('/contact')} onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }} className={`text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname.includes('/contact') ? 'text-blue-400' : 'text-white'}`}>{t('nav.contact')}</Link>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-6 md:me-12 pointer-events-auto">
        <div
          onClick={handleLanguageToggle}
          className="w-12 h-6 md:w-16 md:h-8 bg-white/5 border border-white/10 rounded-full p-1 flex items-center cursor-pointer relative hover:bg-white/10 transition-all group"
        >
          <div className={`w-4 h-4 md:w-6 md:h-6 bg-gray-400 rounded-full transition-all flex items-center justify-center text-[8px] md:text-[10px] text-black font-bold absolute top-1 shadow-md z-10 ${language === 'ar' ? 'start-1' : 'start-7 md:start-9'}`}>
            {language.toUpperCase()}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className={`lg:hidden w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="hidden md:flex w-12 h-12 bg-white/5 border border-white/10 rounded-full items-center justify-center cursor-pointer hover:bg-white/20 transition shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#080911] z-[110] lg:hidden flex flex-col items-center overflow-y-auto py-20 px-10 transition-transform duration-500 pointer-events-auto ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="fixed top-6 right-6 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer z-[120]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center gap-6 w-full relative z-10">
          <Link to={p('/')} onClick={() => triggerCrack()} className="text-3xl font-bold text-white hover:text-blue-400 transition-colors">{t('nav.home')}</Link>
          <Link to={p('/services')} onClick={() => triggerCrack()} className="text-3xl font-bold text-white hover:text-blue-400 transition-colors">{t('nav.services')}</Link>

          <div className="flex flex-col items-center gap-5 w-full py-4 border-y border-white/5">
            {discoverServices.map((service, index) => (
              <Link key={index} to={p(service.path)} onClick={() => triggerCrack()} className="text-xl text-white/70 hover:text-blue-400 transition-all font-medium">{service.name}</Link>
            ))}
          </div>

          <Link to={p('/about')} onClick={() => triggerCrack()} className="text-3xl font-bold text-white hover:text-blue-400 transition-colors">{t('nav.about')}</Link>
          <Link to={p('/contact')} onClick={() => triggerCrack()} className="text-3xl font-bold text-white hover:text-blue-400 transition-colors">{t('nav.contact')}</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
