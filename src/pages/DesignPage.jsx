import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ScrollReveal from '../components/ScrollReveal';

// عينات من أعمال التصميم
const brandingImages = [
  {
    src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
    link: "#" 
  },
  {
    src: "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=800&auto=format&fit=crop",
    link: "#"
  },
  {
    src: "https://images.unsplash.com/photo-1541462608141-ad60f128bde2?q=80&w=800&auto=format&fit=crop",
    link: "#"
  }
];

const graphicImages = [
  {
    src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    link: "#" 
  },
  {
    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
    link: "#"
  },
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    link: "#"
  }
];

// ألوان التوهج (أرجواني، وردي، بنفسجي)
const borderColors = ['#a855f7', '#ec4899', '#8b5cf6'];

const DesignPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-24 px-6 md:px-10 pb-20">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh] md:min-h-[70vh]">
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <ScrollReveal delay={0.3}>
            <img 
              src={language === 'ar' 
                ? "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768848357/designer_ded03k.png" 
                : "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768844028/designer_flip_xbi533.png"} 
              alt="Design Astronaut" 
              className={`w-full h-auto animate-float drop-shadow-[0_0_50px_rgba(168,85,247,0.3)] ${language === 'ar' ? 'scale-x-[-1]' : ''}`} 
            />
          </ScrollReveal>
        </div>
      
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2 lg:order-1">
          <ScrollReveal>
            <h1 className="text-4xl md:text-8xl glow-text mb-6 md:mb-8 text-purple-400 font-black">
              {t('page.design.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.design.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex gap-4 justify-center lg:justify-start">
            <a 
              href="https://wa.me/201099822822" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all inline-block text-center shadow-lg shadow-purple-500/20"
            >
              {t('common.order_now')}
            </a>
          </ScrollReveal>
        </div>
      </section>
      
      {/* branding section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-pink-400">
            {t('page.design.gallery_branding')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {brandingImages.map((item, index) => (
            <ScrollReveal key={`brand-${index}`} delay={index * 0.1}>
              <div 
                className="glowing-border-box aspect-[4/3] group"
                style={{ '--glow-color': borderColors[index % borderColors.length] }}
              >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <img src={item.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Branding Work" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a href={item.link} className="text-white font-bold border border-white/30 px-6 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-all">
                       {t('common.view_work')}
                     </a>
                   </div>
                 </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* graphic design section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black text-purple-300">
            {t('page.design.gallery_graphic')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {graphicImages.map((item, index) => (
            <ScrollReveal key={`graphic-${index}`} delay={index * 0.1}>
              <div 
                className="glowing-border-box aspect-[2/3] group"
                style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
              >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <img src={item.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Graphic Design Work" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a href={item.link} className="text-white font-bold border border-white/30 px-6 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-all">
                       {t('common.view_work')}
                     </a>
                   </div>
                 </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      
      {/* Background Decor */}
      <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default DesignPage;