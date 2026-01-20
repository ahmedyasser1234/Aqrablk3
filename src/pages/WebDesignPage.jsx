import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // تأكد من المسار الصحيح
import ScrollReveal from '../components/ScrollReveal';

// 1. بيانات المشاريع
const webProjects = [
  { image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686440/arct_o02dz4.png", url: "https://architectegypt.com" },
  { image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686454/glax_asgtg5.png", url: "https://galaxyrepairuae.com" },
  { image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686455/sharik_mwmenl.png", url: "https://sharke1.netlify.app" },
  { image: "https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686457/shelter_i6bufo.png", url: "https://shelterhouseofcheese.com" }
];

const shopifyProjects = [
  { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop", url: "#" },
  { image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop", url: "#" },
  { image: "https://images.unsplash.com/photo-1523474253046-2cd2c98a697b?q=80&w=800&auto=format&fit=crop", url: "#" }
];

// 2. ألوان التوهج
const borderColors = ['#a855f7', '#6366f1', '#ec4899'];

const WebDesignPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-24 px-6 md:px-10 pb-20 overflow-hidden">
      <style>{`
        .glowing-border-box {
          position: relative;
          overflow: hidden;
          z-index: 0;
          border-radius: 2rem;
          box-shadow: 0 0 30px -5px var(--glow-color);
          border: 1px solid var(--glow-color);
          transition: all 0.3s ease;
        }
        .glowing-border-box:hover {
          box-shadow: 0 0 45px -2px var(--glow-color);
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16 min-h-[60vh]">
        
        {/* حاوية النصوص: lg:order-1 تظهر يميناً في العربي ويساراً في الإنجليزي */}
        <div className="w-full lg:w-1/2 text-center lg:text-start order-2 lg:order-1">
          <ScrollReveal>
            <h1 className="text-5xl md:text-8xl glow-text mb-6 md:mb-8 text-purple-400 font-black leading-tight">
              {t('page.web.title')}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl font-light">
              {t('page.web.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="flex gap-4 justify-center lg:justify-start">
            <a 
              href="https://wa.me/201099822822" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] inline-block text-center"
            >
              {t('common.start_project')}
            </a>
          </ScrollReveal>
        </div>

        {/* حاوية الصورة: lg:order-2 تظهر يساراً في العربي ويميناً في الإنجليزي */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <ScrollReveal delay={0.3}>
            <img 
              src={language === 'en' ? 'رابط_صورة_الانجليزي_هنا' : 'https://res.cloudinary.com/dk3wwuy5d/image/upload/v1768686522/Asset_4_2x_vu9c2h.png'} 
              alt="Web Design Astronaut" 
              className={`w-full animate-float drop-shadow-[0_0_50px_rgba(168,85,247,0.2)] object-contain transition-transform duration-500 ${
                language === 'en' ? 'scale-x-[-1]' : 'scale-x-[1]'
              }`} 
            />
          </ScrollReveal>
        </div>
      </section>

      {/* قسم المميزات بتصميم الـ Glowing Box */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 md:mb-20 font-black">
            {t('page.web.why_us')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i, index) => (
            <ScrollReveal key={i} delay={index * 0.1}>
              <div 
                className="glowing-border-box h-full"
                style={{ '--glow-color': borderColors[index] }}
              >
                <div className="relative z-10 h-full p-8 md:p-10 rounded-[2rem] bg-[#080911]/90 backdrop-blur-sm flex flex-col justify-center text-center lg:text-start">
                  <h3 className="text-2xl font-bold mb-4 text-purple-400">
                    {t(`page.web.feat${i}_title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-base md:text-lg">
                    {t(`page.web.feat${i}_desc`)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* قسم أعمالنا (Web Design Portfolio) */}
      <section className="py-16 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 font-black text-purple-300">
             {t('common.portfolio')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {webProjects.map((project, index) => (
             <ScrollReveal key={index} delay={index * 0.1}>
               <a 
                 href={project.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="glowing-border-box block aspect-video group"
                 style={{ '--glow-color': borderColors[index % borderColors.length] }}
               >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <img 
                      src={project.image} 
                      alt={`Project ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-6 py-2 border border-white/50 rounded-full backdrop-blur-md">
                        {t('common.view_work')}
                      </span>
                   </div>
                 </div>
               </a>
             </ScrollReveal>
           ))}
        </div>
      </section>

      {/* قسم أعمال شوبيفاي */}
      <section className="py-16 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl text-center glow-text mb-12 font-black text-blue-300">
             {t('page.web.shopify_portfolio')}
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {shopifyProjects.map((project, index) => (
             <ScrollReveal key={`shopify-${index}`} delay={index * 0.1}>
               <a 
                 href={project.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="glowing-border-box block aspect-video group"
                 style={{ '--glow-color': borderColors[(index + 1) % borderColors.length] }}
               >
                 <div className="w-full h-full rounded-[2rem] overflow-hidden relative z-10">
                   <img 
                      src={project.image} 
                      alt={`Shopify Project ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-6 py-2 border border-white/50 rounded-full backdrop-blur-md">
                        {t('common.view_work')}
                      </span>
                   </div>
                 </div>
               </a>
             </ScrollReveal>
           ))}
        </div>
      </section>

      {/* زينة الخلفية */}
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
    </div>
  );
};

export default WebDesignPage;