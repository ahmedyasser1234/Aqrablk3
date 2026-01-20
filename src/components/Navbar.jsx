import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// نقل GlassCrackSVG خارج مكون Navbar
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

// تحسين الأداء باستخدام React.memo
const MemoizedGlassCrackSVG = React.memo(GlassCrackSVG);

const Navbar = () => {
  const [isCracked, setIsCracked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  
  const audioRef = useRef(null);

  const triggerCrack = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audio/glass-break.mp3');
        audioRef.current.volume = 0.4;
        audioRef.current.preload = 'auto';
      }
      
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.warn("Audio play failed:", e);
        const fallbackAudio = new Audio('/audio/glass-break.mp3');
        fallbackAudio.volume = 0.4;
        fallbackAudio.play().catch(() => {});
      });
    } catch (e) {
      console.warn("Audio error", e);
    }

    setIsCracked(true);
    setTimeout(() => setIsCracked(false), 1000);
    setIsMenuOpen(false);
  };

  const handleLinkClick = (path) => {
    triggerCrack();
    setIsDiscoverOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

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
    <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between pointer-events-none">
      
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
        
        /* إضافة تأثير الزجاج بدون بوردر */
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
      <div className="flex items-center md:ms-6 lg:ms-8 xl:ms-10 pointer-events-auto">
        <Link to="/" className="relative z-50" onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}>
          <img 
            src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686064/Asset_3_ypwlqu.png" 
            alt="Aqrablik Media Logo" 
            className="h-8 md:h-10 lg:h-12 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" 
          />
        </Link>
      </div>

      {/* Navigation Links Desktop */}
      <nav 
        className={`hidden lg:flex items-center glass-nav px-6 lg:px-8 py-2 lg:py-3 rounded-full gap-4 lg:gap-6 xl:gap-8 transition-all relative pointer-events-auto ${isCracked ? 'animate-shake' : ''}`}
      >
        {isCracked && <MemoizedGlassCrackSVG />}

        <Link 
          to="/" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}
          className={`text-sm lg:text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname === '/' ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.home')}
        </Link>

        <Link 
          to="/services" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/services'); }}
          className={`text-sm lg:text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname === '/services' ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.services')}
        </Link>
          
        <div className="relative z-10">
          <div 
            onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
            className={`text-sm lg:text-base font-medium hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer select-none ${isDiscoverOpen ? 'text-blue-400' : 'text-white'}`}
          >
            {t('nav.discover')}
            <svg className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ${isDiscoverOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className={`absolute top-full start-0 mt-3 lg:mt-4 w-56 lg:w-64 bg-[#080911]/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isDiscoverOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-col py-2">
              {discoverServices.map((service, index) => (
                <Link 
                  key={index} 
                  to={service.path} 
                  onClick={(e) => { e.preventDefault(); handleLinkClick(service.path); }}
                  className="px-4 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm text-white/80 hover:text-blue-400 hover:bg-white/5 transition-all text-start border-b border-white/5 last:border-0"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link 
          to="/about" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/about'); }}
          className={`text-sm lg:text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname === '/about' ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.about')}
        </Link>
        
        <Link 
          to="/contact" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('/contact'); }}
          className={`text-sm lg:text-base font-medium hover:text-blue-400 transition-colors relative z-10 ${location.pathname === '/contact' ? 'text-blue-400' : 'text-white'}`}
        >
          {t('nav.contact')}
        </Link>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 pointer-events-auto">
        <div 
          onClick={toggleLanguage}
          className="w-10 h-5 md:w-12 md:h-6 lg:w-14 lg:h-7 bg-white/5 rounded-full p-1 flex items-center cursor-pointer relative hover:bg-white/10 transition-all group"
        >
          <div className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-gray-400 rounded-full transition-all flex items-center justify-center text-[7px] md:text-[8px] lg:text-[9px] text-black font-bold absolute top-1 shadow-md z-10 ${language === 'ar' ? 'start-1' : 'start-5 md:start-6 lg:start-7'}`}>
            {language.toUpperCase()}
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className={`lg:hidden w-8 h-8 md:w-9 md:h-9 bg-white/5 rounded-full flex items-center justify-center text-white transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="hidden md:flex w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/5 rounded-full items-center justify-center cursor-pointer hover:bg-white/20 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#080911] z-[110] lg:hidden flex flex-col items-center overflow-y-auto py-16 md:py-20 px-6 md:px-8 transition-transform duration-500 pointer-events-auto ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button 
          onClick={() => setIsMenuOpen(false)}
          className="fixed top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer z-[120]"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full relative z-10 mt-8">
          <Link to="/" onClick={(e) => { e.preventDefault(); triggerCrack(); setTimeout(() => navigate('/'), 100); }} className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">
            {t('nav.home')}
          </Link>
          
          <Link to="/services" onClick={(e) => { e.preventDefault(); triggerCrack(); setTimeout(() => navigate('/services'), 100); }} className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">
            {t('nav.services')}
          </Link>
          
          <div className="flex flex-col items-center gap-3 md:gap-4 w-full py-3 md:py-4 border-y border-white/5">
            <div className="text-lg md:text-xl font-bold text-blue-400 mb-2">{t('nav.discover')}</div>
            {discoverServices.map((service, index) => (
              <Link 
                key={index} 
                to={service.path} 
                onClick={(e) => { e.preventDefault(); triggerCrack(); setTimeout(() => navigate(service.path), 100); }}
                className="text-base md:text-lg text-white/70 hover:text-blue-400 transition-all font-medium"
              >
                {service.name}
              </Link>
            ))}
          </div>

          <Link to="/about" onClick={(e) => { e.preventDefault(); triggerCrack(); setTimeout(() => navigate('/about'), 100); }} className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">
            {t('nav.about')}
          </Link>
          
          <Link to="/contact" onClick={(e) => { e.preventDefault(); triggerCrack(); setTimeout(() => navigate('/contact'), 100); }} className="text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;