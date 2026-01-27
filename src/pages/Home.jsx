import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import BackgroundEffects from '../components/BackgroundEffects';

// مكون مساعد لإيقاف التأثير على الموبايل فقط دون تغيير التصميم
const AdaptiveReveal = ({ children, ...props }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <div className={props.className}>{children}</div>;
  }
  return <ScrollReveal {...props}>{children}</ScrollReveal>;
};

// --- سكشن الهيرو (Hero) ---
const Hero = () => {
  const { t, language } = useLanguage();
  const sliderRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

const sliderData = [
  { 
    name: t('service.motion'), 
    path: `/${language}/services/motion-graphics`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768953994/slider_motion_tlngez.png", 
    color: '#3b82f6' 
  },
  { 
    name: t('service.montage'), 
    path: `/${language}/services/montage`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768953880/slider_edit_nevqxr.png", 
    color: '#a855f7' 
  },
  { 
    name: t('service.photography'), 
    path: `/${language}/services/photography`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768954110/slider_photgraph_mloxjg.png", 
    color: '#22d3ee' 
  },
  { 
    name: t('service.studio'), 
    path: `/${language}/services/studio-rental`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768954039/slider_studio_vcmsls.png", 
    color: '#fb923c' 
  },
  { 
    name: t('service.web'), 
    path: `/${language}/services/web-design`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768954079/slider_web_desiin_j7j8wj.png", 
    color: '#6366f1' 
  },
  { 
    name: t('service.content'), 
    path: `/${language}/services/content-writing`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768954117/slider_wreiter_ipuawb.png", 
    color: '#38bdf8' 
  },
  { 
    name: t('service.marketing'), 
    path: `/${language}/services/marketing`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768953988/slider_markting_bz8ax1.png", 
    color: '#ec4899' 
  },
  { 
    name: t('service.design'), 
    path: `/${language}/services/design`, 
    image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768953715/slider_design_gsjqck.png", 
    color: '#2ee64d' 
  },
];

  const scrollToIndex = (index) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const targetItem = container.children[index];
      if (targetItem) {
        const targetScroll = targetItem.offsetLeft - (container.clientWidth / 2) + (targetItem.offsetWidth / 2);
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollPos(percentage);
      const containerCenter = scrollLeft + clientWidth / 2;
      const items = Array.from(sliderRef.current.children);
      let closestIndex = 0;
      let minDistance = Infinity;
      items.forEach((item, index) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < minDistance) { closestIndex = index; minDistance = distance; }
      });
      if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderData.length;
      scrollToIndex(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, sliderData.length]);

  return (
    <div className="flex flex-col w-full">
      <section className="relative min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center px-6 pt-16 md:pt-16 overflow-hidden">
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-start w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-14 md:h-14 z-50 animate-orbit pointer-events-none hidden md:block">
              <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768684802/Asset_1_fwpljm.png" alt="شهاب" className="w-full h-full object-contain brightness-110" />
            </div>

            <AdaptiveReveal className="flex items-center gap-4 mb-2 opacity-80 relative mx-auto lg:mx-0">
              <p className="text-lg md:text-2xl font-light text-white/90 whitespace-nowrap">{t('hero.out_of_box')}</p>
              <span className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-white/60 to-transparent block"></span>
            </AdaptiveReveal>

            <AdaptiveReveal delay={0.2} className="relative mb-2 md:mb-8 w-full">
              <div className="absolute end-full top-0 lg:top-1/2 -translate-y-1/2 w-24 h-24 lg:w-44 lg:h-44 animate-float z-20 pointer-events-none opacity-40 lg:opacity-100">
                <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768684802/Asset_1_fwpljm.png" alt="نيزك" className="w-full h-full object-contain" />
              </div>
              <br />
              <h1 className="text-4xl md:text-6xl lg:text-[7rem] text-white glow-text drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{t('hero.title')}</h1>
            </AdaptiveReveal>

            <AdaptiveReveal delay={0.4} className="max-w-[280px] md:max-w-2xl space-y-4 px-2 lg:px-0 mx-auto lg:mx-0">
              <p className="text-base md:text-xl lg:text-2xl text-white/70 leading-relaxed font-light">{t('hero.desc1')}</p>
              <p className="text-base md:text-xl lg:text-2xl text-white/70 leading-relaxed font-light hidden md:block">{t('hero.desc2')}</p>
            </AdaptiveReveal>
          </div>
        </div>
      </section>

      <section className="relative min-h-fit py-2 md:py-20 flex flex-col items-center overflow-visible z-30">
        <AdaptiveReveal delay={0.2} className="z-50 mb-6 md:mb-16">
          <Link to={`/${language}/services`}>
  <button className="...">
    {t('nav.discover')}
  </button>
</Link>
        </AdaptiveReveal>

        <div className="relative w-full max-w-full flex items-center justify-center">
          <div
            className="absolute z-40 top-1/2 left-1/2 pointer-events-none transition-transform duration-500 ease-out flex flex-col items-center"
            style={{ transform: `translate(calc(-50% + ${(scrollPos - 0.5) * (language === 'ar' ? 80 : -80)}px), -10%)` }}
          >
            <div className="relative w-[80px] md:w-[180px] animate-float">
              <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768685845/ccc_ninmwa.png" alt="رائد فضاء" className={`w-full h-auto ${language === 'en' ? 'scale-x-[-1]' : ''}`} />
            </div>

            {/* تم إضافة hidden md:flex هنا ليختفي في الموبايل ويظهر في الديسكتوب */}
            <div className="hidden md:flex items-center gap-2 mt-4 md:mt-8 pointer-events-auto h-8 relative bg-transparent">
              {sliderData.map((service, index) => {
                const isActive = activeIndex === index;
                return (
                  <div key={index} className="relative flex flex-col items-center justify-center">
                    {isActive && (
                      <img
                        src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768684802/Asset_1_fwpljm.png"
                        alt="ufo"
                        className="absolute -top-5 md:-top-7 w-4 h-4 md:w-6 md:h-6 animate-pulse"
                      />
                    )}
                    <button
                      onClick={() => scrollToIndex(index)}
                      style={{
                        backgroundColor: isActive ? service.color : 'rgba(255,255,255,0.2)',
                        width: isActive ? (window.innerWidth < 768 ? '25px' : '40px') : '8px',
                      }}
                      className="h-2 rounded-full transition-all duration-500 ease-in-out border-none outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <AdaptiveReveal delay={0.4} className="w-full">
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex gap-4 md:gap-6 overflow-x-auto py-8 md:py-20 px-[20vw] md:px-[35vw] scrollbar-hide snap-x snap-mandatory w-full border-none"
            >
              {sliderData.map((service, index) => {
                const isActive = activeIndex === index;
                return (
                  <Link
                    key={index} to={service.path}
                    style={{ borderColor: isActive ? service.color : `${service.color}1a` }}
                    className={`flex-shrink-0 w-[60vw] md:w-[550px] aspect-video rounded-xl md:rounded-2xl border-2 md:border-4 bg-[#161720]/40 backdrop-blur-sm overflow-hidden snap-center relative transition-all duration-500 block ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40 blur-[2px]'}`}
                  >
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-10 text-start bg-gradient-to-t from-black/80 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{service.name}</h3>
                      <div className="w-8 md:w-12 h-1 rounded-full" style={{ backgroundColor: service.color }}></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </AdaptiveReveal>
        </div>
      </section>
    </div>
  );
};

// --- سكشن الأهداف (Goals) ---
const Goals = () => {
  const { t, language } = useLanguage();
  return (
    <section className="relative py-6 md:py-24 px-6 z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center relative z-20">
        <div className={`flex md:hidden w-full justify-between items-center mb-4 px-0 ${language === 'en' ? 'flex-row-reverse' : 'flex-row'}`} dir="ltr">
          <div className="w-[28%] animate-float pointer-events-none z-40">
            <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686175/cccc_irddlo.png" alt="رائد فضاء" className={`w-full h-auto opacity-100 ${language === 'en' ? 'scale-x-[-1]' : ''}`} />
          </div>
          <h2 className="md:hidden md:inline-block text-2xl md:text-4xl text-white glow-text" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {t('goals.title')}
          </h2>
          <div className="w-[22%] animate-float pointer-events-none z-40" style={{ animationDelay: '1s' }}>
            <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686171/Asset_8_rhau52.png" alt="لوحة الهدف" className={`w-full h-auto opacity-100 ${language === 'en' ? 'scale-x-[-1]' : ''}`} />
          </div>
        </div>

        <div className={`hidden md:block absolute top-[-55%] -translate-y-1/2 w-[300px] pointer-events-none z-40 animate-float opacity-100 ${language === 'ar' ? 'left-[-130px]' : 'right-[-130px]'}`}>
          <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686175/cccc_irddlo.png" alt="رائد فضاء" className={`w-full h-auto ${language === 'en' ? 'scale-x-[-1]' : ''}`} />
        </div>

        <ScrollReveal className="relative z-30 flex flex-col items-center max-w-3xl pt-0 md:pt-0">
          <h2 className="hidden md:block text-2xl md:text-6xl lg:text-[7rem] text-white glow-text">
            {t('goals.title')}
          </h2>
          <p className="text-sm md:text-3xl text-white/90 leading-relaxed text-center font-light px-2 md:px-4 max-w-[280px] md:max-w-none mx-auto -mt-12 md:mt-0">
            {t('goals.desc_main')}
          </p>
        </ScrollReveal>

        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[250px] pointer-events-none z-40 opacity-100 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
          <div className="relative animate-float" style={{ animationDelay: '1s' }}>
            <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686171/Asset_8_rhau52.png" alt="لوحة الهدف" className={`w-full h-auto ${language === 'en' ? 'scale-x-[-1]' : ''}`} />
          </div>
        </div>
      </div>
    </section>
  );
};


// --- سكشن الطموح (Ambition) ---
const Ambition = () => {
  const { t, language } = useLanguage();
  return (
    <section className="relative py-4 md:py-20 px-6 md:px-20 min-h-[50vh] md:min-h-[80vh] flex items-center justify-center z-20 overflow-visible">
      <div className={`absolute top-1/2 -translate-y-1/2 w-24 md:w-60 animate-float  pointer-events-none z-10 ${language === 'en' ? 'right-4 md:right-10' : 'left-4 md:left-10'}`}>
        <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768684802/Asset_1_fwpljm.png" alt="meteor" className={`w-full h-auto -translate-y-20 md:translate-y-0 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
      </div>

      <div className={`absolute top-1 md:top-10 w-40 md:w-[600px] animate-float z-40 pointer-events-none ${language === 'en' ? 'left-4' : 'left-1/2 -translate-x-1/2 md:right-10 md:left-auto md:translate-x-0'}`}
        style={{ top: language === 'en' ? '4px' : '1rem' }}
      >
        <img src={language === 'en' ? 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768753480/FLAG_REVARS_fyvedl.png' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686185/xxxxx_chyx9k.png'} alt="flag" className="w-full opacity-100" />
      </div>

      <div className="relative z-30 max-w-5xl w-full flex flex-col items-center text-center pt-24 md:pt-0">
        <AdaptiveReveal>
          <h2 className="text-4xl md:text-8xl lg:text-[9rem] text-white glow-text mb-24 md:mb-0">
            {t('ambition.title')}
          </h2>
        </AdaptiveReveal>
        <br className="hidden md:block" />
        <div className="max-w-2xl space-y-1 px-2 md:px-0 transform -translate-y-20 md:translate-y-0 mt-4 md:mt-0">
          <AdaptiveReveal delay={0.2}><p className="text-base md:text-3xl text-white/90 font-medium">{t('ambition.p1')}</p></AdaptiveReveal>
          <AdaptiveReveal delay={0.4}><p className="text-base md:text-3xl text-white/90 font-medium">{t('ambition.p2')}</p></AdaptiveReveal>
        </div>
      </div>
    </section>
  );
};

// --- سكشن الاستوديو (Studio Showcase) ---
const StudioShowcase = () => {
  return (
    <section className="relative w-full py-10 px-0 overflow-hidden mt-8 md:mt-0">
      <AdaptiveReveal className="max-w-[1920px] mx-auto relative group">
        <div className="relative aspect-[21/9] w-full overflow-hidden border-y border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686177/zzzz_rprsbt.png" alt="Studio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080911] via-transparent to-[#080911] opacity-60"></div>
        </div>
      </AdaptiveReveal>
    </section>
  );
};

// --- سكشن نزرع الفكرة (Idea Planting) ---
const IdeaPlanting = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-10 md:py-20 px-6 md:px-20 overflow-hidden flex flex-col items-center justify-center text-center mt-8 md:mt-0">
      <div className="relative z-10 max-w-4xl">
        <AdaptiveReveal>
          <h2 className="text-4xl md:text-8xl lg:text-[9rem] text-white glow-text">{t('idea.title')}</h2>
          <br className="hidden md:block" />
        </AdaptiveReveal>
        <div className="space-y-4 max-w-3xl mx-auto mt-4 md:mt-0">
          <AdaptiveReveal delay={0.2}><p className="text-xl md:text-3xl text-white/90 font-medium">{t('idea.p1')}</p></AdaptiveReveal>
          <AdaptiveReveal delay={0.4}><p className="text-xl md:text-3xl text-white/90 font-medium">{t('idea.p2')}</p></AdaptiveReveal>
        </div>
      </div>
    </section>
  );
};

// --- الصفحة الرئيسية الكاملة ---
const Home = () => {
  return (
    <main className="w-full relative">
      <BackgroundEffects />
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        .animate-orbit { animation: orbit 20s linear infinite; }
        @media (max-width: 768px) {
          @keyframes orbit {
            from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="relative z-10">
        <Hero />
        <Goals />
        <Ambition />
        <StudioShowcase />
        <IdeaPlanting />
      </div>
    </main>
  );
};

export default Home;
