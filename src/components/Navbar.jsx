import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t, toggleLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsDiscoverOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    toggleLanguage();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Helper to generate paths (no longer needs locale prefix)
  const p = (path) => path;

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
    <header 
      ref={navRef} 
      className={`fixed top-0 left-0 w-full z-[100] px-4 md:px-10 py-3 md:py-7 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[var(--bg-color)]/30 backdrop-blur-xl md:backdrop-blur-none border-b border-white/5 md:border-none' : ''}`}
    >

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
          background: var(--nav-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
        }
      `}</style>

      {/* Logo Section */}
      <div className="flex items-center md:ms-12">
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
        className={`hidden lg:flex items-center glass-nav px-8 py-3 rounded-full gap-8 transition-all relative ${isCracked ? 'animate-shake' : ''}`}
      >
        {isCracked && <GlassCrackSVG />}

        <Link
          to={p('/')}
          onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }}
          className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors relative z-10 ${location.pathname === p('/') || location.pathname === p('') ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}
        >
          {t('nav.home')}
        </Link>

        <Link
          to={p('/services')}
          onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }}
          className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors relative z-10 ${location.pathname.includes('/services') ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}
        >
          {t('nav.services')}
        </Link>

        <Link
          to={p('/blog')}
          onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }}
          className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors relative z-10 ${location.pathname.includes('/blog') ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}
        >
          {t('nav.blog')}
        </Link>

        <div className="relative z-10">
          <div
            onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
            className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors flex items-center gap-1 cursor-pointer select-none ${isDiscoverOpen ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}
          >
            {t('nav.discover')}
            <svg className={`w-4 h-4 transition-transform duration-300 ${isDiscoverOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className={`absolute top-full start-0 mt-4 w-64 bg-[var(--nav-bg)] backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isDiscoverOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible translate-y-2 pointer-events-none'}`}>
            <div className="flex flex-col py-2">
              {discoverServices.map((service, index) => (
                <Link
                  key={index}
                  to={p(service.path)}
                  onClick={() => {
                    triggerCrack();
                    setIsDiscoverOpen(false);
                  }}
                  className="px-6 py-3 text-sm text-[var(--text-color)]/80 hover:text-[var(--accent-color)] hover:bg-[var(--glass-bg)] transition-all text-start border-b border-[var(--border-color)] last:border-0"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link to={p('/about')} onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }} className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors relative z-10 ${location.pathname.includes('/about') ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}>{t('nav.about')}</Link>
        <Link to={p('/contact')} onClick={() => { triggerCrack(); setIsDiscoverOpen(false); }} className={`text-base font-bold hover:text-[var(--accent-color)] transition-colors relative z-10 ${location.pathname.includes('/contact') ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}>{t('nav.contact')}</Link>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-6 md:me-12">
        <div
          onClick={handleLanguageToggle}
          className="w-12 h-6 md:w-16 md:h-8 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-full p-1 flex items-center cursor-pointer relative hover:bg-[var(--glass-bg)]/80 transition-all group"
        >
          <div className={`w-4 h-4 md:w-6 md:h-6 bg-gray-400 rounded-full transition-all flex items-center justify-center text-[8px] md:text-[10px] text-black font-bold absolute top-1 shadow-md z-10 ${language === 'ar' ? 'start-1' : 'start-7 md:start-9'}`}>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 md:w-12 md:h-12 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-color)] hover:bg-[var(--glass-bg)]/80 transition-all"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
          ) : (
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className={`lg:hidden w-10 h-10 bg-white/5 border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-color)] transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-4">
          <div className={`flex items-center transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                className="w-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border-color)] rounded-full py-2 px-6 text-[var(--text-color)] text-sm focus:outline-none focus:border-blue-500/50"
              />
              <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>

          <div
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-12 h-12 bg-[var(--glass-bg)] border border-[var(--border-color)] rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--glass-bg)]/80 transition shadow-inner ${isSearchOpen ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[var(--bg-color)]/95 backdrop-blur-[30px] z-[110] lg:hidden flex flex-col items-center overflow-y-auto py-24 px-8 transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 end-6 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer z-[120]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mobile Search */}
        <div className="w-full max-w-sm mb-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث عن خدمات، مقالات...' : 'Search services, blogs...'}
              className={`w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:border-blue-500/50 ${language === 'ar' ? 'text-right' : 'text-left'}`}
            />
            <button type="submit" className={`absolute ${language === 'ar' ? 'start-4' : 'end-4'} top-1/2 -translate-y-1/2 text-gray-400`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 w-full relative z-10">
          <Link to={p('/')} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{t('nav.home')}</Link>
          <Link to={p('/services')} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{t('nav.services')}</Link>

          <div className="flex flex-col items-center gap-4 w-full py-6 border-y border-white/5 my-2">
            {discoverServices.map((service, index) => (
              <Link key={index} to={p(service.path)} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="text-lg text-white/70 hover:text-blue-400 transition-all font-bold tracking-tight">{service.name}</Link>
            ))}
          </div>

          <Link to={p('/blog')} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{t('nav.blog')}</Link>
          <Link to={p('/about')} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{t('nav.about')}</Link>
          <div className="flex gap-4 mt-4">
            <Link to={p('/terms')} onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white/40 hover:text-blue-400 transition-colors">{t('nav.terms')}</Link>
            <Link to={p('/privacy-policy')} onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white/40 hover:text-blue-400 transition-colors">{t('nav.privacy')}</Link>
          </div>
          <Link to={p('/contact')} onClick={() => { triggerCrack(); setIsMenuOpen(false); }} className="mt-4 text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{t('nav.contact')}</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
