import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';
import PriceCalculator from '../components/PriceCalculator';
import { API_BASE_URL } from '../config';

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
              <p className="text-lg md:text-2xl font-light text-[var(--text-color)]/90 whitespace-nowrap">{t('hero.out_of_box')}</p>
              <span className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-[var(--text-color)]/60 to-transparent block"></span>
            </AdaptiveReveal>

            <AdaptiveReveal delay={0.2} className="relative mb-2 md:mb-8 w-full">
              <div className="absolute end-full top-0 lg:top-1/2 -translate-y-1/2 w-24 h-24 lg:w-44 lg:h-44 animate-float z-20 pointer-events-none opacity-40 lg:opacity-100">
                <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768684802/Asset_1_fwpljm.png" alt="نيزك" className="w-full h-full object-contain" />
              </div>
              <br />
              <h1 className="text-4xl md:text-6xl lg:text-[7rem] text-[var(--text-color)] glow-text">{t('hero.title')}</h1>
            </AdaptiveReveal>

            <AdaptiveReveal delay={0.4} className="max-w-[280px] md:max-w-2xl space-y-4 px-2 lg:px-0 mx-auto lg:mx-0">
              <p className="text-base md:text-xl lg:text-2xl text-[var(--text-color)]/70 leading-relaxed font-light">{t('hero.desc1')}</p>
              <p className="text-base md:text-xl lg:text-2xl text-[var(--text-color)]/70 leading-relaxed font-light hidden md:block">{t('hero.desc2')}</p>
            </AdaptiveReveal>
          </div>
        </div>
      </section>

      <section className="relative min-h-fit py-2 md:py-20 flex flex-col items-center overflow-visible z-30">
        <AdaptiveReveal delay={0.2} className="z-50 mb-6 md:mb-16">
          <Link to={`/${language}/services`}>
            <button className="px-8 md:px-14 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#1a1b26]/60 border border-blue-500 text-blue-400 text-xl md:text-4xl font-bold backdrop-blur-xl transition-all hover:scale-105">
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
                    className={`flex-shrink-0 w-[60vw] md:w-[550px] aspect-video rounded-xl md:rounded-2xl border-2 md:border-4 bg-transparent backdrop-blur-sm overflow-hidden snap-center relative transition-all duration-500 block ${isActive ? 'scale-100 opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.6)] border-white' : 'scale-90 opacity-60 blur-[1px] border-white/50'}`}
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
          <h2 className="md:hidden md:inline-block text-2xl md:text-4xl text-[var(--text-color)] glow-text" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
          <h2 className="hidden md:block text-2xl md:text-6xl lg:text-[7rem] text-[var(--text-color)] glow-text">
            {t('goals.title')}
          </h2>
          <p className="text-sm md:text-3xl text-[var(--text-color)]/90 leading-relaxed text-center font-light px-2 md:px-4 max-w-[280px] md:max-w-none mx-auto -mt-12 md:mt-0">
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
          <h2 className="text-4xl md:text-8xl lg:text-[9rem] text-[var(--text-color)] glow-text mb-24 md:mb-0">
            {t('ambition.title')}
          </h2>
        </AdaptiveReveal>
        <br className="hidden md:block" />
        <div className="max-w-2xl space-y-1 px-2 md:px-0 transform -translate-y-20 md:translate-y-0 mt-4 md:mt-0">
          <AdaptiveReveal delay={0.2}><p className="text-base md:text-3xl text-[var(--text-color)]/90 font-medium">{t('ambition.p1')}</p></AdaptiveReveal>
          <AdaptiveReveal delay={0.4}><p className="text-base md:text-3xl text-[var(--text-color)]/90 font-medium">{t('ambition.p2')}</p></AdaptiveReveal>
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
        <div className="relative aspect-[21/9] w-full overflow-hidden border-y border-white/5">
          <img src="https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686177/zzzz_rprsbt.png" alt="Studio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-transparent"></div>
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
          <h2 className="text-4xl md:text-8xl lg:text-[9rem] text-[var(--text-color)] glow-text">{t('idea.title')}</h2>
          <br className="hidden md:block" />
        </AdaptiveReveal>
        <div className="space-y-4 max-w-3xl mx-auto mt-4 md:mt-0">
          <AdaptiveReveal delay={0.2}><p className="text-xl md:text-3xl text-[var(--text-color)]/90 font-medium">{t('idea.p1')}</p></AdaptiveReveal>
          <AdaptiveReveal delay={0.4}><p className="text-xl md:text-3xl text-[var(--text-color)]/90 font-medium">{t('idea.p2')}</p></AdaptiveReveal>
        </div>
      </div>
    </section>
  );
};

// --- سكشن شركاء النجاح (Partners) ---
const Partners = () => {
  const { language } = useLanguage();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/partners`)
      .then(res => res.json())
      .then(data => setPartners(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  if (!Array.isArray(partners) || partners.length === 0) return null;

  // Function to render a set of logos
  const renderLogoSet = (prefix) => {
    // Repeat partners internally (4 times) to ensure the set is much wider than any screen
    const widePartners = [...partners, ...partners, ...partners, ...partners];
    return (
      <div className="flex gap-20 md:gap-40 pr-20 md:pr-40 items-center flex-nowrap">
        {widePartners.map((p, idx) => {
          const logoSrc = p.logoUrl?.startsWith('http') ? p.logoUrl : `${API_BASE_URL}${p.logoUrl}`;
          return (
            <div key={`${prefix}-${p.id || idx}-${idx}`} className="relative h-32 md:h-56 w-auto flex-shrink-0 transition-all duration-500 hover:scale-110 cursor-pointer group">
              <img
                src={logoSrc}
                alt={p.name}
                className="h-full w-auto object-contain transition-all duration-500 hover:scale-105"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-20 relative z-20 overflow-hidden">
      <div className="w-full text-center">
        <AdaptiveReveal>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-color)] mb-16 glow-text">
            {language === 'ar' ? 'شركاء النجاح' : 'Our Clients'} 🤝
          </h2>
        </AdaptiveReveal>

        <div className="relative w-full overflow-hidden" dir="ltr">
          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 w-20 md:w-40 h-full bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-20 md:w-40 h-full bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-marquee flex-nowrap">
            {renderLogoSet('set1')}
            {renderLogoSet('set2')}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- سكشن آراء العملاء (Testimonials) ---
const Testimonials = () => {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '', rating: 0, file: null });
  const [status, setStatus] = useState('idle');
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 1 : 3;

  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonials`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  useEffect(() => {
    if (reviews.length <= itemsPerPage) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [reviews.length, totalPages]);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('content', formData.content);
      data.append('rating', formData.rating);
      if (formData.file) {
        data.append('image', formData.file);
      }

      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        body: data
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsModalOpen(false);
          setStatus('idle');
          setFormData({ name: '', content: '', rating: 0, file: null });
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, 2000);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Submission failed:', errData);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-20 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <AdaptiveReveal>
            <h2 className="text-3xl md:text-5xl font-black text-center md:text-start text-[var(--text-color)] glow-text">
              {t('common.review_label')} ⭐
            </h2>
          </AdaptiveReveal>
          <AdaptiveReveal delay={0.2}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg active:scale-95 flex items-center gap-2 hover-lift hover-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              {t('common.write_review')}
            </button>
          </AdaptiveReveal>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(${language === 'ar' ? (currentPage * 100) : -(currentPage * 100)}%)` }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <div key={pageIdx} className={`min-w-full grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} gap-8 px-2`}>
                {reviews.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).map((review) => (
                  <div key={review.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-3xl backdrop-blur-sm hover:translate-y-[-10px] transition-all duration-500 hover:bg-[var(--glass-bg)] group h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-blue-500/30 flex items-center justify-center bg-blue-500/20 text-blue-400 font-bold text-xl relative">
                          {review.imagePath ? (
                            <img src={`${API_BASE_URL}${review.imagePath}`} alt={review.name} className="w-full h-full object-cover" />
                          ) : (
                            review.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h4 className="text-[var(--text-color)] font-bold text-lg">{review.name}</h4>
                        </div>
                      </div>
                      <p className="text-[var(--text-color)]/70 leading-relaxed italic mb-6">
                        <span className="text-2xl md:text-3xl text-blue-500/40 align-top mr-1">"</span>
                        {review.content}
                        <span className="text-2xl md:text-3xl text-blue-500/40 align-bottom ml-1">"</span>
                      </p>
                    </div>
                    <div className="flex gap-1 text-yellow-500 text-sm">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < review.rating ? "text-yellow-500" : "text-gray-600"}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i ? 'bg-blue-600 w-6' : 'bg-white/20'}`}
                />
              ))}
            </div>
          )}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-sm">
            <p className="text-gray-400 text-lg mb-4">{language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
            <p className="text-gray-500 text-sm">{language === 'ar' ? 'كن أول من يشاركنا رأيه!' : 'Be the first to share your feedback!'}</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('common.review_success')}</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-black text-white mb-6 text-center">{t('common.write_review')} ✍️</h2>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('common.name_label')}</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('common.rating_label')}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? 'text-yellow-500' : 'text-gray-600'}`}>★</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t('common.review_label')}</label>
                  <textarea required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-24 resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">{language === 'ar' ? 'صورة شخصية (اختياري)' : 'Profile Picture (Optional)'}</label>
                  <label className="relative flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus-within:border-blue-500 transition-all cursor-pointer group">
                    <span className="text-sm text-gray-400 truncate pr-4">
                      {formData.file ? formData.file.name : (language === 'ar' ? 'اختر صورة...' : 'Choose image...')}
                    </span>
                    <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-shrink-0">
                      {language === 'ar' ? 'رفع' : 'Upload'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                </div>

                <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {status === 'submitting' ? '...' : t('common.submit_review')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// --- الصفحة الرئيسية الكاملة ---
const Home = () => {
  return (
    <main className="w-full relative">
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
        {/* <PriceCalculator /> */}
        <Partners />
        <Testimonials />
      </div>
    </main>
  );
};

export default Home;
